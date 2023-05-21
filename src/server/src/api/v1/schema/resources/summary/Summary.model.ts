import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { 
  READING_FORMATS,
  SummaryAttributes,
  SummaryCreationAttributes,
} from './Summary.types';
import { SummaryInteraction } from './SummaryInteraction.model';
import { PublicSummarySentimentAttributes } from './SummarySentiment.types';
import { Post } from '../Post.model';
import { PublicCategoryAttributes } from '../channel/Category.types';
import { PublicOutletAttributes } from '../channel/Outlet.types';
import { InteractionType } from '../interaction/Interaction.types';
import { PublicTranslationAttributes } from '../localization/Translation.types';

@Table({
  modelName: 'summary',
  paranoid: true,
  timestamps: true,
})
export class Summary extends Post<SummaryAttributes, SummaryCreationAttributes> implements SummaryAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare outletId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare categoryId: number;

  @Column({ type: DataType.INTEGER })
  declare subcategoryId?: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
    unique: true,
  })
  declare url: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare rawText: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare filteredText: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  declare originalTitle: string;

  @Column({ 
    defaultValue: new Date(0),
    type: DataType.DATE,
  })
  declare originalDate: Date;

  @Column({ 
    allowNull: false,
    type: DataType.TEXT,
  })
  declare summary: string;

  @Column({
    allowNull: false, 
    type: DataType.STRING(1024), 
  })
  declare shortSummary: string;

  @Column({
    defaultValue: [],
    type: DataType.ARRAY(DataType.STRING(1024)),
  })
  declare bullets: string[];

  formats = Object.values(READING_FORMATS);

  declare outlet: PublicOutletAttributes;
  declare category: PublicCategoryAttributes;
  declare subcategory?: PublicCategoryAttributes;

  declare sentiment?: number;
  declare sentiments?: PublicSummarySentimentAttributes[];

  declare translations?: PublicTranslationAttributes[];

  async getInteractions(userId?: number, type?: InteractionType | InteractionType[]) {
    if (userId && type) {
      return await SummaryInteraction.findAll({
        where: {
          targetId: this.id, type, userId, 
        },
      });
    } else if (userId) {
      return await SummaryInteraction.findAll({ where: { targetId: this.id, userId } });
    }
    return await SummaryInteraction.findAll({ where: { targetId: this.id } });
  }

}
