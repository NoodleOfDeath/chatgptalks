import { Router } from 'express';
import { body, oneOf } from 'express-validator';

import { AuthError } from './../../../../services';
import { AuthController } from '../../controllers';
import { validationMiddleware } from '../../middleware';

const router = Router();

router.post(
  '/login',
  oneOf([
    body('email').isEmail(),
    body('eth2address'),
    body('username').isString(),
    body('thirdParty').isObject(),
  ]),
  body('password')
    .if(body('eth2address').not().exists())
    .if(body('thirdParty').not().exists())
    .isString(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AuthController().login(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/register',
  oneOf([
    body('email').isEmail(),
    body('eth2address'),
    body('username').isString(),
    body('thirdParty').isObject(),
  ]),
  body('password')
    .if(body('eth2address').not().exists())
    .if(body('thirdParty').not().exists())
    .isString(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AuthController().register(req.body);
      res.status(201).json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/logout',
  body('userId').isInt().optional(),
  body('email').isEmail().optional(),
  body('eth2address').isString().optional(),
  body('username').isString().optional(),
  body('thirdParty').isObject().optional(),
  body('jwt').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AuthController().logout(req.body);
      res.status(204).json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/otp',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AuthController().generateOTP(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/verify/alias',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AuthController().verifyAlias(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/verify/otp',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AuthController().verifyOTP(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

export default router;
