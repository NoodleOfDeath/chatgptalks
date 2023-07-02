import { Request as ExpressRequest } from 'express';
import {
  Body,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import {
  BulkMetadataResponse,
  BulkResponse,
  DestroyResponse,
  InteractionRequest,
} from '../';
import { BaseControllerWithPersistentStorageAccess } from '../';
import { MailService } from '../../../../services';
import { PayloadWithUserId } from '../../../../services/types';
import { AuthError, InternalError } from '../../middleware';
import {
  InteractionType,
  PublicRecapAttributes,
  PublicSummaryAttributes,
  PublicSummaryGroup,
  Recap,
  SearchSummariesPayload,
  Summary,
  SummaryInteraction,
  User,
} from '../../schema';

@Route('/v1/summary')
@Tags('Summary')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class SummaryController extends BaseControllerWithPersistentStorageAccess {

  @Get('/')
  public static async searchSummaries(
    @Request() req?: ExpressRequest,
    @Query() filter?: string,
    @Query() ids?: number[],
    @Query() excludeIds = false,
    @Query() matchType?: 'all' | 'any',
    @Query() interval?: string,
    @Query() locale?: string,
    @Query() start?: string,
    @Query() end: string = start !== undefined ? new Date().toISOString() : undefined,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() forceCache = false
  ): Promise<BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>> {
    const version = req?.headers['x-app-version'];
    if (/^2\.\d\.\d$/.test(JSON.stringify(version) || '')) {
      return {
        count: 0,
        rows: [],
      };
    }
    return await Summary.searchSummaries({
      end,
      excludeIds,
      filter,
      forceCache,
      ids,
      interval,
      locale,
      matchType,
      offset,
      page,
      pageSize,
      start,
    });
  }
  
  public static async searchSummariesInternal(payload: SearchSummariesPayload) {
    return await Summary.searchSummaries(payload) as BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>;
  }

  @Get('/topics')
  public static async getTopics(
    @Request() req?: ExpressRequest,
    @Query() filter?: string,
    @Query() ids?: number[],
    @Query() excludeIds = false,
    @Query() matchType?: 'all' | 'any',
    @Query() interval?: string,
    @Query() locale?: string,
    @Query() start?: string,
    @Query() end: string = start !== undefined ? new Date().toISOString() : undefined,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() forceCache = false
  ): Promise<BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>> {
    const version = req?.headers['x-app-version'];
    if (/^2\.\d\.\d$/.test(JSON.stringify(version) || '')) {
      return {
        count: 0,
        rows: [],
      };
    }
    return await Summary.getTopics({
      end,
      excludeIds,
      filter,
      forceCache,
      ids,
      interval,
      locale,
      matchType,
      offset,
      page,
      pageSize,
      start,
    });
  }
  
  public static async getTopicsInternal(payload: SearchSummariesPayload) {
    return await Summary.getTopics(payload) as BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>;
  }
  
  @Security('jwt')
  @Post('/interact/:targetId/:type')
  public static async interactWithSummary(
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionRequest
  ): Promise<PublicSummaryAttributes> {
    const { user } = await User.from(body, { ignoreIfNotResolved: true });
    const {
      content, metadata, remoteAddr, 
    } = body;
    const interaction = await SummaryInteraction.create({
      content, metadata, remoteAddr, targetId, type, userId: user?.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    if (type === 'feedback') {
      await new MailService().sendMailFromTemplate({
        from: 'user@readless.ai',
        subject: 'Feedback',
        text: [content, JSON.stringify(metadata)].join('\n\n'),
        to: 'feedback@readless.ai',
      });
    }
    const resource = await Summary.scope('public').findByPk(targetId);
    return resource;
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
  
  @Get('/recap')
  public static async getRecaps(
    @Request() _request: ExpressRequest,
    @Query() _filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0
  ): Promise<BulkResponse<PublicRecapAttributes>> {
    const recaps = await Recap.scope('public').findAndCountAll({
      limit: pageSize,
      offset: pageSize * page,
      order: [['createdAt', 'DESC']],
    });
    return recaps;
  }

}
