import bcrypt from 'bcryptjs';
import ms from 'ms';
import {
  Op,
  QueryTypes,
  col,
  fn,
} from 'sequelize';
import { Table } from 'sequelize-typescript';

import { INTERACTION_TYPES } from './../resources/interaction/Interaction.types';
import { OpenAIService } from '../../../../services';
import {
  JWT,
  MetricsRequest,
  MetricsResponse,
} from '../../controllers/types';
import { AuthError, Request as ExpressRequest } from '../../middleware';
import {
  Achievement,
  Achievements,
  Alias,
  AliasCreationAttributes,
  AliasPayload,
  AliasType,
  CalculateStreakOptions,
  Category,
  CategoryInteraction,
  Credential,
  CredentialCreationAttributes,
  CredentialType,
  DestructuredCredentialPayload,
  FindAliasOptions,
  InteractionCount,
  InteractionType,
  MetadataType,
  Profile,
  Publisher,
  PublisherInteraction,
  QueryFactory,
  QueryOptions,
  RequestLog,
  Role,
  Streak,
  Summary,
  SummaryInteraction,
  ThirdParty,
  UserAchievement,
  UserAchievementCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
  UserEvent,
  UserMetadata,
  UserRole,
  UserStats,
} from '../../schema';
import { BaseModel } from '../base';

