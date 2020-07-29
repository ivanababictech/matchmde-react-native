import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({

  //Async actions
  fetchDiscovering:['page'],

  //Sync actions
  // The operation has started and is loading
  fetchLoading: null,
  // User informations were successfully fetched
  fetchSuccess: ['data'],
  appendDiscovered:['payload'],
  fetchMatchedSuccess:['data'],
  updateDiscoverNumber:['discoverPageNum'],

  // An error occurred
  fetchFailure: ['errorMessage'],
});

export const DateActionTypes = Types;
export default Creators
