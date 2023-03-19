import { Router } from 'express';
import { body } from 'express-validator';

import { MetricController } from '../../controllers';
import { validationMiddleware } from '../../middleware';

const router = Router();

router.post(
  '/',
  body('type').isString(),
  body('data').isObject(),
  body('userAgent').isString(),
  validationMiddleware,
  async (req, res) => {
    const {
      type, data, userAgent, 
    } = req.body;
    try {
      await new MetricController().recordMetric({
        data,
        referrer: req.ips,
        type,
        userAgent,
      });
      res.status(200).send('OK');
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  }
);

export default router;