@Table({
  modelName: 'user',
  paranoid: true,
  timestamps: true,
})
export class User<A extends UserAttributes = UserAttributes, B extends UserCreationAttributes = UserCreationAttributes>
  extends BaseModel<A, B>
  implements UserAttributes {

  profile?: Profile;
  jwt?: JWT;

  // authentication methods

  /** Resolves a user from an alias request/payload */
  public static async from(payload: AliasPayload, opts?: Partial<FindAliasOptions>) {
    if (payload.userId) {
      const id = payload.userId ?? new JWT(payload.jwt).userId;
      const user = await User.findOne({ where: { id } });
      if (payload.jwt) {
        user.jwt = new JWT(payload.jwt);
      }
      if (!user && !opts?.ignoreIfNotResolved) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      return user;
    } else {
      const alias = await Alias.from(payload, opts);
      if (!alias) {
        if (!opts?.ignoreIfNotResolved) {
          throw new AuthError('UNKNOWN_ALIAS', { alias: 'email' });
        }
        return undefined;
      }
      const user = await User.findOne({ where: { id: alias.userId } });
      if (payload.jwt) {
        user.jwt = new JWT(payload.jwt);
      }
      return user;
    }
  }
  
  public async findAlias(type: AliasType) {
    if (type === 'userId') {
      return new Alias({
        type,
        value: `${this.id}`,
        verifiedAt: new Date(),
      });
    }
    return await Alias.findOne({ 
      where: {
        type,
        userId: this.id,
      },
    });
  }
  
  public async findAliases(...types: AliasType[]) {
    if (types.length === 0) {
      return await Alias.findAll({ where: { userId: this.id } });
    }
    return await Alias.findAll({ 
      where: {
        type: { [Op.in]: types },
        userId: this.id,
      },
    });
  }

  public async createAlias<A extends AliasType>(type: A, value: AliasPayload[A], attr: Omit<AliasCreationAttributes, 'type' | 'userId' | 'value'>) {
    return await Alias.create({
      type,
      userId: this.id,
      value: `${value}`,
      ...attr,
    });
  }

  public async generateUsername(): Promise<string> {
    let validUsername = false;
    let alias: Alias | null = null;
    const chatService = new OpenAIService();
    const reply = await chatService.send('Create a very very unique username between 8 and 16 characters long that contains only letters and numbers. And would never be guessed by anyone else.');
    alias = await Alias.findOne({ where: { value: reply } });
    validUsername = alias == null && reply.length > 8 && reply.length < 16 && Boolean(reply.match(/^[a-zA-Z0-9]+$/));
    if (!validUsername) {
      return await this.generateUsername();
    } else {
      await this.createAlias('username', reply, { verifiedAt: new Date() });
    }
    return reply;
  }

  // authorization methods

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

  public async createCredential<C extends CredentialType, V extends C extends 'jwt' ? JWT : string>(type: C, rawValue: V, attr: Omit<CredentialCreationAttributes, 'type' | 'userId' | 'value'> = {}) {
    let value: string;
    let expiresAt: Date;
    if (typeof rawValue === 'string') {
      value = rawValue;
    } else {
      value = rawValue.signed;
      if (rawValue.expiresIn) {
        expiresAt = new Date(Date.now() + ms(rawValue.expiresIn));
      }
    }
    if (type === 'password') {
      value = bcrypt.hashSync(value, process.env.PASSWORD_HASH_ROUNDS || 10);
    } else
    if (type === 'otp' || type === 'deleteToken') {
      expiresAt = new Date(Date.now() + ms(process.env.OTP_LIFESPAN || '15m'));
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
  
  public async authenticate({
    jwt,
    password,
  }: DestructuredCredentialPayload & { jwt?: string }) {
    if (jwt) {
      const token = new JWT(jwt);
      if (token.userId !== this.id) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      if (token.expired) {
        throw new AuthError('EXPIRED_CREDENTIALS');
      }
    } else
    if (password) {
      const credential = await this.findCredential('password');
      if (!credential) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      if (!bcrypt.compareSync(password, credential.value)) {
        throw new AuthError('INVALID_PASSWORD');
      }
    } else {
      throw new AuthError('INVALID_CREDENTIALS');
    }
  }
  
  // roles

  public async getRoles() {
    return Object.fromEntries((await Promise.all((await UserRole.findAll({ where: { userId: this.id } })).map(async (role) => (await Role.findOne({ where: { id: role.roleId } })) ))).map((role) => [role.name, role]));
  }
  
  public async highestRole() {
    const roles = Object.values(await this.getRoles());
    if (roles.length === 0) {
      return undefined;
    }
    return roles.sort((a, b) => b.priority - a.priority)[0];
  }
  
  public async hasRole(role: string) {
    return (await this.getRoles())[role] !== undefined;
  }
  
  public async hasScope(scope: string, ...other: string[]) {
    const roles = await this.getRoles();
    return [scope, ...other].every((scope) => Object.values(roles).some((role) => role.scope.includes(scope)));
  }

  public async grantRole(role: string) {
    const roleModel = await Role.findOne({ where: { name: role } });
    if (!roleModel) {
      throw new AuthError('BAD_REQUEST');
    }
    const userRole = await UserRole.findOne({ where: { roleId: roleModel.id, userId: this.id } });
    if (userRole) {
      return roleModel;
    }
    await UserRole.upsert({ roleId: roleModel.id, userId: this.id });
    return roleModel;
  }

  public async revokeRole(role: string) {
    const roleModel = await Role.findOne({ where: { name: role } });
    if (!roleModel) {
      throw new AuthError('BAD_REQUEST');
    }
    const count = await UserRole.destroy({ where: { roleId: roleModel.id, userId: this.id } });
    return count;
  }

  // profile

  public static async getStreaks({ 
    expiresIn = '1h',
    limit = 100,
    offset = 0,
    minCount = 0,
    userId = null,
  }: CalculateStreakOptions = {}): Promise<Streak[]> {
    const replacements = {
      limit: limit === 'ALL' ? 100 : limit,
      minCount,
      offset,
      userId, 
    };
    const response: Streak[] = (await User.sql.query(QueryFactory.getQuery('streak'), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as UserEvent<{min: string, max: string}>[]).map((e) => ({ 
      end: new Date(e.max),
      expiresSoon: (new Date(new Date().toLocaleDateString()).valueOf() + ms('1d') - new Date(e.updatedAt).valueOf()) < ms(expiresIn),
      length: e.count, 
      start: new Date(e.min),
      userId: e.userId,
      ...e,
    }));
    return response;
  }

  public static async getDaysActive({
    limit = 100,
    offset = 0,
    userId = null,
  }: QueryOptions = {}): Promise<InteractionCount[]> {
    const replacements = {
      limit: limit === 'ALL' ? 100 : limit,
      offset,
      userId, 
    };
    const response: InteractionCount[] = (await User.sql.query(QueryFactory.getQuery('days_active'), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as InteractionCount[]).map((e) => ({ 
      rank: e.userId === userId ? 0 : Number.MAX_SAFE_INTEGER,
      ...e,
    }));
    return response;
  }

  public static async getSummaryInteractionCounts(type: InteractionType, { 
    minCount = null,
    limit = 100,
    offset = 0, 
    ...req 
  }: QueryOptions = {}, user?: User): Promise<InteractionCount[]> {
    const replacements = {
      ...req,
      interval: null,
      limit,
      minCount,
      offset,
      type,
      userId: user?.id ?? null,
    };
    const response = (await User.sql.query(QueryFactory.getQuery('summary_interaction_count'), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as InteractionCount[]);
    return response;
  }

  public async getSummaryInteractions(type: InteractionType) {
    return await SummaryInteraction.findAll({
      attributes: ['targetId', [fn('max', col('summary_interaction.createdAt')), 'createdAt']],
      group: ['targetId'],
      order: [
        [fn('max', col('summary_interaction.createdAt')), 'desc'],
        ['targetId', 'desc'],
      ],
      where: {
        revert: false,
        type,
        userId: this.id,
      },
    });
  }

  public static async getMetrics(user?: User, req?: MetricsRequest): Promise<MetricsResponse> {
    const streaks = await User.getStreaks();
    const daysActive = await User.getDaysActive();
    const readCounts = await User.getSummaryInteractionCounts('read', req);
    const shareCounts = await User.getSummaryInteractionCounts('share', req);
    return {
      daysActive,
      interactionCounts: {
        ...Object.fromEntries(INTERACTION_TYPES.map((type) => [type, []])) as { [key in InteractionType]: [] },
        read: readCounts,
        share: shareCounts,
      },  
      streaks,
      userRankings: { 
        daysActive: daysActive.find((s) => s.userId === user?.id)?.rank ?? Number.MAX_SAFE_INTEGER,
        interactionCounts: {
          ...Object.fromEntries(INTERACTION_TYPES.map((type) => [type, 0])) as { [key in InteractionType]: number },
          read: readCounts.find((s) => s.userId === user?.id)?.rank ?? Number.MAX_SAFE_INTEGER,
          share: shareCounts.find((s) => s.userId === user?.id)?.rank ?? Number.MAX_SAFE_INTEGER,
        },
        streaks: streaks.find((s) => s.userId === user?.id)?.rank ?? Number.MAX_SAFE_INTEGER,
      },
      userStats: user ? await user.getStats() : undefined,
    };
  }
  
  public async calculateStreak({ 
    longest,
    ...options
  }: CalculateStreakOptions = {}): Promise<Streak> {
    let streak: Streak = {
      end: new Date(new Date().toDateString()),
      expiresSoon: false,
      length: 1,
      start: new Date(new Date().toDateString()), 
      updatedAt: new Date(),
      user: (await this.findAlias('username'))?.value,
      userId: this.id,
    };
    const streaks = await User.getStreaks({
      limit: 'ALL', 
      userId: this.id,
      ...options,
    });
    if (!longest) {
      return streaks.find(
        (s) => {
          return Math.abs(s.end.valueOf() - streak.end.valueOf()) <= ms('1d');
        }
      ) ?? streak;
    }
    for (const row of streaks) {
      if (row.length > streak.length) {
        streak = row;
      }
    }
    return streak;
  }
  
  public async calculateLongestStreak() {
    return this.calculateStreak({ longest: true });
  }

  public async getStats(): Promise<UserStats> {
    const lastSeen = (await RequestLog.findOne({ 
      order: [['createdAt', 'desc']], 
      where: { userId: this.id },
    }))?.createdAt;
    const longestStreak = await this.calculateLongestStreak();
    const streak = await this.calculateStreak();
    const achievements = await this.getAchievements();
    const updatedAt = new Date(Math.max(...[longestStreak?.updatedAt, streak?.updatedAt].filter(Boolean).map((d) => d.valueOf())));
    const interactionCounts = {
      read: { count: (await this.getSummaryInteractions('read')).length },
      share: { count: (await this.getSummaryInteractions('share')).length },
    };
    return {
      achievements: achievements.completed,
      daysActive: (await User.getDaysActive()).find((s) => s.userId === this.id) ?? { count: 1 },
      interactionCounts,
      lastSeen,
      longestStreak,
      memberSince: this.createdAt,
      reputation: achievements.completed.reduce((acc, a) => acc + a.achievement.points ?? 0, 0) +
        interactionCounts.read.count * 1 + 
        interactionCounts.share.count * 3,
      streak,
      updatedAt: !Number.isNaN(updatedAt.valueOf()) ? updatedAt : new Date(),
    };
  }
  
  public async syncProfile(req?: ExpressRequest): Promise<Profile> {
    const profile: Profile = {};
    const aliases = await this.findAliases('email');
    const metadata = await UserMetadata.findAll({ where: { userId: this.id } });
    const updatedAt = new Date(Math.max(...[...aliases, ...metadata].map((m) => m.updatedAt.valueOf())));
    profile.email = aliases.length > 0 ? aliases.sort((a, b) => a.priority - b.priority)[0].value : '',
    profile.emails = aliases.length > 0 ? aliases.map((a) => a.value) : [],
    profile.pendingEmails = aliases.length > 0 ? aliases.filter((a) => a.verifiedAt === null).map((a) => a.value) : [],
    profile.username = (await this.findAlias('username'))?.value,
    profile.linkedThirdPartyAccounts = (await this.findAliases('thirdParty/apple', 'thirdParty/google')).map((a) => a.type.split('/')[1] as ThirdParty);
    profile.preferences = Object.fromEntries(metadata.filter((meta) => meta.type === 'pref').map((meta) => [meta.key, typeof meta.value === 'string' ? JSON.parse(meta.value) : meta.value]));
    if ((req?.version ?? '') >= '1.17.11') {
      profile.preferences.bookmarkedSummaries = Object.fromEntries((await this.getSummaryInteractions('bookmark')).map((i) => [i.targetId, i.createdAt]));
      profile.preferences.readSummaries = Object.fromEntries((await this.getSummaryInteractions('read')).map((i) => [i.targetId, i.createdAt]));
      profile.preferences.removedSummaries = Object.fromEntries((await this.getSummaryInteractions('hide')).map((i) => [i.targetId, { createdAt: i.createdAt, item: true }]));
      profile.preferences.followedPublishers = ((await PublisherInteraction.findAll({
        attributes: ['targetId', [fn('max', col('publisher_interaction.createdAt')), 'createdAt']],
        group: ['targetId', col('publisher.name'), col('publisher.displayName'), col('publisher.imageUrl'), col('publisher.description')],
        include: [Publisher.scope('public')],
        order: [[fn('max', col('publisher_interaction.createdAt')), 'desc'], ['targetId', 'desc']],
        where: {
          revert: false,
          type: 'follow',
          userId: this.id,
        },
      })) as (PublisherInteraction & { publisher: Publisher })[]).map((i) => i.publisher.name);
      profile.preferences.favoritedPublishers = ((await PublisherInteraction.findAll({
        attributes: ['targetId', [fn('max', col('publisher_interaction.createdAt')), 'createdAt']],
        group: ['targetId', col('publisher.name'), col('publisher.displayName'), col('publisher.imageUrl'), col('publisher.description')],
        include: [Publisher.scope('public')],
        order: [[fn('max', col('publisher_interaction.createdAt')), 'desc'], ['targetId', 'desc']],
        where: {
          revert: false,
          type: 'favorite',
          userId: this.id,
        },
      })) as (PublisherInteraction & { publisher: Publisher })[]).map((i) => i.publisher.name);
      profile.preferences.excludedPublishers = ((await PublisherInteraction.findAll({
        attributes: ['targetId', [fn('max', col('publisher_interaction.createdAt')), 'createdAt']],
        group: ['targetId', col('publisher.name'), col('publisher.displayName'), col('publisher.imageUrl'), col('publisher.description')],
        include: [Publisher.scope('public')],
        order: [[fn('max', col('publisher_interaction.createdAt')), 'desc'], ['targetId', 'desc']],
        where: {
          revert: false,
          type: 'hide',
          userId: this.id,
        },
      })) as (PublisherInteraction & { publisher: Publisher })[]).map((i) => i.publisher.name);
      profile.preferences.followedCategories = ((await CategoryInteraction.findAll({
        attributes: ['targetId', [fn('max', col('category_interaction.createdAt')), 'createdAt']],
        group: ['targetId', col('category.name'), col('category.displayName'), col('category.icon')],
        include: [Category.scope('public')],
        order: [[fn('max', col('category_interaction.createdAt')), 'desc'], ['targetId', 'desc']],
        where: {
          revert: false,
          type: 'follow',
          userId: this.id,
        },
      })) as (CategoryInteraction & { category: Category })[]).map((i) => i.category.name);
      profile.preferences.favoritedCategories = ((await CategoryInteraction.findAll({
        attributes: ['targetId', [fn('max', col('category_interaction.createdAt')), 'createdAt']],
        group: ['targetId', col('category.name'), col('category.displayName'), col('category.icon')],
        include: [Category.scope('public')],
        order: [[fn('max', col('category_interaction.createdAt')), 'desc'], ['targetId', 'desc']],
        where: {
          revert: false,
          type: 'favorite',
          userId: this.id,
        },
      })) as (CategoryInteraction & { category: Category })[]).map((i) => i.category.name);
      profile.preferences.excludedCategories = ((await CategoryInteraction.findAll({
        attributes: ['targetId', [fn('max', col('category_interaction.createdAt')), 'createdAt']],
        group: ['targetId', col('category.name'), col('category.displayName'), col('category.icon')],
        include: [Category.scope('public')],
        order: [[fn('max', col('category_interaction.createdAt')), 'desc'], ['targetId', 'desc']],
        where: {
          revert: false,
          type: 'hide',
          userId: this.id,
        },
      })) as (CategoryInteraction & { category: Category })[]).map((i) => i.category.name);
    }
    profile.createdAt = this.createdAt;
    const stats = await this.getStats();
    profile.updatedAt = new Date(Math.max(updatedAt.valueOf(), stats.updatedAt.valueOf()));
    profile.stats = stats;
    this.set('profile', profile, { raw: true });
    return profile;
  }

  public async setMetadata(
    key: string, 
    value: Record<string, unknown> | string, 
    type: MetadataType = 'pref'
  ) {
    if (await UserMetadata.findOne({ where: { key, userId: this.id } })) {
      await UserMetadata.update({ type, value }, {
        where: {
          key, 
          userId: this.id, 
        },
      });
    } else {
      await UserMetadata.create({
        key, 
        type,
        userId: this.id, 
        value,
      });
    }
  }

  // achievements
  public async getAchievements(updateProgress = true): Promise<Achievements> {
    if (updateProgress) {
      for (const criteria of Achievement.ACHIEVEMENT_CRITERIA) {
        const achievement = await Achievement.findOne({ where: { name: criteria.name } });
        if (!achievement) {
          continue;
        }
        if (criteria.getProgress) {
          console.log(`calculating progress for achievement ${achievement.name}...`);
          const progress = await criteria.getProgress(this);
          if (!Number.isNaN(progress)) {
            await this.grantAchievement(achievement, { progress });
          }
        } else {
          if (!(await this.hasCompletedAchievement(achievement))) {
            await this.grantAchievement(achievement, { progress: 0 });
          }
        }
      }
    }
    const completed = await UserAchievement.findAll({
      include: [Achievement.scope('public')],
      where: { progress: { [Op.gte]: 1 }, userId: this.id },
    });
    const inProgress = await UserAchievement.findAll({
      include: [Achievement.scope('public')],
      where: { progress: { [Op.lt]: 1 }, userId: this.id },
    });
    return {
      completed,
      inProgress,
      reputation: completed.reduce((acc, a) => acc + a.achievement.points ?? 0, 0),
    };
  }

  public async hasCompletedAchievement(achievement: Achievement) {
    return await UserAchievement.findOne({ 
      include: [Achievement.scope('public')],
      where: {
        achievementId: achievement.id, 
        progress: { [Op.gte]: 1 },
        userId: this.id,
      },
    });
  }

  public async grantAchievement(achievement: Achievement, {
    progress = 1, 
    achievedAt = progress === 1 ? new Date() : null, 
  }: Partial<UserAchievementCreationAttributes> = {}) {
    if (await this.hasCompletedAchievement(achievement)) {
      return achievement;
    }
    const userAchievement = await UserAchievement.findOne({
      where: {
        achievementId: achievement.id,
        userId: this.id,
      },
    });
    if (userAchievement) {
      await userAchievement.update({
        achievedAt,
        progress,
      });
      return userAchievement;
    } else {
      return await UserAchievement.create({
        achievedAt,
        achievementId: achievement.id,
        progress, 
        userId: this.id,
      });
    }
  }
  
  public async initializeAchievements() {
    const achievements = await Achievement.findAll();
    for (const achievement of achievements) {
      await this.grantAchievement(achievement, { progress: 0 });
    }
  }

  // summary methods
  
  public async destroySummary(targetId: number) {
    if (this.hasRole('god')) {
      await Summary.destroy({ where: { id: targetId } });
    }
    throw new AuthError('INSUFFICIENT_PERMISSIONS');
  }
  
  public async restoreSummary(targetId: number) {
    if (this.hasRole('god')) {
      await Summary.restore({ where: { id: targetId } });
    }
    throw new AuthError('INSUFFICIENT_PERMISSIONS');
  }
  
  public async interactWithSummary(targetId: number, type: InteractionType, remoteAddr?: string, content?: string, metadata?: Record<string, unknown>) {
    const createInteraction = async () => {
      await SummaryInteraction.create({
        content, metadata, remoteAddr, targetId, type, userId: this.id,
      });
    };
    const destroy = !['comment', 'impression', 'share', 'view'].includes(type);
    if (destroy) {
      let searchType = [type];
      if (type === 'downvote' || type === 'upvote') {
        searchType = ['downvote', 'upvote'];
      }
      const interaction = await SummaryInteraction.findOne({
        where: {
          targetId, type: searchType, userId: this.id,
        }, 
      });
      if (interaction) {
        await SummaryInteraction.destroy({
          where: {
            targetId, type: searchType, userId: this.id, 
          },
        });
        const create = ((type === 'downvote' || type === 'upvote') && interaction.type !== type) || type === 'view';
        if (create) {
          await createInteraction();
        }
      } else {
        await createInteraction();
      }
    } else {
      await createInteraction();
    }
    const summary = await Summary.findByPk(targetId);
    return summary;
  }

}
