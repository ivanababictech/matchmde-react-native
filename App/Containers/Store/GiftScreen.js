import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import { Header, Icon, Overlay } from "react-native-elements";

import { connect } from "react-redux";
import UserActions from "App/Stores/User/Actions";
import { thousands_separators } from "App/Services/HelperServices";

import { userService } from "App/Services/UserService";
import { EventRegister } from "react-native-event-listeners";
import GiftErrorModal from "App/Components/Gifts/GiftErrorModal";
import GiftSendModal from "App/Components/Gifts/GiftSendModal";
import GiftSendSuccessModal from "App/Components/Gifts/GiftSendSuccessModal";
import { sendNotification } from "App/Services/HelperServices";

import { Images } from "App/Theme";

const width = Dimensions.get("window").width;
const giftItemWrapWidth = (width - 60) / 3;

class GiftScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gifts: [],
      isRefreshing: false,
      to: null,
      errorModalVisible: false,
      giftSendModelVisible: false,
      giftSendSuccess: false,
      selectedGift: {}
    };
  }

  componentDidMount() {
    this.loadGifts();
    const toUser = this.props.navigation.getParam("to", null);
    this.setState({ to: toUser });
  }

  loadGifts = () => {
    const { users, page } = this.state;
    // this.setState({ isRefreshing: true });

    userService
      .get_request(this.props.userToken.access_token, "/gifts")
      .then(res => {
        this.setState({
          gifts: res.data,
          isRefreshing: false
        });
      })
      .catch(err => {
        console.log("gifts err -> ", err);
        this.setState({
          isRefreshing: false
        });
      });
  };

  handleRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.loadGifts();
    });
  };

  onSendGift(gift) {
    if (this.state.to) {
      this.setState({ giftSendModelVisible: true, selectedGift: gift });
    } else {
      this.setState({ errorModalVisible: true });
    }
  }

  giftSendSuccess(val) {
    this.setState({ giftSendModelVisible: false });
    setTimeout(() => {
      this.setState({ giftSendSuccess: true });
    }, 500);

    if (this.state.to.device_tokens && this.state.to.device_tokens.length > 0) {
      const body = {
        device_token: this.state.to.device_tokens[0].device_token,
        title: "Congratulation!",
        body: "You received a Gift from " + this.props.profile.name,
        os_type: Platform.OS,
        date: Math.floor(Date.now())
      };

      sendNotification(body, res => {
        console.log("Send Notification Data:", res);
      });
    }

    let profile = { ...this.props.profile };
    profile.balance = parseInt(profile.balance) - val;
    this.props.updateProfilePhotos({ profile: profile });
  }

  onPressDiscover() {
    this.setState({ errorModalVisible: false });
    this.props.navigation.navigate("DiscoverHome", { tabIndex: 0 });
    EventRegister.emit("TabChangeEvent", 0);
  }

  render() {
    const { gifts, isRefreshing } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          backgroundColor="transparent"
          leftComponent={this.header_left}
          rightComponent={this.render_HeaderRight}
          centerComponent={this.render_headerCenter}
        />
        <FlatList
          data={gifts}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          numColumns={3}
          ItemSeparatorComponent={this.renderSeparator}
          refreshing={isRefreshing}
          onRefresh={this.handleRefresh}
          ListHeaderComponent={this.GiftListHeader}
        />
        <GiftErrorModal
          isVisible={this.state.errorModalVisible}
          onBackdropPress={() => this.setState({ errorModalVisible: false })}
          onPressDiscover={() => this.onPressDiscover()}
          style={{ padding: 30 }}
        />
        <Overlay
          isVisible={this.state.giftSendModelVisible}
          width="auto"
          height="auto"
          borderRadius={14}
          overlayStyle={{ padding: 30 }}
        >
          <GiftSendModal
            gift={this.state.selectedGift}
            toUser={this.state.to}
            onBackdropPress={() =>
              this.setState({ giftSendModelVisible: false })
            }
            onSendSuccess={val => {
              this.giftSendSuccess(val);
            }}
          />
        </Overlay>
        <Overlay
          isVisible={this.state.giftSendSuccess}
          width="auto"
          height="auto"
          borderRadius={14}
          overlayStyle={{ padding: 30 }}
        >
          <GiftSendSuccessModal
            onBack={() => {
              this.setState({ giftSendSuccess: false });
              this.props.navigation.goBack(null);
            }}
          />
        </Overlay>
      </View>
    );
  }

  GiftListHeader = () => {
    return (
      <View
        style={{
          alignItems: "center",
          alignSelf: "center",
          marginBottom: 10,
          marginTop: 20
        }}
      >
        <Image
          source={Images.Stars}
          style={{ width: width * 0.4, height: width * 0.4 * 1.05 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 21, color: "#17144e", marginBottom: 10 }}>
          Be Seen First
        </Text>
        <Text style={{ fontSize: 17, color: "#91919d" }}>
          Gifting messages gets top priority
        </Text>
      </View>
    );
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: "center",
          alignSelf: "center",
          margin: 10,
          padding: 10
        }}
        onPress={() => {
          this.onSendGift(item);
        }}
      >
        <Image
          source={{ uri: item.icon }}
          style={{
            width: giftItemWrapWidth - 20,
            height: giftItemWrapWidth - 20
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  keyExtractor = (item, index) => index.toString();

  renderSeparator = () => (
    <Image
      source={Images.Hanger}
      style={{ width: width - 20, alignSelf: "center" }}
      resizeMode="contain"
    />
  );

  header_left = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.goBack(null);
        }}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Icon
          name="ios-arrow-back"
          type="ionicon"
          containerStyle={{ marginRight: 4 }}
          color="#17144e"
        />
        <Text style={styles.headerLeftText}>Back</Text>
      </TouchableOpacity>
    );
  };

  render_HeaderRight = () => {
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
  };

  render_headerCenter = () => {
    return (
      <Text style={{ color: "#17144e", fontSize: 21, fontWeight: "bold" }}>
        Send a Gift
      </Text>
    );
  };
}

let styles = {
  headerLeftText: {
    color: "#17144e"
  }
};

const mapStateToProps = state => {
  return {
    userToken: state.startup.userToken,
    profile: state.user.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateProfilePhotos: photo => dispatch(UserActions.fetchUserSuccess(photo))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GiftScreen);
