import React from "react";
import "react-native-gesture-handler";
import { View, Text, TouchableOpacity, Image, AppState } from "react-native";
import { Header, Icon } from "react-native-elements";
import { createStackNavigator } from "react-navigation";
import ViewPagerDis from "@react-native-community/viewpager";
import { thousands_separators } from "App/Services/HelperServices";
import moment from "moment";

import { EventRegister } from "react-native-event-listeners";
import { connect } from "react-redux";

import { Images } from "App/Theme";
import CustomBottomBar from "App/Components/Common/CustomBottomBar";

import DiscoverView from "App/Containers/Discover/DiscoverView";
import OtherUserProfile from "App/Containers/Discover/OtherUserProfile";
import FilterScreen from "App/Containers/Discover/FilterScreen";

import MatchmakerView from "App/Containers/Matchmake/MatchmakeView";
import StoreScreen from "App/Containers/Store/StoreScreen";
import ProfileScreen from "App/Containers/Profile/ProfileScreen";

import EditPhotoScreen from "App/Containers/Profile/EditPhotoScreen";
import EditLocationSettingScreen from "App/Containers/Profile/EditLocationSettingScreen";
import EditProfileScreen from "App/Containers/Profile/EditProfileScreen";
import EditSettingsScreen from "App/Containers/Profile/EditSettingsScreen";

import GiftScreen from "App/Containers/Store/GiftScreen";
import TransferScreen from "App/Containers/Store/TransferScreen";
import SelectContactScreen from "App/Containers/Store/SelectContact";
import TransferConfirmScreen from "App/Containers/Store/TransferConfirmScreen";
import BoostScreen from "App/Containers/Store/BoostScreen";

import MessagesScreen from "App/Containers/Messages/MessagesScreen";
import ChatRoomScreen from "App/Containers/Messages/ChatRoomScreen";
import AdminChatRoomScreen from "App/Containers/Messages/AdminChatRoomScreen";
import ReceiveGiftListScreen from "App/Containers/Messages/ReceiveGiftListScreen";
import ReceiveDateMessageScreen from "App/Containers/Messages/ReceiveDateMessageScreen";
import PurchaseIntro from "App/Containers/Purchase/PurchaseIntro";

import EditLocationScreen from "App/Containers/Profile/EditLocationScreen";
import StartupActions from "App/Stores/Startup/Actions";
import ChatListScreen from "../Containers/Messages/ChatListScreen";
import ProfileFourth from "../Components/Profile/ProfileFourth";
import MatchRatingView from "../Containers/Matchmake/MatchRatingView";
import DateRatingView from "../Containers/Matchmake/DateRatingView";
import AsyncStorage from "@react-native-community/async-storage";
import { getPlaceDetailWithCoordinates } from "App/Services/HelperServices";
import UserActions from "App/Stores/User/Actions";
import { userService } from "App/Services/UserService";
import Geolocation from "react-native-geolocation-service";
import DatingActions from "App/Stores/Dating/Actions";

