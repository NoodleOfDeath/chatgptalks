import { ModelCtor, Sequelize } from 'sequelize-typescript';

import { addScopes, makeAssociations } from '../../api/v1/schema';
import * as Models from '../../api/v1/schema/models';
import { BaseService } from '../base';

export type DBServiceInitProps = {
  connectionString?: string;
  models?: ModelCtor[];
};

export class DBService extends BaseService {

  static sq: Sequelize;

  static async initTables({
    connectionString = process.env.PG_CONNECTION_STRING,
    models = [...Object.values(Models)],
  }: DBServiceInitProps = {}) {
    this.sq = new Sequelize(connectionString, {
      dialect: 'postgres',
      dialectOptions: { ssl: { rejectUnauthorized: false } },
      logging: process.env.SQL_LOGGING === 'true',
      models,
    });
    await this.sq.authenticate();
    makeAssociations();
    addScopes();
    await this.sq.sync();
  }

}
