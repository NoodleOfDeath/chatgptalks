import {
  Get,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
  
import { AuthError, InternalError } from '../../middleware';
import {
  BulkResponse,
  Category,
  CategoryAttributes,
  FindAndCountOptions,
} from '../../schema';

@Route('/v1/category')
@Tags('Category')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class CategoryController {
  
  @Get('/')
  public static async getCategories(
    @Query() userId?: number,
    @Query() filter?: string
  ): Promise<BulkResponse<CategoryAttributes>> {
    const options: FindAndCountOptions<Category> = { order: [['name', 'ASC']] };
    const categories = await Category.scope('public').findAndCountAll(options);
    return categories;
  }
  
}