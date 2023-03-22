import bcrypt from 'bcryptjs';
import ms from 'ms';
import { Op } from 'sequelize';
import { Table } from 'sequelize-typescript';

import { SchemaError } from './../types';
import { AuthError } from '../../../../services';
import { Jwt } from '../../../../services/types';
import { BaseModel } from '../base';
import { Interaction } from '../interaction/Interaction.model';
import {
  Alias,
  ArticleInteraction,
  Credential,
  RefUserRole,
  Role,
  SourceInteraction,
} from '../models';
import {
  AliasCreationAttributes,
  AliasPayload,
  AliasType,
  CredentialCreationAttributes,
  CredentialType,
  FindAliasOptions,
  InteractionType,
  InteractionValue,
  ResourceSpecifier,
  ResourceType,
  UserAttributes,
  UserCreationAttributes,
} from '../types';

@Table({
  modelName: 'user',
  paranoid: true,
  timestamps: true,
})
export class User<A extends UserAttributes = UserAttributes, B extends UserCreationAttributes = UserCreationAttributes>
  extends BaseModel<A, B>
  implements UserAttributes {

  /** Resolves a user from an alias request/payload */
  public static async from(req: Partial<AliasPayload>, opts?: Partial<FindAliasOptions>) {
    if (req.userId) {
      const user = await User.findOne({ where: { id: req.userId } });
      if (!user && !opts?.ignoreIfNotResolved) {
        if (!opts?.ignoreIfNotResolved) {
          throw new AuthError('INVALID_CREDENTIALS');
        }
      }
      return { user };
    } else {
      const {
        alias, otp, payload, 
      } = await Alias.from(req, opts);
      if (!alias) {
        if (!opts?.ignoreIfNotResolved) {
          throw new AuthError('UNKNOWN_ALIAS', { alias: 'email' });
        }
        return { alias, payload };
      }
      return {
        alias,
        otp,
        payload, 
        user: await User.findOne({ where: { id: alias.toJSON().userId } }),
      };
    }
  }
  
  public async findAlias(type: AliasType) {
    return await Alias.findOne({ 
      where: {
        type,
        userId: this.id,
      },
    });
  }
  
  public async findAliases(type: AliasType, ...other: AliasType[]) {
    return await Alias.findAll({ 
      where: {
        type: { [Op.in]: [type, ...other] },
        userId: this.id,
      },
    });
  }

  public async createAlias(type: AliasType, value: string, attr: Omit<AliasCreationAttributes, 'type' | 'userId' | 'value'>) {
    return await Alias.create({
      type,
      userId: this.id,
      value,
      ...attr,
    });
  }

  public async findCredential(type: CredentialType, value?: string) {
    if (value) {
      return await Credential.findOne({
        where: {
          type,
          userId: this.id,
          value,
        }, 
      });
    }
    return await Credential.findOne({
      where: {
        type,
        userId: this.id,
      }, 
    });
  }
  
  public async findCredentials(type: CredentialType, ...other: CredentialType[]) {
    return await Credential.findAll({
      where: {
        type: { [Op.in]: [type, ...other] },
        userId: this.id,
      }, 
    });
  }

  public async createCredential<C extends CredentialType, V extends C extends 'jwt' ? Jwt : string>(type: C, rawValue: V, attr: Omit<CredentialCreationAttributes, 'type' | 'userId' | 'value'> = {}) {
    let value: string;
    let expiresAt: Date;
    if (typeof rawValue === 'string') {
      value = rawValue;
    } else {
      value = rawValue.signed;
      expiresAt = new Date(Date.now() + ms(rawValue.expiresIn));
    }
    if (type === 'password') {
      value = bcrypt.hashSync(value, process.env.PASSWORD_HASH_ROUNDS || 10);
    } else if (type === 'otp') {
      expiresAt = new Date(Date.now() + ms('15m'));
    }
    return await Credential.create({ 
      expiresAt,
      type,
      userId: this.id,
      value,
      ...attr,
    });
  }

  public async revokeCredential(type: CredentialType, value?: string) {
    if (value) {
      return await Credential.destroy({
        where: {
          type,
          userId: this.id,
          value,
        },
      });
    }
    return await Credential.destroy({
      where: {
        type,
        userId: this.id,
      },
    });
  }

  public async getRoles() {
    return Object.fromEntries((await Promise.all((await RefUserRole.findAll({ where: { userId: this.id } })).map(async (role) => (await Role.findOne({ where: { id: role.toJSON().roleId } }))?.toJSON() ))).map((role) => [role.name, role]));
  }

  public async grantRole(role: string) {
    const roleModel = await Role.findOne({ where: { name: role } });
    if (!roleModel) {
      throw new AuthError('BAD_REQUEST');
    }
    await RefUserRole.create({ roleId: roleModel.id, userId: this.id });
    return roleModel;
  }

  public async revokeRole(role: string) {
    const roleModel = await Role.findOne({ where: { name: role } });
    if (!roleModel) {
      throw new AuthError('BAD_REQUEST');
    }
    const count = await RefUserRole.destroy({ where: { roleId: roleModel.id, userId: this.id } });
    return count;
  } 
  
  public async interactWith<R extends ResourceType, T extends InteractionType>(resource: ResourceSpecifier<R>, type: T, value?: InteractionValue<T>) {
    let interaction: Interaction;
    if (resource.type === 'article') {
      interaction = await ArticleInteraction.findOne({
        where: {
          targetId: resource.id, type, userId: this.id, 
        }, 
      });
    } else
    if (resource.type === 'source') {
      interaction = await SourceInteraction.findOne({
        where: {
          targetId: resource.id, type, userId: this.id, 
        }, 
      });
    }
    if (!interaction) {
      throw new SchemaError('Unknown interaction type');
    }
    return await interaction?.apply(value);
  }

}
