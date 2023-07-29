import { SEARCH_SUMMARIES } from './search';
import { SITE_MAP_QUERY } from './site_map';
import { GET_TOP_STORIES } from './top_stories';

export const QUERIES = {
  getSiteMap: SITE_MAP_QUERY,
  getSummaries: SEARCH_SUMMARIES,
  getTopStories: GET_TOP_STORIES,
};

export type QueryKey = keyof typeof QUERIES;