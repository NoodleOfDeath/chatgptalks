import { FindOptions, Op } from 'sequelize';
import {
  Body,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { ReadingFormat } from './../../schema/resources/PostContent.types';
import { SummaryInteraction } from './../../schema/resources/summary/SummaryInteraction.model';
import { PayloadWithUserId } from '../../../../services/types';
import { AuthError, InternalError } from '../../middleware';
import {
  BulkResponse,
  DestroyResponse,
  FindAndCountOptions,
  InteractionRequest,
  InteractionResponse,
  InteractionType,
  Summary,
  SummaryCategory,
  SummaryContent,
  SummaryContentAttributes,
  SummaryResponse,
  User,
} from '../../schema';

function applyFilter(filter?: string) {
  if (!filter || filter.replace(/\s/g, '').length === 0) {
    return undefined;
  }
  if (/(\w+):(\w+)/.test(filter)) {
    const [key, value] = filter.split(':');
    if (/cat(egory)?/i.test(key)) {
      return { category: value } };
    }
  }
  return {
    [Op.or]: [
      { title: { [Op.iRegexp]: filter } },
      { originalTitle: { [Op.iRegexp]: filter } },
      { text: { [Op.iRegexp]: filter } },
      { longSummary: { [Op.iRegexp]: filter } },
      { summary: { [Op.iRegexp]: filter } },
      { shortSummary: { [Op.iRegexp]: filter } },
      { bullets: { [Op.contains]: [filter] } },
      { category: { [Op.iRegexp]: filter } },
      { subcategory: { [Op.iRegexp]: filter } },
      { tags: { [Op.contains]: [filter] } },
      { url: { [Op.iRegexp]: filter } },
    ],
  };
}

@Route('/v1/summary')
@Tags('Summary')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class SummaryController {

  @Get('/')
  public static async getSummaries(
    @Query() userId?: number,
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page
  ): Promise<BulkResponse<SummaryResponse>> {
    const options: FindAndCountOptions<Summary> = {
      attributes: { exclude: ['filteredText', 'rawText'] },
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
    };
    options.where = applyFilter(filter);
    const summaries = await Summary.findAndCountAll(options);
    if (userId) {
      await Promise.all(summaries.rows.map(async (row) => await row.addUserInteractions(userId)));
    }
    return summaries;
  }

  @Get('/id/:summaryId')
  public static async getSummary(
    @Path() summaryId: number,
    @Query() userId?: number
  ): Promise<SummaryResponse> {
    const summary = await Summary.findOne({ where: { id: summaryId } });
    if (userId) {
      await summary?.addUserInteractions(userId);
    }
    return summary;
  }

  @Get('/id/:summaryId/:format')
  public static async getContentForSummary(
    @Path() summaryId: number,
    @Path() format: ReadingFormat 
  ): Promise<SummaryContentAttributes> {
    const summary = await SummaryContent.findOne({
      where: {
        format,
        parentId: summaryId,
      },
    });
    return summary;
  }

  @Get('/category')
  public static async getSummaryCategories(
    @Query() userId?: number,
    @Query() filter?: string
  ): Promise<BulkResponse<SummaryCategory>> {
    const options: FindOptions<Summary> = {
      attributes: ['category'],
      group: ['category'],
      order: [['category', 'ASC']],
    };
    if (filter) {
      options.where = applyFilter(filter);
    }
    const summaries = await Summary.findAll(options);
    return { count: summaries.length, rows: summaries.map((row) => ({ category: row.category })) };
  }

  @Post('/interact/:targetId/view')
  public static async recordSummaryView(
    @Path() targetId: number,
    @Body() body: InteractionRequest
  ): Promise<InteractionResponse> {
    const {
      content, metadata, remoteAddr, 
    } = body;
    const interaction = await SummaryInteraction.create({
      content, metadata, remoteAddr, targetId, type: 'view',
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    const resource = await Summary.findByPk(targetId);
    return resource.toJSON().interactions;
  }
  
  @Security('jwt', ['standard:write'])
  @Post('/interact/:targetId/:type')
  public static async interactWithSummary(
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionRequest
  ): Promise<InteractionResponse> {
    const { user } = await User.from(body);
    const {
      content, metadata, remoteAddr, 
    } = body;
    const resource = await user.interactWithSummary(targetId, type, remoteAddr, content, metadata);
    return resource.toJSON().interactions;
  }
  
  @Security('jwt', ['god:*'])
  @Delete('/:targetId')
  public static async destroySummary(
    @Path() targetId: number,
    @Body() body: PayloadWithUserId
  ): Promise<DestroyResponse> {
    const { user } = await User.from(body);
    await user.destroySummary(targetId);
    return { success: true };
  }
  
  @Security('jwt', ['god:*'])
  @Patch('/restore/:targetId')
  public static async restoreSummary(
    @Path() targetId: number,
    @Body() body: PayloadWithUserId
  ): Promise<DestroyResponse> {
    const { user } = await User.from(body);
    await user.restoreSummary(targetId);
    return { success: true };
  }

}
