import React, { Component } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { Images } from "App/Theme";

import { userService } from "App/Services/UserService";
import { Values } from "App/Theme";

class GiftReceiveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      count: "0",
      youInfo: {}
    };
  }
  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = () => {
    userService
      .get_request(
        this.props.userToken.access_token,
        `/users/${this.props.senderID}`
      )
      .then(res => {
        this.setState({
          youInfo: res.data
        });
      })
      .catch(err => {
        console.log("users -> ", err);
      });
  };

  render() {
    return (
      <View style={styles.rootModal}>
        <View style={styles.root}>
          <View style={styles.modalBox}>
            <Image
              source={Images.Image02}
              resizeMode={"contain"}
              style={{ width: 100, height: 100, marginTop: 30 }}
            />
            <Text style={styles.title}>You received a Gift!</Text>
            <Image
              source={{ uri: this.props.image }}
              resizeMode={"contain"}
              style={styles.image}
            />
            <View style={[styles.controlBox, { marginTop: 10 }]}>
              <View style={styles.textContainer}>
                <Text style={styles.phoneInput}>{this.props.text}</Text>
              </View>
            </View>
            <View
              style={[
                styles.controlBox,
                { paddingHorizontal: 20, marginTop: 10 }
              ]}
            >
              {this.state.youInfo.id ? (
                <View style={styles.recommendHeader}>
                  <Image
                    style={styles.recommendImage}
                    source={{ uri: this.state.youInfo.picture }}
                  />
                  <Text style={styles.recommendTitle}>
                    {this.state.youInfo.name}
                  </Text>
                </View>
              ) : (
                <Text style={styles.phoneInput}>
                  {"This user's account has closed"}
                </Text>
              )}
            </View>
            <Button
              title="SENDER'S PROFILE"
              titleStyle={{ fontFamily: "ProximaNova-Bold" }}
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ["#4a46d6", "#964cc6"],
                start: { x: 0, y: 0 },
                end: { x: 0, y: 1 }
              }}
              loading={this.state.loading}
              buttonStyle={{
                borderRadius: 30,
                width: Dimensions.get("window").width * 0.9 - 30
              }}
              onPress={() => {
                this.props.onCancel();
                this.props.onSend(this.props.profile, this.state.youInfo);
              }}
              containerStyle={{ marginBottom: 30, marginTop: 10 }}
            />
            {/* <Button title="CANCEL" titleStyle={{ color: '#91919d', fontFamily: 'ProximaNova-Bold' }}
							ViewComponent={LinearGradient}
							linearGradientProps={{
								colors: ['#fff', '#efefef'],
								start: { x: 0, y: 0 },
								end: { x: 0, y: 1 },
							}}
							buttonStyle={{ borderRadius: 30, width: Dimensions.get("window").width * 0.9 - 30 }}
							onPress={() => this.props.onCancel()}
							containerStyle={{ marginBottom: 30, marginTop: 5 }}
						/> */}
          </View>
        </View>
      </View>
    );
  }
}

let styles = {
  rootModal: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#0005",
    alignItems: "center",
    justifyContent: "center"
  },
  root: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    alignItems: "center",
    justifyContent: "center"
  },
  modalBox: {
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: "#FFF",
    borderRadius: 14,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 20
  },
  image: {
    width: 70,
    height: 70,
    marginTop: 10
  },
  controlBox: {
    width: "100%",
    marginVertical: 10,
    marginHorizontal: 20
  },
  textContainer: {
    borderRadius: 5,
    backgroundColor: "#FFF",
    justifyContent: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  phoneInput: {
    fontSize: 18,
    fontWeight: "600",
    height: 100
  },
  recommendHeader: {
    flexDirection: "row",
    alignItems: "center"
  },
  recommendImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  recommendTitle: {
    color: "#078582",
    fontFamily: "ProximaNova-Bold",
    fontWeight: "800",
    fontSize: 18,
    marginHorizontal: 15
  }
};

const mapStateToProps = state => {
  return {
    profile: state.user.profile,
    userToken: state.startup.userToken
  };
};
export default connect(mapStateToProps)(GiftReceiveModal);
