import { Router } from 'express';
import { body, param } from 'express-validator';

import { EventController } from '../../controllers';
import {
  internalErrorHandler,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/',
  rateLimitMiddleware('30 per 1m'),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await EventController.getEvents(req);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/interact/:targetId/:type',
  rateLimitMiddleware('30 per 1m'),
  param('targetId').isNumeric(),
  param('type').isString(),
  body('value').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const { targetId, type } = req.params;
      const response = await EventController.interactWithEvent(req, targetId, type, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
