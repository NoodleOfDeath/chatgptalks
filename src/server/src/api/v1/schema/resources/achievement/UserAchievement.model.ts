import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import { PublicAchievementAttributes } from './Achievement.types';
import {
  UserAchievementAttributes,
  UserAchievementCreationAttributes,
} from './UserAchievement.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'user_achievement',
  paranoid: true,
  timestamps: true,
})
export class UserAchievement<
  A extends UserAchievementAttributes = UserAchievementAttributes,
  B extends UserAchievementCreationAttributes = UserAchievementCreationAttributes,
> extends BaseModel<A, B> implements UserAchievementAttributes {

  @Index({
    name: 'user_achievements_userId_achievementId_key',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare userId: number;

  @Index({
    name: 'user_achievements_userId_achievementId_key',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare achievementId: number;

  @Column({
    defaultValue: 0,
    type: DataType.FLOAT,
  })
  declare progress: number;

  @Column({ type: DataType.DATE })
  declare achievedAt?: Date;

  declare achievement: PublicAchievementAttributes;

}
