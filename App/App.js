import React, { Component } from "react";
import { AppState } from "react-native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PersistGate } from "redux-persist/lib/integration/react";
import createStore from "App/Stores";
import RootScreen from "./Containers/Root/RootScreen";
import AsyncStorage from "@react-native-community/async-storage";
import { EventRegister } from "react-native-event-listeners";

import firebase from "react-native-firebase";

const { store, persistor } = createStore();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState
    };
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  _backgroundState(state) {
    return state.match(/inactive|background/);
  }

  _handleAppStateChange = nextAppState => {
    if (this._backgroundState(nextAppState)) {
      console.log("App is going background");
    } else if (
      this._backgroundState(this.state.appState) &&
      nextAppState === "active"
    ) {
      console.log("App is coming to foreground");
    }
    this.setState({ appState: nextAppState });
  };

  async createNotificationListeners() {
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const { title, body, data } = notification;
        this.showAlert(title, body, data);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { title, body, data } = notificationOpen.notification;
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body, data } = notificationOpen.notification;
      this.showAlert(title, body, data);
    }
    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  }

  getCurrentChatUser = async () => {
    try {
      let currentChatUser = await AsyncStorage.getItem("CurrentChatUser");
      if (currentChatUser !== null) {
        return currentChatUser;
      }
      return "";
    } catch (error) {
      return "";
    }
  };

  async showAlert(title, body, data) {
    const currentChatUser = await this.getCurrentChatUser();
    console.log("currentChatUser -> ", currentChatUser);

    if (title === currentChatUser) {
      return;
    }

    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    const notification = new firebase.notifications.Notification()
      .setNotificationId(
        S4() +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          S4() +
          S4()
      )
      .setTitle(title)
      .setBody(body)
      .setData(data);

    notification.ios.setBadge(1);
    notification.android.setChannelId("1");
    notification.android.setAutoCancel(true);

    firebase.notifications().displayNotification(notification);
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
      console.log("permission rejected");
    }
  }

  render() {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RootScreen />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    );
  }
}
