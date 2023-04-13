import { Router } from 'express';
import { query } from 'express-validator';

import { VersionController } from '../../controllers';
import { internalErrorHandler, validationMiddleware } from '../../middleware';

const router = Router();

router.get(
  '/releases',
  query('filter').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await VersionController.getReleases(req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;