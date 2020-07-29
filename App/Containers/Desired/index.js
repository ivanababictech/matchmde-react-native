import { createStackNavigator } from 'react-navigation'

import MostDesiredScreen from './MostDesiredScreen'
import OtherUserProfile from 'App/Containers/Discover/OtherUserProfile'
import GiftScreen from 'App/Containers/Store/GiftScreen'

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

const DesireStack = createStackNavigator({
    DesireIntro: {
      screen: MostDesiredScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    },
    OtherProfile: {
      screen: OtheruserDetailStack,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    },
 },{
    initialRouteName: "DesireIntro"
  }
);

export default DesireStack;
