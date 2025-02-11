import {
  Achievement,
  Alias,
  Category,
  CategoryInteraction,
  CategoryTranslation,
  Credential,
  Event,
  EventInteraction,
  EventMetadata,
  Job,
  Locale,
  Publisher,
  PublisherInteraction,
  PublisherTranslation,
  Queue,
  Recap,
  RecapInteraction,
  RecapMedia,
  RecapSummary,
  RecapTranslation,
  RequestLog,
  Role,
  SentimentMethod,
  Subscription,
  Summary,
  SummaryCategory,
  SummaryInteraction,
  SummaryMedia,
  SummarySentiment,
  SummaryTranslation,
  SystemNotification,
  Topic,
  TopicSummary,
  User,
  UserAchievement,
  UserMetadata,
  UserRole,
  Worker,
} from './models';
import { 
  PUBLIC_ACHIEVEMENT_ATTRIBUTES,
  PUBLIC_CATEGORY_ATTRIBUTES,
  PUBLIC_CATEGORY_TRANSLATION_ATTRIBUTES,
  PUBLIC_PUBLISHER_ATTRIBUTES,
  PUBLIC_PUBLISHER_TRANSLATION_ATTRIBUTES,
  PUBLIC_RECAP_ATTRIBUTES,
  PUBLIC_RECAP_MEDIA_ATTRIBUTES,
  PUBLIC_RECAP_TRANSLATION_ATTRIBUTES, 
  PUBLIC_SENTIMENT_ATTRIBUTES,
  PUBLIC_SUBSCRIPTION_ATTRIBUTES, 
  PUBLIC_SUMMARY_ATTRIBUTES, 
  PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE,
  PUBLIC_SUMMARY_MEDIA_ATTRIBUTES,
  PUBLIC_SUMMARY_TRANSLATION_ATTRIBUTES, 
  PUBLIC_SYSTEM_NOTIFICATION_ATTRIBUTES,
} from './types';

