export enum CURRENT_FILTERS {
  STATUS = 'status',
  DATE = 'date',
  SOURCE_CHAIN = 'source_chain',
  TARGET_CHAIN = 'target_chain',
  DEFAULT = 'filters'
}

export const CURRENT_FILTERS_LIST = {
  [CURRENT_FILTERS.STATUS]: 'Status',
  [CURRENT_FILTERS.DATE]: 'Date',
  [CURRENT_FILTERS.SOURCE_CHAIN]: 'Source',
  [CURRENT_FILTERS.TARGET_CHAIN]: 'Target',
  [CURRENT_FILTERS.DEFAULT]: 'Filters'
} as const;

export type CURRENT_FILTERS_STATE = {
  title: (typeof CURRENT_FILTERS_LIST)[CURRENT_FILTERS];
  value: CURRENT_FILTERS;
};
