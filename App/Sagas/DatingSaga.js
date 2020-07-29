import { put, select, all, call } from 'redux-saga/effects'
import DatingActions from 'App/Stores/Dating/Actions'

import { userService } from 'App/Services/UserService'

const getStartup = (state) => state.startup;

export function* fetchDiscovering(action) {
	const { page } = action;
	yield put(DatingActions.fetchLoading());
	try{
		let startup = yield select(getStartup);
  		const userToken = startup.userToken;

		let discoverResponse = yield call(userService.discover, userToken.access_token,page);

		const {data, current_page, last_page} = discoverResponse.data;

		const payload = { discovered: data, canLoadMoreDiscover:current_page<last_page, discoveredPage:current_page };
		if(page==1){
			yield put(DatingActions.fetchSuccess(payload))
		}else{
			yield put(DatingActions.appendDiscovered(payload))
			//yield put(DatingActions.fetchSuccess(payload))
		}
	}catch(error){
		yield put(DatingActions.fetchFailure('Something Went Wrong'))
	}
}