export function makeAssociations() {

  // ----- system associations
  
  // request log
  RequestLog.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(RequestLog, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  
  // subscription
  Subscription.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(Subscription, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });

  // ----- user/auth associations
  
  // alias
  Alias.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(Alias, {
    foreignKey: 'userId', 
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });

  // user metadata
  UserMetadata.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(UserMetadata, {
    foreignKey: 'userId', 
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });

  // roles
  UserRole.belongsTo(Role, {
    foreignKey: 'roleId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  Role.hasMany(UserRole, {
    foreignKey: 'roleId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });

  // user roles
  UserRole.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(UserRole, {
    foreignKey: 'userId', 
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  
  // credentials
  Credential.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  User.hasMany(Credential, {
    foreignKey: 'userId', 
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  
  // ----- publisher associations
  
  // publisher interactions
  PublisherInteraction.belongsTo(Publisher, {
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  Publisher.hasMany(PublisherInteraction, {
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  // user-publisher interactions
  PublisherInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  User.hasMany(PublisherInteraction, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // publisher translations
  PublisherTranslation.belongsTo(Publisher, { 
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Publisher.hasMany(PublisherTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  Locale.hasMany(PublisherTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'code',
  });
  
  // ----- category associations
  
  // category interactions
  CategoryInteraction.belongsTo(Category, {
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade', 
  });
  Category.hasMany(CategoryInteraction, { 
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // user-category interactions
  CategoryInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  User.hasMany(CategoryInteraction, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // category translations
  CategoryTranslation.belongsTo(Category, { 
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Category.hasMany(CategoryTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  Locale.hasMany(CategoryTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'code',
  });
  
  // ----- summary associations
  
  // summary-publisher associations
  Summary.belongsTo(Publisher, { foreignKey: 'publisherId' });
  Publisher.hasMany(Summary, { 
    foreignKey: 'publisherId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  // summary-category associations
  Summary.belongsToMany(Category, {
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    through: SummaryCategory,
  });
  SummaryCategory.hasMany(Summary, {
    foreignKey: 'categoryId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'parentId',
  });
  Category.hasMany(Summary, { 
    foreignKey: 'categoryId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // summary-sentiment associations
  SentimentMethod.hasMany(SummarySentiment, { 
    foreignKey: 'method', 
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'name',
  });
  
  // summary-sentiment associations
  SummarySentiment.belongsTo(Summary, {
    as: 'summary',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.hasMany(SummarySentiment, {
    as: 'sentiments',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // summary translations
  SummaryTranslation.belongsTo(Summary, { 
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.hasMany(SummaryTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  Locale.hasMany(SummaryTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'code',
  });
  
  // summary media
  SummaryMedia.belongsTo(Summary, { 
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.hasMany(SummaryMedia, {
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  // summary topics
  TopicSummary.belongsTo(Summary, {
    as: 'summary',
    foreignKey: 'childId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.hasMany(TopicSummary, {
    as: 'topics',
    foreignKey: 'childId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  TopicSummary.belongsTo(Topic, {
    as: 'topic',
    foreignKey: 'groupId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Topic.hasMany(TopicSummary, {
    as: 'summaries',
    foreignKey: 'groupId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  // summary interactions
  SummaryInteraction.belongsTo(Summary, { foreignKey: 'targetId' });
  Summary.hasMany(SummaryInteraction, { 
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // user-summary interactions
  SummaryInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  User.hasMany(SummaryInteraction, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // -- recap associations
  
  // recap-summary associations
  RecapSummary.belongsTo(Summary, {
    as: 'child',
    foreignKey: 'summaryId',
  });
  Summary.hasMany(RecapSummary, {
    as: 'child',
    foreignKey: 'summaryId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  RecapSummary.belongsTo(Recap, {
    as: 'parent',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Recap.hasMany(RecapSummary, {
    as: 'parent',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Summary.belongsToMany(Recap, {
    as: 'summaries',
    foreignKey: 'summaryId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    through: RecapSummary,
  });
  Recap.belongsToMany(Summary, {
    as: 'summaries',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    through: RecapSummary,
  });
  
  // recap translations
  RecapTranslation.belongsTo(Recap, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Recap.hasMany(RecapTranslation, {
    as: 'translations',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  Locale.hasMany(RecapTranslation, { 
    foreignKey: 'locale',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'code',
  });
  
  // recap media
  RecapMedia.belongsTo(Recap, { 
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Recap.hasMany(RecapMedia, {
    as: 'media',
    foreignKey: 'parentId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // recap interactions
  RecapInteraction.belongsTo(Recap, { foreignKey: 'targetId' });
  Recap.hasMany(RecapInteraction, { 
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // user-recap interactions
  RecapInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  User.hasMany(RecapInteraction, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  // ---- event associations

  // event interactions
  EventInteraction.belongsTo(Event, {
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Event.hasMany(EventInteraction, {
    foreignKey: 'targetId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  // user-event interactions
  EventInteraction.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  // event metadata
  EventMetadata.belongsTo(Event, {
    foreignKey: 'eventId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Event.hasMany(EventMetadata, {
    foreignKey: 'eventId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  // ----- achievement associations

  // achievement associations
  UserAchievement.belongsTo(Achievement, {
    foreignKey: 'achievementId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  Achievement.hasMany(UserAchievement, {
    foreignKey: 'achievementId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });

  // user-achievement associations
  UserAchievement.belongsTo(User, {
    foreignKey: {
      allowNull: true,
      name: 'userId',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  User.hasMany(UserAchievement, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
  // ----- queues

  Queue.hasMany(Job, {
    foreignKey: 'queue',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'name',
  });
  Queue.hasMany(Worker, {
    foreignKey: 'queue',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    sourceKey: 'name',
  });
  Worker.hasMany(Job, {
    foreignKey:{
      allowNull: true,
      name: 'lockedBy',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  });
  
}

export function addScopes() {
  
  Achievement.addScope('public', { attributes: [...PUBLIC_ACHIEVEMENT_ATTRIBUTES] });
  
  SystemNotification.addScope('public', { attributes: [...PUBLIC_SYSTEM_NOTIFICATION_ATTRIBUTES] });

  Publisher.addScope('defaultScope', { where: { disabled: null } });
  Publisher.addScope('public', { 
    attributes: [...PUBLIC_PUBLISHER_ATTRIBUTES],
    where: { disabled: null },
  });
  
  PublisherTranslation.addScope('public', { attributes: [...PUBLIC_PUBLISHER_TRANSLATION_ATTRIBUTES] });
  
  Category.addScope('defaultScope', { where: { disabled: null } });
  Category.addScope('public', {
    attributes: [...PUBLIC_CATEGORY_ATTRIBUTES],
    where: { disabled: null },
  });
  
  CategoryTranslation.addScope('public', { attributes: [...PUBLIC_CATEGORY_TRANSLATION_ATTRIBUTES] });
  
  SummarySentiment.addScope('public', { attributes: [...PUBLIC_SENTIMENT_ATTRIBUTES] });

  Summary.addScope('minimal', { attributes: ['id', 'updatedAt'] });

  Summary.addScope('public', { 
    attributes: [...PUBLIC_SUMMARY_ATTRIBUTES],
    include: [
      Publisher.scope('public'),
      Category.scope('public'),
    ],
  });
  Summary.addScope('conservative', {
    attributes: [...PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE],
    include: [
      Publisher.scope('public'),
      Category.scope('public'),
    ],
  });
  
  SummaryTranslation.addScope('public', { attributes: [...PUBLIC_SUMMARY_TRANSLATION_ATTRIBUTES] });
  
  SummaryMedia.addScope('public', { attributes: [...PUBLIC_SUMMARY_MEDIA_ATTRIBUTES] });
  
  Recap.addScope('public', { attributes: [...PUBLIC_RECAP_ATTRIBUTES] });
  
  RecapTranslation.addScope('public', { attributes: [...PUBLIC_RECAP_TRANSLATION_ATTRIBUTES] });
  
  RecapMedia.addScope('public', { attributes: [...PUBLIC_RECAP_MEDIA_ATTRIBUTES] });
  
  Subscription.addScope('public', { attributes: [...PUBLIC_SUBSCRIPTION_ATTRIBUTES] });

}
