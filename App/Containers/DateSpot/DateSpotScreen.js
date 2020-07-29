import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Header } from "react-native-elements";
import Spinner from "react-native-spinkit";

import { connect } from "react-redux";

import { userService } from "App/Services/UserService";
import { getPhotoUrl } from "App/Services/HelperServices";

import { Images } from "App/Theme";

const itemWidth = Dimensions.get("window").width / 2 - 26;
const itemHeight = itemWidth * 1.11;

class DatespotScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hangouts: [],
      isRefreshing: false
    };
  }
  async componentDidMount() {
    this.fetchHangouts();
  }

  fetchHangouts = async () => {
    this.setState({ isRefreshing: true });
    try {
      const response = await userService.accountHangouts(
        this.props.userToken.access_token
      );
      const resData = response.data.data.data;
      if (resData && resData.length > 6) {
        const result = [];
        for (let i = 0; i < 6; i++) {
          let item = resData[i];
          result.push(item);
        }
        this.setState({ hangouts: result });
        console.log("Date Spots > 6=", this.state.hangouts);
      } else {
        this.setState({ hangouts: resData });
        console.log("Date Spots < 6=", this.state.hangouts);
      }

      console.log("Date Spots=", resData);
    } catch (err) {
      console.log("data sport hangouts err -> ", err);
    }
    this.setState({ isRefreshing: false });
  };

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.push("DateSpotDetail", { place: item });
        }}
        key={index}
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flex: 1,
          marginTop: 10,
          marginStart: 13
        }}
      >
        <Image
          source={{ uri: getPhotoUrl(item.photos) }}
          style={{ width: itemWidth, height: itemHeight, borderRadius: 5 }}
        />
        <Text
          style={{
            marginTop: 12,
            fontSize: 17,
            color: "#17144e",
            fontWeight: "bold",
            textAlign: "center",
            width: itemWidth
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          backgroundColor="transparent"
          leftComponent={this.renderHeaderLeft}
          centerComponent={this.renderHeaderCenter}
          rightComponent={this.renderHeaderRight}
        />
        {this.state.hangouts.length > 0 ? (
          <FlatList
            data={this.state.hangouts}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            numColumns={2}
            refreshing={this.state.isRefreshing}
            onRefresh={this.fetchHangouts}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Spinner
              style={{ marginBottom: 80 }}
              size={80}
              isVisible={true}
              type="Circle"
              color="#3cb9fc"
            />
          </View>
        )}
      </View>
    );
  }

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
    return (
      <Text style={{ fontSize: 21, color: "#17144e", fontWeight: "bold" }}>
        Date Spots
      </Text>
    );
  };

  renderHeaderRight = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.push("PickPlace")}
        >
          <Image source={Images.Search} />
        </TouchableOpacity>
      </View>
    );
  };
}

const mapStateToPros = state => {
  return {
    userToken: state.startup.userToken
  };
};

export default connect(mapStateToPros)(DatespotScreen);
