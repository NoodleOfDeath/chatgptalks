import { Router } from 'express';
import { param } from 'express-validator';

import { pagination, validate } from '../../middleware';
import { SourceController } from './../../controllers/sources/index';
import { SourceAttributes } from '../../../../schema/v1/models';

const router = Router();

router.get(
  '/:category?/:subcategory?/:title?',
  param('category').isString().optional(),
  param('subcategory').isString().optional(),
  param('title').isString().optional(),
  ...pagination,
  validate,
  async (req, res) => {
    const { category, subcategory, title } = req.params;
    const { pageSize = 10, page = 0, offset = page * pageSize } = req.query;
    const controller = new SourceController();
    let response: SourceAttributes[] = [];
    if (category && subcategory && title) {
      response = await controller.getSourcesForCategoryAndSubCategoryAndTitle(
        category,
        subcategory,
        title,
        pageSize,
        page,
        offset,
      );
    } else if (category && subcategory) {
      response = await controller.getSourcesForCategoryAndSubCategory(category, subcategory, pageSize, page, offset);
    } else if (category) {
      response = await controller.getSourcesForCategory(category, pageSize, page, offset);
    } else {
      response = await controller.getSources(pageSize, page, offset);
    }
    res.json(response);
  },
);

export default router;
