import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  // This action is triggered when the application starts
  startup: null,
  updateUserToken:['userToken'],
  startSuccess:['data'],
  startFail:['data'],
  updateStoreTab:['storeTab'],
  updateCurrentChatUser:['currentChatUser'],
  updateCameraState:['cameraStatus'],
  updatePageIndex:['pageIndex'],
});

export const StartupTypes = Types;
export default Creators