const headerTitles = ["Discover", "Matchmaker", "Messages", "", "Profile"];
class DiscoverTabNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      credit: null,
      boostTime: null,
      pageScrolling: false,
      appState: AppState.currentState
    };
    this.viewPager = React.createRef();
  }

  componentDidMount() {
    this.listener = EventRegister.addEventListener("TabChangeEvent", index => {
      this.changeTab(index);
    });

    AppState.addEventListener("change", this._handleAppStateChange);

    this.timerStart();
  }

  timerStart() {
    console.log("timer started");
    this._interval = setInterval(() => {
      if (this.props.profile.boosted_end_date != null) {
        const now = new Date();

        const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        const v =
          moment(
            this.props.profile.boosted_end_date.replace(" ", "T")
          ).toDate() - utc;
        const vi = parseInt(v / 1000);
        if (v > 0) {
          this.setState({
            boostTime: `${parseInt(vi / 60)}:${vi % 60}`
          });
        } else {
          this.setState({
            boostTime: null
          });
        }
      } else {
        this.setState({
          boostTime: null
        });
      }
    }, 1000);
  }

  timerClose() {
    console.log("timer closed");
    clearInterval(this._interval);
  }

  componentWillUnmount() {
    this.timerClose();
    AppState.removeEventListener("change", this._handleAppStateChange);
    EventRegister.removeEventListener(this.listener);
  }

  getLocationSettingState = async () => {
    try {
      let locationSettingState = await AsyncStorage.getItem(
        "locationSettingState"
      );
      if (locationSettingState !== null) {
        return Number(locationSettingState);
      }
      return 1;
    } catch (error) {
      return 1;
    }
  };

  async changeLocation() {
    const sState = await this.getLocationSettingState();
    if (sState === 1) {
      this.onRegionChange();
    }
  }

  getPosition = function() {
    return new Promise(function(resolve, reject) {
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      });
    });
  };

  async onRegionChange() {
    const location = await this.getPosition();

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    console.log("location ->", location);

    getPlaceDetailWithCoordinates(latitude, longitude, res => {
      console.log("getPlaceDetailWithCoordinates");
      const addressComponent = res.filter(
        v => v.address_components.length === 3
      );
      console.log("addressComponents", res);
      console.log("addressComponents", addressComponent);

      if (addressComponent.length >= 1) {
        const address = addressComponent[0].address_components;
        const city = address[0].long_name;
        const country = address[1].long_name;
        console.log("city and country", city, country);
        console.log("profile from local -> ", this.props.user.profile);
        let profile = { };
        profile.city = city;
        profile.country = country;
        profile.latitude = latitude;
        profile.longitude = longitude;
        // this.props.updateProfile({ profile: profile });
        userService
          .post(
            this.props.startup.userToken.access_token,
            "/account/profile",
            profile
          )
          .then(res => {
            console.log("profile from server", res);
            this.props.updateProfile({ profile: res.data });
            this.props.updateDiscoverNumber(1);
            this.props.fetchDiscover(1);
          });
      }
    });
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }
    // this.setState({appState: nextAppState});
    this.state.appState = nextAppState;
    console.log("current app state -> ", this.state.appState);

    if (this.state.appState === "active") {
      this.timerStart();

      this.changeLocation();
    } else {
      this.timerClose();
    }
  };

  async changeTab(i) {
    this.setState({ activeTab: i });
    this.viewPager.current.setPageWithoutAnimation(i);
    // this.props.setCurrentTab(i);
    if (i === 2) {
      EventRegister.emit("ChatMounted", i);
    }
    if (i === 3) {
      this.props.setStoreTab(1);
    }

    if (i === 4) {
      EventRegister.emit("ProfilePageMounted", i);
    }
  }

  onPageScroll(e) {
    this.setState({ pageScrolling: false });
  }
  onPageScrollStateChanged(evt) {
    if ("idle" == evt.nativeEvent.pageScrollState) {
      this.setState({ pageScrolling: false });
    } else {
      this.setState({ pageScrolling: true });
    }
  }
  moveShouldSetResponderCapture(evt) {
    return false;
  }

  handleRefresh = () => {};

  render() {
    const { navigation } = this.props;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "#f9f9f9"
        }}
      >
        <Header
          backgroundColor="transparent"
          leftComponent={this.renderHeaderLeft}
          centerComponent={this.renderHeaderCenter}
          rightComponent={this.renderHeaderRight}
        />
        <ViewPagerDis
          orientation="horizontal"
          initialPage={0}
          transitionStyle="scroll"
          scrollEnabled={this.state.pageScrolling}
          style={{ flex: 1 }}
          onPageScroll={evt => this.onPageScroll(evt)}
          onPageScrollStateChanged={evt => this.onPageScrollStateChanged(evt)}
          onMoveShouldSetResponderCapture={evt =>
            this.moveShouldSetResponderCapture(evt)
          }
          ref={this.viewPager}
        >
          <View key="0">
            <DiscoverView />
          </View>
          <View key="1">
            <MatchmakerView />
          </View>
          <View key="2">
            <MessagesScreen />
          </View>
          <View key="3">
            <StoreScreen headerRight={this.renderHeaderRight} />
          </View>
          <View key="4">
            <ProfileScreen />
          </View>
        </ViewPagerDis>
        <CustomBottomBar
          activeTab={this.state.activeTab}
          changeTab={i => {
            this.changeTab(i);
          }}
        />
      </View>
    );
  }

  renderHeaderRight = () => {
    if (this.state.activeTab === 0) {
      if (this.state.boostTime == null) {
        return (
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push("Filter");
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Icon name="filter" type="material-community" color="#6147d1" />
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={Images.Image11}
              style={{ width: 21, height: 21, tintColor: "rgb(60,185,253)" }}
              resizeMode="contain"
            />
            <Text style={{ marginLeft: 4, marginRight: 0 }}>
              {this.state.boostTime}
            </Text>
          </View>
        );
      }
    } else if (this.state.activeTab !== 3) {
      return null;
    } else {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={Images.DollarCoinStack}
            style={{ width: 20, height: 21 }}
            resizeMode="contain"
          />
          <Text>{thousands_separators(this.props.profile.balance)}</Text>
        </View>
      );
    }
  };

  renderHeaderLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.openDrawer();
        }}
      >
        <Image source={Images.LineMenu} />
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    if (this.state.activeTab <= 2 || this.state.activeTab === 4) {
      return (
        <Text style={{ fontSize: 21, color: "#17144e", fontWeight: "bold" }}>
          {headerTitles[this.state.activeTab]}
        </Text>
      );
    } else {
      return (
        <Image
          source={Images.Image03}
          style={{ width: 162, height: 32 }}
          resizeMode="contain"
        />
      );
    }
  };
}

