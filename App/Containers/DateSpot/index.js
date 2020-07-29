import { createStackNavigator } from 'react-navigation'
import { Platform } from 'react-native'

import DateSpotScreen from './DateSpotScreen'
import DateSpotDetailScreen from './DateSpotDetailScreen'
import DateSpotPickerScreen from './DateSpotPickerScreen'
import DateListScreen from './DateListScreen'
import BookingMapScreen from './BookingMapScreen'
import OtherUserProfile from 'App/Containers/Discover/OtherUserProfile'
import GiftScreen from 'App/Containers/Store/GiftScreen'

import GoogleMapsView from './GoogleMapsView'

const OtheruserDetailStack = createStackNavigator( {
  OtherUserDetail_3_sub: {
    screen: OtherUserProfile,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Gift: {
    screen: GiftScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
},{
  initialRouteName: "OtherUserDetail_3_sub"
})

const DateSportDetailStack = createStackNavigator({
  DateSpotDetailStack: {
    screen: DateSpotDetailScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  
  OtherUserDetail_3: {
    screen: OtheruserDetailStack,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
}, {
  initialRouteName: "DateSpotDetailStack"
})

const DateSpotStack = createStackNavigator({
    DateSpotIntro: {
      screen: DateSpotScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    },
    DateSpotDetail: {
      screen: DateSportDetailStack,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    },
    PickPlace:{
      screen: Platform.OS==='ios'?DateSpotPickerScreen:GoogleMapsView,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    },
    DateList:{
      screen: DateListScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    },
    BookingMapView:{
      screen: BookingMapScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    },
    
 },{
    initialRouteName: "DateSpotIntro"
    //initialRouteName: "DateList"
  }
);

export default DateSpotStack;
