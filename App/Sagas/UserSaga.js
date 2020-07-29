import { put, select, all, call } from 'redux-saga/effects'
import UserActions from 'App/Stores/User/Actions'
import DatingActions from 'App/Stores/Dating/Actions'

import { userService } from 'App/Services/UserService'
import NavigationService from 'App/Services/NavigationService'

export function* fetchAllInformation(action) {
	const { access_token, isSignUp } = action;
	console.log(access_token);
	yield put(UserActions.fetchUserLoading());

	try{
		const [profileRes, settingRes, filterRes, photoRes, premiumRes, boostRes, luxeRes,
			transfreSendRes, transferReceiveRes, giftRes, taskRes/*, discoverRes*/, matchesRes] =
			yield all([
				call(userService.accountGetProfile, access_token),
				call(userService.accountGetSetting, access_token),
				call(userService.accountGetFilter, access_token),
				call(userService.accountGetPhotos, access_token),
				call(userService.accountPremium, access_token),
				call(userService.accountBoost, access_token),
				call(userService.accountLuxe, access_token),
				call(userService.accountTransferSend, access_token),
				call(userService.accountTransferReceive, access_token),
				call(userService.accountGifts, access_token),
				// call(userService.accountHangouts, access_token),
				call(userService.accountTask, access_token),
				call(userService.matches, access_token,)
			]);

		const user = { profile: profileRes.data,
			setting:settingRes.data,
			filters:filterRes.data,
			photos: photoRes.data,
			premium:premiumRes.data,
			boost:boostRes.data,
			luxe:luxeRes.data,
			transterSend:transfreSendRes.data,
			transterReceive:transferReceiveRes.data,
			gifts:giftRes.data,
			// hangouts:hangoutRes.data,
			tasks:taskRes.data,
		};
		yield put(UserActions.fetchUserSuccess(user));
		const matched={matched:matchesRes.data.data, matchedPage:matchesRes.data.current_page};

		yield put (DatingActions.fetchMatchedSuccess(matched));
		/*const dates = {discovered:discoverRes.data, matched:matchesRes.data}
		yield put(DatingActions.fetchSuccess(dates))*/

		if (isSignUp == null) {
			NavigationService.navigate('Drawer');
		} else {
			NavigationService.navigate('Tutorial');
		}
		return
	}catch(err){
		NavigationService.navigate('Auth');
	}
	yield put(UserActions.fetchUserFailure(''))
}
