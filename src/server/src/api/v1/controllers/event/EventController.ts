/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Get,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { BulkResponse } from '../';
import {
  AuthError,
  Request as ExpressRequest,
  InternalError,
} from '../../middleware';
import {
  Event,
  EventInteraction,
  InteractionCreationAttributes,
  InteractionType,
  PublicEventAttributes,
} from '../../schema';

@Route('/v1/event')
@Tags('Events')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class EventController {
  
  @Get('/')
  public static async getEvents(
    @Request() req: ExpressRequest
  ): Promise<BulkResponse<PublicEventAttributes>> {
    return {
      count: 0,
      rows: [],
    };
  }

  @Post('/interact/:targetId/:type')
  public static async interactWithEvent(
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionCreationAttributes
  ): Promise<PublicEventAttributes> {
    const user = req.jwt?.user;
    const interaction = await EventInteraction.create({
      ...body, 
      remoteAddr: req.ip,
      targetId,
      type,
      userId: user?.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    return Event.scope('public').findByPk(targetId);
  }
  
}