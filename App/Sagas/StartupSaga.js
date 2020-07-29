import { put, select, call, all } from 'redux-saga/effects'
import { PermissionsAndroid } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from 'App/Services/NavigationService'

import firebase from "react-native-firebase";
import Geolocation from "react-native-geolocation-service";

import StartupActions from 'App/Stores/Startup/Actions'

const getStartup = (state) => state.startup;

export function* startup() {
  //yield put(ExampleActions.fetchUser())
  let fcmtoken="",latitude=1.33055, longitude=103.8427;
  try{
  	fcmtoken = yield firebase.messaging().getToken();
    console.log('fcmtoken', fcmtoken);

    // const isPermissiongranted = yield call(setPermissions);

  	const location = yield getPosition();
  	latitude = location.coords.latitude;
    longitude = location.coords.longitude;

  }catch(err){
  }

  	const data = { fcmtoken, latitude, longitude };
    yield put(StartupActions.startSuccess(data) );

  	let startup = yield select(getStartup);
  	const userToken = startup.userToken;

  	if (userToken !== null) {
  		NavigationService.navigate('Loading')//login
  	}else{
  		NavigationService.navigateAndReset('Intro')//login
  	}

}


var getPosition = function (options) {
  return new Promise(function (resolve, reject) {
  	Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  });
};


export const setPermissions = function*() {
  try {
    const custom = yield call(requestPermission, [
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
    yield all(
      custom.map(item => {
        if (Object.values(item)[0] === PermissionsAndroid.RESULTS.GRANTED) {
          return put({ type: types.PERMISSIONS_SUCCESS, payload: item });
        }
        return put({ type: types.PERMISSIONS_REJECTED, payload: item });
      })
    );
  } catch (err) {
    return err;
  }
  return true;
};

const requestPermission = async requestedType => {
  try {
    const granted = await PermissionsAndroid.requestMultiple(requestedType);
    const access = Object.keys(granted).map(item => {
      const name = item.split('.').slice(-1)[0];
      const revObj = {};
      revObj[name] = granted[item];
      AsyncStorage.mergeItem('permissions', JSON.stringify(revObj));
      return revObj;
    });
    return access;
  } catch (e) {
    return e;
  }
};
