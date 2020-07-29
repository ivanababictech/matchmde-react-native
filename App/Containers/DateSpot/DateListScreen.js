import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Switch,
  Dimensions,
  TextInput,
  FlatList,
  Modal,
  Image,
  Platform
} from "react-native";

import { Header, Icon, ListItem, Avatar } from "react-native-elements";

import { connect } from "react-redux";
import moment from "moment";

import RedirectModal from "App/Components/Common/RedirectModal";
import ValidateModal from "App/Components/Common/ValidateModal";
import { Images } from "App/Theme";
import { fbService } from "App/Services/FirebaseService";
import { userService } from "App/Services/UserService";
import { sendNotification } from "App/Services/HelperServices";

class DateListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendList: [],
      isModalVisible: false,
      isRedirectModal: false,
      meItem: {},
      youItem: {},
      confirmedText: "",
      confirmedTitle: "",
      image: 0,
      loading: false
    };
    this.firebaseList = [];

    this.friendContactRef = fbService.getFriendList(this.props.profile.id);
  }

  componentDidMount() {
    this.setState({ loading: true });
    let temp = [];
    this.friendContactRef.on("child_added", snapshot => {
      const res = snapshot.val();
      this.firebaseList.push(res);
      userService
        .get_request(
          this.props.userToken.access_token,
          `/users/${res.friendID}`
        )
        .then(response => {
          temp.push(response.data);
          this.setState({ friendList: temp });
          this.setState({ loading: false });
        })
        .catch(err => {
          this.setState({ loading: false });
          console.log("users_datalist error -> ", err);
        });
    });
  }

  componentWillUnmount() {
    this.friendContactRef.off();
  }

  onDate = date => {
    this.setState({ isModalVisible: false });
    const body = {
      to: this.state.youItem.id,
      date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
      venue: {
        place_id: this.props.navigation.getParam("placeId"),
        name: this.props.navigation.getParam("placeName"),
        icon: this.props.navigation.getParam("placeIcon"),
        international_phone_number: this.props.navigation.getParam(
          "phoneNumber"
        ),
        formatted_address: this.props.navigation.getParam("placeAddress"),
        url: this.props.navigation.getParam("placeUrl"),
        latitude: this.props.navigation.getParam("coordinate").latitude,
        longitude: this.props.navigation.getParam("coordinate").longitude,
        photos: this.props.navigation.getParam("placePhotos").toString()
      }
    };

    console.log(
      "dates request body -> ",
      this.props.userToken.access_token,
      body
    );

    userService
      .post(this.props.userToken.access_token, "/dates", body)
      .then(res => {
        this.setState({
          isRedirectModal: true,
          image: 1,
          confirmedTitle: "Nice One!",
          confirmedText: `The invite is on its way to ${this.state.youItem.name}!`
        });

        if (
          this.state.youItem.device_tokens &&
          this.state.youItem.device_tokens.length > 0
        ) {
          const body1 = {
            device_token: this.state.youItem.device_tokens[0].device_token,
            title: this.state.meItem.name,
            body:
              this.state.meItem.name + " would like to go on at date with you.",
            os_type: Platform.OS,
            date: Math.floor(Date.now())
          };

          sendNotification(body1, res => {
            console.log("Send Notification Data:", res);
          });
        }
      })
      .catch(error => {
        console.log("dates request error -> ", error);
      });
  };

  onBooking = () => {
    this.props.navigation.navigate("BookingMapView", {
      placeUrl: this.props.navigation.getParam("placeUrl")
    });
    this.setState({
      isModalVisible: false
    });
  };

  renderFriendItem = (item, index) => {
    let meID = this.props.profile.id;

    return (
      <TouchableOpacity
        style={styles.matchContainer}
        onPress={() =>
          this.setState({
            isModalVisible: true,
            meItem: this.props.profile,
            youItem: item
          })
        }
      >
        <ListItem
          containerStyle={{
            width: "100%",
            backgroundColor: "#0000",
            padding: 0
          }}
          leftElement={
            <Avatar source={{ uri: item.picture }} size={"medium"} rounded />
          }
          title={item.name}
        />
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    return (
      <Text
        style={{
          fontSize: 21,
          color: "#17144e",
          fontFamily: "ProximaNova-Bold"
        }}
      >
        Choose your Match
      </Text>
    );
  };

  render() {
    return (
      <View style={styles.rootContainer}>
        <Header
          leftComponent={this.header_left}
          centerComponent={this.renderHeaderCenter}
          backgroundColor="transparent"
        />
        <View style={styles.rootContainer}>
          {this.state.friendList.length > 0 ? (
            <View style={{ flex: 1 }}>
              <ScrollView>
                {this.state.friendList.map((item, index) =>
                  item.picture != null
                    ? this.renderFriendItem(item, index)
                    : null
                )}
              </ScrollView>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 50
              }}
            >
              <Image
                source={Images.MilaIcon2}
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
              />
              <Text style={{ marginTop: 30, fontSize: 20 }}>
                Like more profiles to get a Match!
              </Text>
            </View>
          )}
          <RedirectModal
            modalVisible={this.state.isRedirectModal}
            title={this.state.confirmedTitle}
            text={this.state.confirmedText}
            image={this.state.image}
            onPress={flag => {
              this.setState({
                isRedirectModal: false
              });
              if (flag) {
                setTimeout(() => {
                  this.props.navigation.navigate("DateSpotIntro");
                }, 500);
              }
            }}
          />
          <ValidateModal
            modalVisible={this.state.isModalVisible}
            photo={this.state.youItem.picture}
            name={this.state.youItem.name}
            placeName={this.props.navigation.getParam("placeName")}
            placeAddress={this.props.navigation.getParam("placeAddress")}
            placeUrl={this.props.navigation.getParam("placeUrl")}
            onCancel={() => {
              this.setState({
                image: 0,
                confirmedTitle: "No Pressure!",
                confirmedText:
                  "But don’t wait too long, nothing beats an actual meeting to gauge the chemistry",
                isModalVisible: false,
                isRedirectModal: true
              });
            }}
            onRequest={date => this.onDate(date)}
          />
        </View>
      </View>
    );
  }

  header_left = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.goBack(null);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            type="ionicon"
            name={"ios-arrow-back"}
            size={25}
            color={"#000"}
          />
          <Text style={{ color: "#17144e", marginLeft: 4 }}>Back</Text>
        </View>
      </TouchableOpacity>
    );
  };
}
const mapStateToProps = state => {
  return {
    profile: state.user.profile,
    userToken: state.startup.userToken
  };
};
export default connect(mapStateToProps)(DateListScreen);

let styles = {
  rootContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 150
  },
  notFoundText: {
    color: "#0005",
    fontSize: 18
  },
  matchContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10
  }
};