const mapStateToProps = state => {
  return {
    userToken: state.startup.userToken,
    profile: state.user.profile,
    startup: state.startup,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setStoreTab: data => dispatch(StartupActions.updateStoreTab(data)),
    updateProfile: data => dispatch(UserActions.fetchUserSuccess(data)),
    updateDiscoverNumber: num =>
      dispatch(DatingActions.updateDiscoverNumber(num)),
    fetchDiscover: url => dispatch(DatingActions.fetchDiscovering(url))
  };
};

const DiscoverTabNavWithBalance = connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverTabNav);

const TodayChatDetail = createStackNavigator(
  {
    TodayChatD: {
      screen: ChatRoomScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    OtherUserDetail_2: {
      screen: OtherUserProfile,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: "TodayChatD"
  }
);

const EditLocationStack = createStackNavigator(
  {
    EditLocation: {
      screen: EditLocationScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    EditLocationSetting: {
      screen: EditLocationSettingScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: "EditLocation"
  }
);

const DiscoverStack = createStackNavigator({
  DiscoverHome: {
    //screen:DiscoverTabNav,
    screen: DiscoverTabNavWithBalance,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  // OtherProfile: OtherUserProfile,
  // Filter: FilterScreen,
  // EditPhoto: EditPhotoScreen,
  // EditProfile: EditProfileScreen,
  // EditSettings: EditSettingsScreen,

  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },

  OtherProfile: {
    screen: OtherUserProfile,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },

  Filter: {
    screen: FilterScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },

  EditPhoto: {
    screen: EditPhotoScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },

  EditSettings: {
    screen: EditSettingsScreen,
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
  },
  Transfer: {
    screen: TransferScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  TodayChatDetail: {
    screen: TodayChatDetail,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  AdminChat: {
    screen: AdminChatRoomScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
      // onRefreshData: this.handleRefresh
    }
  },
  ReceiveGiftList: {
    screen: ReceiveGiftListScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  ReceiveDateList: {
    screen: ReceiveDateMessageScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  ContactSelect: {
    screen: SelectContactScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  TransferConfirm: {
    screen: TransferConfirmScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  Purchase: {
    screen: PurchaseIntro,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  Boost: {
    screen: BoostScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  EditLocation: {
    screen: EditLocationStack,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  ChatList: {
    screen: ChatListScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  FaceVerify: {
    screen: ProfileFourth,
    navigationOptions: {
      onNext: null,
      image: null
    }
  },
  MatchRating: {
    screen: MatchRatingView,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  DateRating: {
    screen: DateRatingView,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
});
export default DiscoverStack;
