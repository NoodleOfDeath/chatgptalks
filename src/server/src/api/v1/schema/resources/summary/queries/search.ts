export const SEARCH_SUMMARIES = `
SELECT
  "totalCount"::INT AS count,
  JSONB_BUILD_OBJECT(
    'sentiment', "averageSentiment"
  ) AS metadata,
  JSON_AGG(c.*) AS rows
FROM (
  SELECT
    id,
    title,
    "shortSummary",
    summary,
    bullets,
    url,
    "imageUrl",
    "originalDate",
    outlet,
    category,
    translations,
    COALESCE(sentiment, 0) AS sentiment,
    sentiments,
    media,
    siblings,
    AVG(sentiment) OVER() AS "averageSentiment",
    "totalCount"
  FROM (
    SELECT
      id,
      title,
      "shortSummary",
      summary,
      bullets,
      url,
      "imageUrl",
      "originalDate",
      JSONB_BUILD_OBJECT(
        'id', "outlet.id",
        'name', "outlet.name",
        'displayName', "outlet.displayName",
        'brandImageUrl', "outlet.brandImageUrl",
        'description', "outlet.description"
      ) AS outlet,
      JSONB_BUILD_OBJECT(
        'id', "category.id",
        'name', "category.name",
        'displayName', "category.displayName",
        'icon', "category.icon"
      ) AS category,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'attribute', "translation.attribute",
        'value', "translation.value"
      )) FILTER (WHERE "translation.attribute" IS NOT NULL), '[]'::JSON) AS translations,
      AVG("sentiment.score") AS sentiment,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'method', "sentiment.method",
        'score', "sentiment.score"
      )) FILTER (WHERE "sentiment.score" IS NOT NULL), '[]'::JSON) AS sentiments,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'key', "media.key", 
        'url', "media.url",
        'path', "media.path"
      ))
      FILTER (WHERE "media.key" IS NOT NULL), '[]'::JSON) AS media,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
         'id', "sibling.id",
         'title', "sibling.title",
         'originalDate', "sibling.originalDate",
         'outlet', JSONB_BUILD_OBJECT( 
           'name', "sibling.outlet.name",
           'displayName', "sibling.outlet.displayName"
         )
      )) FILTER (WHERE "sibling.id" IS NOT NULL), '[]'::JSON) AS siblings,
      COUNT(id) OVER() AS "totalCount"
    FROM (
      SELECT
        summaries.id,
        summaries.title,
        summaries."shortSummary",
        summaries.summary,
        summaries.bullets,
        summaries.url,
        summaries."imageUrl",
        summaries."originalDate",
        outlets.id AS "outlet.id",
        outlets.name AS "outlet.name",
        outlets."displayName" AS "outlet.displayName",
        outlets."brandImageUrl" AS "outlet.brandImageUrl",
        outlets.description AS "outlet.description",
        categories.id AS "category.id",
        categories.name AS "category.name",
        categories."displayName" AS "category.displayName",
        categories.icon AS "category.icon",
        summary_translations.attribute AS "translation.attribute",
        summary_translations.value AS "translation.value",
        summary_sentiments.method AS "sentiment.method",
        summary_sentiments.score AS "sentiment.score",
        summary_media.key AS "media.key",
        summary_media.url AS "media.url",
        summary_media.path AS "media.path",
        summary_relations."siblingId" AS "sibling.id",
        sibling.title AS "sibling.title",
        sibling."originalDate" AS "sibling.originalDate",
        sibling_outlet.name AS "sibling.outlet.name",
        sibling_outlet."displayName" AS "sibling.outlet.displayName"
      FROM
        summaries
        LEFT OUTER JOIN outlets
          ON summaries."outletId" = outlets.id 
          AND (outlets."deletedAt" IS NULL) 
        LEFT OUTER JOIN categories
          ON summaries."categoryId" = categories.id 
          AND (categories."deletedAt" IS NULL) 
        LEFT OUTER JOIN summary_translations
          ON summaries.id = summary_translations."parentId"
          AND (summary_translations."deletedAt" IS NULL)
          AND (summary_translations.locale = :locale)
        LEFT OUTER JOIN summary_sentiments
          ON summaries.id = summary_sentiments."parentId"
          AND (summary_sentiments."deletedAt" IS NULL)
        LEFT OUTER JOIN summary_media
          ON summary_media."parentId" = summaries.id
          AND (summary_media."deletedAt" IS NULL)
        LEFT OUTER JOIN summary_relations
          ON summary_relations."parentId" = summaries.id
          AND (summary_relations."deletedAt" IS NULL)
        LEFT OUTER JOIN summaries AS sibling
          ON summary_relations."siblingId" = sibling.id
          AND (summary_relations."deletedAt" IS NULL)
        LEFT OUTER JOIN outlets AS sibling_outlet
          ON (sibling_outlet.id = sibling."outletId")
      WHERE (summaries."deletedAt" IS NULL)
        AND (
          (summaries."originalDate" > NOW() - INTERVAL :interval)
          OR (
            (summaries."originalDate" >= :startDate)
            AND (summaries."originalDate" <= :endDate)
          )
        )
        AND (
          (summaries.id IN (:ids))
          OR :noIds
        )
        AND (
          (:excludeIds AND summaries.id NOT IN (:ids))
          OR NOT :excludeIds
        )
        AND (
          (outlets.name IN (:outlets))
          OR :noOutlets
        )
        AND (
          (categories.name IN (:categories))
          OR :noCategories
        )
        AND (
          :noFilter
          OR (summaries.title ~* :filter)
          OR (summaries."shortSummary" ~* :filter)
          OR (summaries.summary ~* :filter)
          OR (summaries.bullets::text ~* :filter)
          OR (summary_translations.value ~* :filter)
        )
      GROUP BY
        summaries.id,
        summaries.title,
        summaries."shortSummary",
        summaries.summary,
        summaries.bullets,
        summaries.url,
        summaries."imageUrl",
        summaries."originalDate",
        "outlet.id",
        "outlet.name",
        "outlet.displayName",
        "outlet.brandImageUrl",
        "outlet.description",
        "category.id",
        "category.name",
        "category.displayName",
        "category.icon",
        "translation.attribute",
        "translation.value",
        "sentiment.method",
        "sentiment.score",
        "media.key",
        "media.url",
        "media.path",
        "sibling.id",
        "sibling.title",
        "sibling.originalDate",
        "sibling.outlet.name",
        "sibling.outlet.displayName"
      ORDER BY 
        "originalDate" DESC,
        "sibling.originalDate" DESC
    ) a
    GROUP BY
      id,
      title,
      "shortSummary",
      summary,
      bullets,
      url,
      "imageUrl",
      "originalDate",
      "outlet.id",
      "outlet.name",
      "outlet.displayName",
      "outlet.brandImageUrl",
      "outlet.description",
      "category.id",
      "category.name",
      "category.displayName",
      "category.icon"
    ORDER BY
      "originalDate" DESC
  ) b
  LIMIT :limit
  OFFSET :offset
) c
GROUP BY
  "averageSentiment",
  "totalCount"
`;