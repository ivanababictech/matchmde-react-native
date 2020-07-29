import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { DateActionTypes } from './Actions'

export const fetchUserLoading = (state) => ({
  ...state,
  isLoading: true,
  errorMessage: null,
});

export const fetchUserSuccess = (state, { data }) => ({
  ...state,
  ...data,
  isLoading: false,
  discoverPagedStartIndex:0,
  errorMessage: null,
});

export const appendDiscoverData = (state, { payload }) => {
  const { discovered, canLoadMoreDiscover, discoveredPage } = payload;
  const discoverPagedStartIndex = state.discovered.length;
  //const newDiscovered = state.discovered.concat(discovered)
  return {
    ...state,
    canLoadMoreDiscover,
    discoveredPage,
    discovered: state.discovered.concat(discovered),
    discoverPagedStartIndex,
    isLoading: false,
    errorMessage: null,
  }
};

export const fetchMatchedSuccess = (state, { data }) =>{
  return{
    ...state,
    ...data,
    isLoading: true,
    errorMessage: null,
  }
};

export const updateDiscoverNumber = (state, { discoverPageNum }) => {
  return {
    ...state,discoverPageNum
  }
};

export const fetchUserFailure = (state, { errorMessage }) => ({
  ...state,
  isLoading: false,
  errorMessage: errorMessage,
});

export const reducer = createReducer(INITIAL_STATE, {
  [DateActionTypes.FETCH_LOADING]: fetchUserLoading,
  [DateActionTypes.FETCH_SUCCESS]: fetchUserSuccess,
  [DateActionTypes.FETCH_FAILURE]: fetchUserFailure,
  [DateActionTypes.APPEND_DISCOVERED]: appendDiscoverData,
  [DateActionTypes.FETCH_MATCHED_SUCCESS]: fetchMatchedSuccess,
  [DateActionTypes.UPDATE_DISCOVER_NUMBER]: updateDiscoverNumber,
});
