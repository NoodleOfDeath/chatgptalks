import { Table } from 'sequelize-typescript';

import {
  SummarySentimentAttributes,
  SummarySentimentCreationAttributes,
} from './SummarySentiment.types';
import { Sentiment } from '../sentiment/Sentiment.model';

@Table({
  modelName: 'summary_sentiment',
  paranoid: true,
  timestamps: true,
})
export class SummarySentiment<
  A extends SummarySentimentAttributes = SummarySentimentAttributes, 
  B extends SummarySentimentCreationAttributes = SummarySentimentCreationAttributes>
  extends Sentiment<A, B> 
  implements SummarySentimentAttributes {

}