import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking
} from "react-native";
import { Header, Icon } from "react-native-elements";

import { connect } from "react-redux";

import ValidateModalView from "App/Components/Messages/validateModalView";
import ValidateConfirmedModal from "App/Components/Messages/ValidateConfirmedModal";
import RedirectModal from "App/Components/Common/RedirectModal";

import { fbService } from "App/Services/FirebaseService";
import { userService } from "App/Services/UserService";
import { sendNotification } from "App/Services/HelperServices";

class ReceiveDateMessageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isConfirmedModal: false,
      isRedirectModal: false,
      isRedirectModal_notAccept: false,
      dateLastMsg: [],
      dateUser: [],
      activeSlide: 0,
      placePhotos: [],
      isMapView: false,
      placeID: "",
      placeName: "",
      placeAddress: "",
      placeUrl: "",
      device_token: "",
      userPhoto: "",
      date: "",
      coordinate: {}
    };
    this.dateMsgRef = fbService.getDateMessageRef(this.props.profile.id);
  }

  componentDidMount() {
    this.dateMsgRef.on("child_added", snapshot => {
      const msg = snapshot.val();
      userService
        .get_request(
          this.props.userToken.access_token,
          `/users/${msg.senderID}`
        )
        .then(res => {
          let temp = this.state.dateLastMsg;
          let temp_user = this.state.dateUser;
          temp.push(msg);
          temp_user.push(res.data);
          this.setState({
            dateLastMsg: temp,
            dateUser: temp_user
          });
        })
        .catch(err => {
          console.log("users on receive data msg error -> ", err);
        });
    });
  }

  onAccept = () => {
    this.setState({ isModalVisible: false, isConfirmedModal: true });
    if (this.state.device_token) {
      const body = {
        device_token: this.state.device_token,
        title: this.props.profile.name,
        body:
          this.props.profile.name + " would like to go on at date with you.",
        os_type: Platform.OS,
        date: Math.floor(Date.now())
      };
      sendNotification(body, res => {
        console.log("Send Notification Data:", res);
      });
    }
  };

  renderDateItem = (name, timestamp, userImage, place, item, device_token) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => {
            this.setState({
              placeID: item.placeID,
              placeName: item.placeName,
              placeAddress: item.placeAddress,
              placeUrl: item.placeUrl,
              userName: name,
              userPhoto: userImage,
              date: item.date,
              device_token: device_token,
              isModalVisible: true
            });
          }}
        >
          <View style={styles.listLeftBox}>
            <Image
              source={{ uri: userImage }}
              resizeMode={"cover"}
              style={styles.listLeftImage}
            />
          </View>
          <View style={styles.listCenterBox}>
            <View style={styles.listTopBox}>
              <Text style={styles.listTopLeftText}>{name}</Text>
              <Text style={styles.listTopRightText}>
                {new Date(timestamp).toLocaleDateString("en-US")}
              </Text>
            </View>
            <View style={styles.listBottomBox}>
              <Text style={styles.listBottomText}>
                {name}
                {" would like to go on at date with you."}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            marginLeft: 40,
            height: 0.5,
            backgroundColor: "#FFFDDA"
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.rootContainer}>
        <Header
          leftComponent={this.header_left}
          centerComponent={this.header_center}
          backgroundColor="transpaerent"
        />
        {this.state.isMapView ? (
          <View></View>
        ) : this.state.dateLastMsg ? (
          <ScrollView>
            {this.state.dateLastMsg.map((item, index) =>
              this.renderDateItem(
                this.state.dateUser[index].name,
                item.timestamp,
                this.state.dateUser[index].picture,
                item.placeName,
                item,
                this.state.dateUser[index].device_tokens[0].device_token
              )
            )}
          </ScrollView>
        ) : (
          <View style={styles.notFound}>
            <Icon
              type="material-community"
              name="email-search"
              size={70}
              color="#0005"
            />
            <Text style={styles.notFoundText}>Not found Messages</Text>
          </View>
        )}
        <ValidateModalView
          modalVisible={this.state.isModalVisible}
          photo={this.state.userPhoto}
          name={this.state.userName}
          placeName={this.state.placeName}
          placeAddress={this.state.placeAddress}
          placeUrl={this.state.placeUrl}
          date={this.state.date}
          onCancel={() => {
            this.setState({
              isModalVisible: false,
              isRedirectModal_notAccept: true
            });
          }}
          onAccept={() => {
            this.onAccept();
          }}
        />

        <RedirectModal
          modalVisible={this.state.isRedirectModal_notAccept}
          title={"Got It! But Don’t\nWait too Long"}
          text={"nothing beats an actual meeting to gauge the chemistry"}
          image={0}
          onPress={flag => {
            this.setState({
              isRedirectModal_notAccept: false
            });
          }}
        />

        <ValidateConfirmedModal
          modalVisible={this.state.isConfirmedModal}
          photo={this.state.userPhoto}
          name={this.state.userName}
          placeAddress={this.state.placeAddress}
          date={this.state.date}
          onOK={() => {
            this.setState({
              isConfirmedModal: false,
              isRedirectModal: true
            });
          }}
        />
        <RedirectModal
          modalVisible={false}
          text={"Google reserve system to allow user to book for date details."}
          onPress={flag => {
            this.setState({ isRedirectModal: false });
            setTimeout(() => {
              Linking.openURL(this.state.placeUrl);
            }, 500);
          }}
        />
      </View>
    );
  }

  header_left = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (!this.state.isMapView) {
            this.props.navigation.goBack(null);
          } else {
            this.setState({ isMapView: false });
          }
        }}
      >
        <View style={styles.headerLeftText}>
          <Icon type="ionicon" name="ios-arrow-back" size={25} color="#000" />
        </View>
      </TouchableOpacity>
    );
  };

  header_center = () => {
    return (
      <View>
        <Text style={styles.headerCenterText}>Date</Text>
      </View>
    );
  };
}

let styles = {
  rootContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  headerLeftText: {
    marginLeft: 10,
    fontSize: 16
  },
  headerCenterText: {
    width: Dimensions.get("window").width - 100,
    fontSize: 18,
    fontWeight: "600"
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
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 80
  },
  listLeftBox: {
    width: 80,
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  listLeftImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#FFFDDA"
  },
  listCenterBox: {
    flex: 1,
    height: "100%",
    padding: 5,
    justifyContent: "space-between"
  },
  listTopBox: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listTopLeftText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600"
  },
  listTopRightText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "600"
  },
  listBottomBox: {
    flex: 1,
    paddingVertical: 2
  },
  listBottomText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500"
  }
};

const mapStateToProps = state => {
  return {
    profile: state.user.profile,
    userToken: state.startup.userToken
  };
};

export default connect(mapStateToProps)(ReceiveDateMessageScreen);
