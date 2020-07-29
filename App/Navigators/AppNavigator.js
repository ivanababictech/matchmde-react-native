import "react-native-gesture-handler";

import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator
} from "react-navigation";
import { Dimensions } from "react-native";
//import ExampleScreen from 'App/Containers/Example/ExampleScreen'
import Intro from "App/Containers/Auth/Intro";
import SplashScreen from "App/Containers/Auth/SplashScreen";
import InputPhoneNumber from "App/Containers/Auth/InputPhoneNumber";
import InputVerificationCode from "App/Containers/Auth/InputVerificationCode";
import ConfirmVerify from "App/Containers/Auth/ConfirmVerify";
import MakeProfile from "App/Containers/Auth/MakeProfile";
import ChooseOption from "App/Containers/Auth/ChooseOption";
import LoadingView from "App/Containers/Auth/LoadingView";

import ConnectionScreen from "App/Containers/Connections/ConnectionScreen";
import DesireStack from "App/Containers/Desired";
import DateSpotStack from "App/Containers/DateSpot";
import PurchaseStack from "App/Containers/Purchase";
import ChatRoomScreen from "App/Containers/Messages/ChatRoomScreen";

import RewardScreen from "App/Containers/Reward/RewardScreen";

import DrawerScreen from "App/Containers/Drawer/DrawerScreen";

//import DiscoverView from 'App/Containers/Discover/DiscoverView'
import DiscoverNav from "./DiscoverTabNav";

import OtherUserProfile from "App/Containers/Discover/OtherUserProfile";
import TutorialScreen from "App/Containers/Tutorial/TutorialScreen";
import GiftScreen from "App/Containers/Store/GiftScreen";

const AuthStack = createStackNavigator(
  {
    Intro: {
      screen: Intro,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    InputPhoneNumber: {
      screen: InputPhoneNumber,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    InputVerificationCode: {
      screen: InputVerificationCode,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    ConfirmVerify: {
      screen: ConfirmVerify,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    InputProfile: {
      screen: MakeProfile,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    ChooseQuestion: {
      screen: ChooseOption,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    }

    /*Policy: {
    screen: Policy,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  Terms: {
    screen: Terms,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }*/
  },
  {
    initialRouteName: "Intro"
  }
);

const OtherUserDetail_2Stack = createStackNavigator(
  {
    OtherUserDetail_2: {
      screen: OtherUserProfile,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    Gift: {
      screen: GiftScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: "OtherUserDetail_2"
  }
);

const ChatDetailStack = createStackNavigator(
  {
    ChatDetail: {
      screen: ChatRoomScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    OtherUserDetail_2: {
      screen: OtherUserDetail_2Stack,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: "ChatDetail"
  }
);

const ConnectionStack = createStackNavigator(
  {
    ConnectionsScreen: {
      screen: ConnectionScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    ChatDetail: {
      screen: ChatDetailStack,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    OtherUserDetail_1: {
      screen: OtherUserProfile,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: "ConnectionsScreen"
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    Dating: {
      screen: DiscoverNav
    },
    Connections: {
      screen: ConnectionStack
    },
    MostDesired: {
      screen: DesireStack
    },
    DateSpot: {
      screen: DateSpotStack
    },
    Reward: {
      screen: RewardScreen
    }
    // Purchase: {
    //   screen: PurchaseStack
    // }
  },
  {
    initialRouteName: "Dating",
    contentComponent: DrawerScreen,
    drawerWidth: Dimensions.get("window").width * 0.8,
    overlayColor: "rgb(74,74,74)"
  }
);

const MainNavigation = createSwitchNavigator(
  {
    Splash: {
      screen: SplashScreen,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Auth: {
      screen: AuthStack
    },
    Loading: {
      screen: LoadingView
    },
    Drawer: {
      screen: DrawerNavigator
    },
    Tutorial: {
      screen: TutorialScreen
    }
  },
  {
    //initialRouteName: "Auth",
    initialRouteName: "Splash",
    header: null
  }
);

export default createAppContainer(MainNavigation);
