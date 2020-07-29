import React, { Component } from 'react'
import "react-native-gesture-handler";
import NavigationService from 'App/Services/NavigationService'
import AppNavigator from 'App/Navigators/AppNavigator'
import SafeAreaView from 'react-native-safe-area-view';
import SplashScreen from 'react-native-splash-screen';

import styles from './RootScreenStyle'

export default class RootScreen extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <AppNavigator
          // Initialize the NavigationService (see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef)
          }}
        />
      </SafeAreaView>
    )
  }
}

/*let styles={
  container:{
    flex: 1,
    backgroundColor: npLBlue,
    paddingTop: Platform.OS === 'android' ? 25 : 0
  }
}*/