import {
  AfterFind,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  CATEGORIES,
  CategoryAttributes,
  CategoryCreationAttributes,
} from './Category.types';
import { CategoryTranslation } from './CategoryTranslation.model';
import { BaseModel } from '../../base';

@Table({
  modelName: 'category',
  paranoid: true,
  timestamps: true,
})
export class Category<
  A extends CategoryAttributes = CategoryAttributes, 
  B extends CategoryCreationAttributes = CategoryCreationAttributes> 
  extends BaseModel<A, B> 
  implements CategoryAttributes {
  
  public static async prepare() {
    for (const category of Object.values(CATEGORIES)) {
      await this.upsert(category);
    }
    const categories = await this.findAll();
    for (const category of categories) {
      await CategoryTranslation.translate(category, ['displayName']);
    }
  }

  @AfterFind
  static async legacySupport(cursor: Category | Category[]) {
    if (!cursor) {
      return;
    }
    const categories = Array.isArray(cursor) ? cursor : [cursor];
    for (const category of categories) {
      category.set('sentiment', 0, { raw: true });
    }
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;
  
  @Column({ 
    allowNull: false,
    type: DataType.STRING,
  })
  declare displayName: string;
    
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare icon: string;

  @Column({ type: DataType.BOOLEAN })
  declare disabled?: boolean;

  declare sentiment?: number;
  
}