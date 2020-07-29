import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { StartupTypes } from './Actions'

export const startSuccess = (state, {data}) => {
  return {
    ...state,
    ...data
  }
};

export const fetchUserSuccess = (state, { data }) => ({
  ...state,
  user: user,
  userIsLoading: false,
  userErrorMessage: null,
});

export const fetchUserFailure = (state, { errorMessage }) => ({
  ...state,
  user: {},
  userIsLoading: false,
  userErrorMessage: errorMessage,
});

export const updateUserToken = (state, { userToken }) => {
  return {
    ...state,userToken
  }
};

export const updateStoreTab = (state, { storeTab }) => {
  return {
    ...state,storeTab
  }
};

export const updateCurrentChatUser = (state, { currentChatUser }) => {
  return {
    ...state, currentChatUser
  }
}

export const updateCameraState = (state, { cameraStatus }) => {
  return {
    ...state, cameraStatus
  }
}

export const updatePageIndex = (state, { pageIndex }) => {
  return {
    ...state, pageIndex
  }
}

export const reducer = createReducer(INITIAL_STATE, {
  [StartupTypes.START_SUCCESS]: startSuccess,
  [StartupTypes.START_FAIL]: fetchUserSuccess,
  [StartupTypes.UPDATE_USER_TOKEN]: updateUserToken,
  [StartupTypes.UPDATE_STORE_TAB]: updateStoreTab,
  [StartupTypes.UPDATE_CURRENT_CHAT_USER]: updateCurrentChatUser,
  [StartupTypes.UPDATE_CAMERA_STATE]: updateCameraState,
  [StartupTypes.UPDATE_PAGE_INDEX]: updatePageIndex,
});
