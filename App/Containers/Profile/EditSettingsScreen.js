import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  Alert,
  Linking
} from "react-native";
import SwitchToggle from "react-native-switch-toggle";
import { Button, Header, Icon } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { LoginManager } from "react-native-fbsdk";

import { NavigationActions, SwitchActions } from "react-navigation";

import UserActions from "App/Stores/User/Actions";
import StartupActions from "App/Stores/Startup/Actions";

import { userService } from "App/Services/UserService";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { fbService } from "../../Services/FirebaseService";
import { DBServices } from "App/realm";
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthCredentialState
} from "@invertase/react-native-apple-authentication";

class EditSettingsScreen extends Component {
  static navigationOptions = {
    title: "Settings"
  };

  constructor(props) {
    super(props);
    this.state = {
      is_share_age: true,
      is_share_location: true,
      is_discover: true,
      show_ads: true,
      notification_likes: true,
      notification_new_message: true,
      notification_introduction: false,
      notification_matches: true
    };
  }

  componentDidMount() {
    this.setState({ ...this.props.setting, isLoading: false });
    this.getPnList();
  }

  async onLogout_Apple() {
    // performs logout request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGOUT
    });

    // get current authentication state for user
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    // use credentialState response to ensure the user credential's have been revoked
    if (credentialState === AppleAuthCredentialState.REVOKED) {
      // user is unauthenticated
    }
  }

  onHelpCenter = () => {
    const url = "https://matchmde.com";

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  onLogout = async () => {
    Alert.alert(
      "Alert",
      "Are you sure to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            this.props.clearToken();
            this.props.clearProfileData();
            AsyncStorage.setItem("userToken", "");
            // await firebase.auth().signOut();
            // this.onLogout_Apple();
            LoginManager.logOut();
            firebase.auth().signOut();
            this.props.navigation.dispatch(
              SwitchActions.jumpTo({ routeName: "Auth" })
            );
          }
        }
      ],
      { cancelable: false }
    );
  };

  onDeleteProfile = () => {
    Alert.alert(
      "Alert",
      "Are you sure to delete profile?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            try {
              userService
                .delete_request(
                  this.props.userToken.access_token,
                  "/account/deactivate"
                )
                .then(res => {})
                .catch(error => {
                  console.log("delete user error -> ", error);
                });

              // this.onLogout_Apple();
              this.props.clearToken();
              LoginManager.logOut();
              firebase.auth().signOut();

              this.props.navigation.dispatch(
                SwitchActions.jumpTo({ routeName: "Auth" })
              );
            } catch (err) {
              alert("Something went wrong");
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  getPnList() {
    fbService.getIndroductionState(this.props.profile.firebase_id, res => {
      if (res != null) {
        this.setState({ notification_introduction: res });
      }
    });
  }

  updatePnList() {
    if (!this.state.notification_introduction) {
      fbService.setUserFCMToken(
        this.props.profile.firebase_id,
        this.props.startup.fcmtoken,
        null
      );
    } else {
      fbService.setUserFCMToken(this.props.profile.firebase_id, "", null);
    }
  }

  updateSetting() {
    try {
      this.setState({ isLoading: true });
      const response = userService.post(
        this.props.userToken.access_token,
        "/account/settings",
        this.state
      );
      console.log("state=", this.state, "response =", response);
      this.props.updateProfileSetting({ setting: this.state });
      this.setState({ isLoading: false });
    } catch (err) {
      alert("Something went wrong");
      this.setState({ isLoading: false });
    }
  }

  renderHeaderLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.goBack();
        }}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Icon name="ios-arrow-back" type="ionicon" color="#17144e" size={21} />
        <Text style={{ marginLeft: 10, color: "#17144e" }}>Back</Text>
      </TouchableOpacity>
    );
  };

  goBack = () => {
    this.updateSetting();
    this.props.navigation.goBack();
  };

  renderHeaderCenter = () => {
    return (
      <Text style={{ fontSize: 21, color: "#17144e", fontWeight: "bold" }}>
        Settings
      </Text>
    );
  };

  render() {
    console.log("render settings =", this.state);
    return (
      <View style={[styles.container, { padding: 0 }]}>
        <Header
          leftComponent={this.renderHeaderLeft}
          backgroundColor="transparent"
          centerComponent={this.renderHeaderCenter}
        />
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Dedicated Profile Space</Text>
            <View style={styles.optionWrap}>
              <Text style={styles.optionLabel}>Share my age</Text>
              <SwitchToggle
                containerStyle={styles.switchContainer}
                circleStyle={styles.switchCircleStyle}
                switchOn={this.state.is_share_age}
                onPress={() => {
                  this.setState({ is_share_age: !this.state.is_share_age });
                  //this.updateSetting();
                }}
                backgroundColorOn="#3ae2a8"
                backgroundColorOff="#e6e2e2"
                circleColorOff="white"
                circleColorOn="white"
                duration={200}
              />
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#91919d",
                marginTop: 5,
                marginBottom: 5
              }}
            />
            <View style={styles.optionWrap}>
              <Text style={styles.optionLabel}>Share my location</Text>
              <SwitchToggle
                containerStyle={styles.switchContainer}
                circleStyle={styles.switchCircleStyle}
                switchOn={this.state.is_share_location}
                onPress={() => {
                  this.setState({
                    is_share_location: !this.state.is_share_location
                  });
                  // this.updateSetting();
                }}
                backgroundColorOn="#3ae2a8"
                backgroundColorOff="#e6e2e2"
                circleColorOff="white"
                circleColorOn="white"
                duration={200}
              />
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#91919d",
                marginTop: 5,
                marginBottom: 5
              }}
            />
            <View style={styles.optionWrap}>
              <Text style={styles.optionLabel}>Make me visible</Text>
              <SwitchToggle
                containerStyle={styles.switchContainer}
                circleStyle={styles.switchCircleStyle}
                switchOn={this.state.is_discover}
                onPress={() => {
                  this.setState({ is_discover: !this.state.is_discover });
                  // this.updateSetting();
                }}
                backgroundColorOn="#3ae2a8"
                backgroundColorOff="#e6e2e2"
                circleColorOff="white"
                circleColorOn="white"
                duration={200}
              />
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#91919d",
                marginTop: 5,
                marginBottom: 5
              }}
            />
            {/* <View style={styles.optionWrap}>
							<Text style={styles.optionLabel}>No ads</Text>
							<SwitchToggle
								containerStyle={styles.switchContainer}
								circleStyle={styles.switchCircleStyle}
								switchOn={this.state.show_ads}
								onPress={() => { this.setState({ show_ads: !this.state.show_ads }); this.updateSetting() }}
								backgroundColorOn='#3ae2a8' backgroundColorOff='#e6e2e2'
								circleColorOff='white' circleColorOn='white'
								duration={200}
							/>
						</View> */}
            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
              Notification Settings
            </Text>
            <View style={styles.optionWrap}>
              <Text style={styles.optionLabel}>New messages</Text>
              <SwitchToggle
                containerStyle={styles.switchContainer}
                circleStyle={styles.switchCircleStyle}
                switchOn={this.state.notification_new_message}
                onPress={() => {
                  this.setState({
                    notification_new_message: !this.state
                      .notification_new_message
                  });
                  // this.updateSetting();
                }}
                backgroundColorOn="#3ae2a8"
                backgroundColorOff="#e6e2e2"
                circleColorOff="white"
                circleColorOn="white"
                duration={200}
              />
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#91919d",
                marginTop: 5,
                marginBottom: 5
              }}
            />
            <View style={styles.optionWrap}>
              <Text style={styles.optionLabel}>Introduction</Text>
              <SwitchToggle
                containerStyle={styles.switchContainer}
                circleStyle={styles.switchCircleStyle}
                switchOn={this.state.notification_introduction}
                onPress={() => {
                  this.setState({
                    notification_introduction: !this.state
                      .notification_introduction
                  });
                  this.updatePnList();
                }}
                backgroundColorOn="#3ae2a8"
                backgroundColorOff="#e6e2e2"
                circleColorOff="white"
                circleColorOn="white"
                duration={200}
              />
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#91919d",
                marginTop: 5,
                marginBottom: 5
              }}
            />
            <View style={styles.optionWrap}>
              <Text style={styles.optionLabel}>Likes</Text>
              <SwitchToggle
                containerStyle={styles.switchContainer}
                circleStyle={styles.switchCircleStyle}
                switchOn={this.state.notification_likes}
                onPress={() => {
                  this.setState({
                    notification_likes: !this.state.notification_likes
                  });
                  // this.updateSetting();
                }}
                backgroundColorOn="#3ae2a8"
                backgroundColorOff="#e6e2e2"
                circleColorOff="white"
                circleColorOn="white"
                duration={200}
              />
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#91919d",
                marginTop: 5,
                marginBottom: 5
              }}
            />
            <View style={styles.optionWrap}>
              <Text style={styles.optionLabel}>Matches</Text>
              <SwitchToggle
                containerStyle={styles.switchContainer}
                circleStyle={styles.switchCircleStyle}
                switchOn={this.state.notification_matches}
                onPress={() => {
                  this.setState({
                    notification_matches: !this.state.notification_matches
                  });
                  // this.updateSetting();
                }}
                backgroundColorOn="#3ae2a8"
                backgroundColorOff="#e6e2e2"
                circleColorOff="white"
                circleColorOn="white"
                duration={200}
              />
            </View>
            {/* <Button title="CHANGE PASSWORD"
		                ViewComponent={LinearGradient}
		                linearGradientProps={{
		                  colors: ['#ffffff', '#efefef'],
		                  start: { x: 0, y: 0 },
		                  end: { x: 0, y: 1 },
		                }}
		                buttonStyle={{borderRadius:30}} titleStyle={{color:'#17144e'}}
		                containerStyle={{marginBottom:5, marginTop:50}}
		                onPress={() => {}}
		            /> */}
            <Button
              title="HELP & SUPPORT"
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ["#ffffff", "#efefef"],
                start: { x: 0, y: 0 },
                end: { x: 0, y: 1 }
              }}
              buttonStyle={{ borderRadius: 30 }}
              titleStyle={{
                color: "#17144e",
                fontSize: 16,
                fontWeight: "bold"
              }}
              containerStyle={{ marginBottom: 5, marginTop: 50 }}
              onPress={this.onHelpCenter}
            />
            <Button
              title="LOG OUT"
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ["#ffffff", "#efefef"],
                start: { x: 0, y: 0 },
                end: { x: 0, y: 1 }
              }}
              buttonStyle={{ borderRadius: 30 }}
              titleStyle={{
                color: "#17144e",
                fontSize: 16,
                fontWeight: "bold"
              }}
              containerStyle={{ marginBottom: 5, marginTop: 5 }}
              onPress={this.onLogout}
            />
            <Button
              title="DELETE PROFILE"
              titleStyle={{ fontSize: 16, fontWeight: "bold" }}
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ["#4a46d6", "#964cc6"],
                start: { x: 0, y: 0 },
                end: { x: 0, y: 1 }
              }}
              buttonStyle={{ borderRadius: 30 }}
              onPress={this.onDeleteProfile}
              containerStyle={{ marginTop: 5 }}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

let styles = {
  container: {
    flex: 1,
    padding: 27,
    paddingTop: 0,
    backgroundColor: "#f9f9f9"
  },
  sectionTitle: {
    color: "#17144e",
    fontSize: 17,
    marginVertical: 20
  },
  optionLabel: {
    color: "#17144e",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 5
  },
  switchContainer: {
    width: 51,
    height: 31,
    borderRadius: 15,
    backgroundColor: "#3ae2a8",
    padding: 2
  },
  switchCircleStyle: {
    width: 27,
    height: 27,
    borderRadius: 15,
    backgroundColor: "white"
  },
  optionWrap: {
    flexDirection: "row",
    ainglItems: "center",
    justifyContent: "space-between",
    marginVertical: 10
  }
};

const mapStateToProps = state => {
  return {
    setting: state.user.setting,
    userToken: state.startup.userToken,
    profile: state.user.profile,
    startup: state.startup
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateProfileSetting: data => dispatch(UserActions.fetchUserSuccess(data)),
    clearToken: () => dispatch(StartupActions.updateUserToken(null)),
    clearProfileData: () => dispatch(UserActions.clearUserProfileData()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditSettingsScreen);
