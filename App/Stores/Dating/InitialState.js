/**
 * The initial values for the redux state.
 */
export const INITIAL_STATE = {
  discovered: [],
  canLoadMoreDiscover:false,
  discoverPageNum: 1,
  discoveredPage:0,
  discoverPagedStartIndex:0,

  matched:[],
  canLoadMoreMatched:false,
  matchedPage:0,

  isLoading: false,
  errorMessage: null,
};
