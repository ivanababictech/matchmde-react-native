import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Platform,
  Linking
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import LinearGradient from "react-native-linear-gradient";
import Swiper from "react-native-swiper";
import { Button, Icon } from "react-native-elements";
import UserActions from "App/Stores/User/Actions";

import { sha256 } from "react-native-sha256";

import firebase from "react-native-firebase";
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} from "react-native-fbsdk";
import Toast from "react-native-root-toast";
import { ApplicationStyles } from "App/Theme";

import { connect } from "react-redux";
//import { setUserToken, fetchUserProfileFromAPI} from "../../redux/actions/actions";

//import { ENDPOINTS, BASE_URL } from "../../servers/Api";
import axios from "axios";

import { Images, Values } from "App/Theme";
import { userService } from "App/Services/UserService";

import IntroFirst from "App/Components/IntroSwiper/IntroFirst";
import IntroSecond from "App/Components/IntroSwiper/IntroSecond";
import IntroThird from "App/Components/IntroSwiper/IntroThird";

import StartupActions from "App/Stores/Startup/Actions";
import "react-native-gesture-handler";
import { fbService } from "../../Services/FirebaseService";
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState
} from "@invertase/react-native-apple-authentication";

// import '@react-native-firebase/crashlytics';

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingPhone: false,
      isLoadingFacebook: false,
      isDisable: false,
      firebase_uid: "",
      isCheck: true,
      latitude: 0,
      longitude: 0,
      device_token: ""
    };
  }

  componentDidMount() {
    console.log(this.props.startup);
  }

  handleLoginWithPhone = () => {
    this.props.navigation.navigate("InputPhoneNumber");
  };

  customFacebookLogout = () => {
    var current_access_token = "";
    AccessToken.getCurrentAccessToken()
      .then(data => {
        console.log("Current access token", data);
        current_access_token = data.accessToken.toString();
      })
      .then(() => {
        let logout = new GraphRequest(
          "me/permissions/",
          {
            accessToken: current_access_token,
            httpMethod: "DELETE"
          },
          (error, result) => {
            if (error) {
              console.log("Error fetching data: " + error.toString());
            } else {
              console.log("facebook logout successfully!");
              // this.props.clearToken();
              LoginManager.logOut();
              this.continueToLogIn();
            }
          }
        );
        new GraphRequestManager().addRequest(logout).start();
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleLoginWithFacebook = () => {
    this.customFacebookLogout()
    this.continueToLogIn();
  };

  getRandomString(length) {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  continueToLogIn = async () => {
    this.setState({ isLoadingFacebook: true, isDisabled: true });

    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email"
      ]);
      if (result.isCancelled) {
        console.log("Facebook Login Canceled!");
        this.setState({ isLoadingFacebook: false, isDisabled: false });
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        console.log('ACESS TOKEN FROM DATA', data)
        const { accessToken } = data;
        console.log("Access Token", accessToken);
        const initCallBack = (error, result) => {
          if (error) {
            this.setState({
              isDisabled: false,
              isLoadingFacebook: false
            });
          } else {
            console.log("facebook profile info: ", result);
            console.log(result.id);
            console.log(result.name);
            console.log(result.email);
            console.log(result.picture.data.url);
            this.onLogInWithFaceBook(
              result.id,
              result.name,
              result.email,
              result.picture.data.url
            );
          }
        };

        const credential = firebase.auth.FacebookAuthProvider.credential(
          accessToken
        );

        // const user = firebase.auth().signInWithCredential(credential)
        await firebase.auth().signInWithCredential(credential);
        const infoRequest = new GraphRequest(
          "/me",
          {
            accessToken: accessToken,
            parameters: {
              fields: {
                string: "id, name, email, picture.type(large)"
              }
            }
          },
          initCallBack
        );
        new GraphRequestManager().addRequest(infoRequest).start();
      }
    } catch (err) {
      console.warn("facebook login carch error=", err);
      Toast.show("Permission is denied", ApplicationStyles.toastOptionError);
      this.setState({ isDisabled: false, isLoadingFacebook: false });
    }
  };

  appleSignIn = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME
      ]
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    console.log("appleAuthRequestResponse -> ", appleAuthRequestResponse);

    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      this.continueToAppleSignIn(
        appleAuthRequestResponse.identityToken,
        appleAuthRequestResponse.nonce
      );
    } else {
      alert("Apple Sign In Failed.");
    }
  };

  async continueToAppleSignIn(IDToken, userNonce) {
    const nonce = this.getRandomString(32);
    let nonceSHA256 = "";
    try {
      nonceSHA256 = await sha256(nonce);
    } catch (e) {
      console.log("UserStore::appleSignin - unable to get nonceSHA256", e);
    }

    console.log("UserTest::appleSignIn - nonce is: " + nonce);
    console.log("UserTest::appleSignIn nonceSHA256 " + nonceSHA256);
    console.log("UserTest::appleSignIn IDToken " + IDToken);

    const credential = firebase.auth.AppleAuthProvider.credential(
      IDToken,
      userNonce
    );

    console.log("firebaseUserCredential1 -> ", credential);

    let firebaseUserCredential;
    try {
      firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      console.log("firebaseUserCredential2 -> ", firebaseUserCredential);

      this.onLogInWithApple(firebaseUserCredential.user._user.uid, "", "", "");
    } catch (e) {
      alert("Apple Sign In Failed.");
    }
  }

  onLogInWithApple = (id, name, email, picture) => {
    console.log("FCM Token=", this.props.startup.fcmtoken);
    const body = {
      firebase_id: firebase.auth().currentUser.uid,
      password: "password",
      platform: Platform.OS,
      device_token: this.props.startup.fcmtoken,
      latitude: this.props.startup.latitude,
      longitude: this.props.startup.longitude
    };
    this.setState({ firebase_uid: body.firebase_id });
    console.log("body -> ", body);
    userService
      .loginWithFacebookInfo(body)
      .then(res => {
        console.log("Token Data111:", res.data);
        // this.setState({ isDisabled: false, isLoadingFacebook: false });
        if (res.data === "deactivated") {
          alert("This user is deactivated");
        } else {
          this._storeData(res.data.access_token);
          this.props.setUserToken(res.data);
          this.props.navigation.navigate("Loading");
        }
      })
      .catch(error => {
        console.log("Token Error:", error);
        // this.setState({ isDisabled: false, isLoadingFacebook: false });
        if (error.data === "deactivated") {
          alert("This user is deactivated");
        } else {
          this.props.navigation.navigate("InputProfile", {
            facebookID: id,
            facebookName: name,
            facebookEmail: email,
            facebookPhoto: picture
          });
        }
      });
  };

  onLogInWithFaceBook = (id, name, email, picture) => {
    const body = {
      firebase_id: firebase.auth().currentUser.uid,
      password: "password",
      platform: Platform.OS,
      device_token: this.props.startup.fcmtoken,
      latitude: this.props.startup.latitude,
      longitude: this.props.startup.longitude
    };
    this.props.clearToken();
    this.setState({ firebase_uid: body.firebase_id });
    console.log("body -> ", body);
    userService
      .loginWithFacebookInfo(body)
      .then(res => {
        console.log("Token Data111:", res.data);
        this.setState({ isDisabled: false, isLoadingFacebook: false });
        this.props.clearProfileData();
        if (res.data === "deactivated") {
          alert("This user is deactivated");
        } else {
          this._storeData(res.data.access_token);
          this.props.setUserToken(res.data);
          this.props.navigation.navigate("Loading");
        }
      })
      .catch(error => {
        console.log("Token Error:", error);
        this.setState({ isDisabled: false, isLoadingFacebook: false });
        if (error.data === "deactivated") {
          alert("This user is deactivated");
        } else {
          this.props.navigation.navigate("InputProfile", {
            facebookID: id,
            facebookName: name,
            facebookEmail: email,
            facebookPhoto: picture
          });
        }
      });
  };

  _storeData = async userToken => {
    try {
      await AsyncStorage.setItem("userToken", JSON.stringify(userToken));
    } catch (error) {
      // Error saving data
    }
  };

  gotoWebPage(url) {
    console.log("web page url", url);
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }

  render() {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.logContainer}>
          <Image source={Images.Image03} />
        </View>
        <Swiper
          style={styles.wrapper}
          dotColor="darkgrey"
          dotStyle={{ marginBottom: -20 }}
          activeDotColor="#3cb9fc"
          activeDotStyle={{ marginBottom: -20 }}
          autoplay={true}
          loop={true}
        >
          <View style={{ flex: 1 }}>
            <IntroFirst />
          </View>
          <View style={{ flex: 1 }}>
            <IntroSecond />
          </View>
          <View style={{ flex: 1 }}>
            <IntroThird />
          </View>
        </Swiper>

        <View style={styles.buttonContainer}>
          <Button
            title="LET'S GO!"
            titleStyle={{ fontSize: 14, fontFamily: "ProximaNova-Bold" }}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#4a46d6", "#964cc6"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            buttonStyle={{ borderRadius: 30, height: 39 }}
            onPress={this.handleLoginWithPhone}
            containerStyle={{ marginBottom: 5 }}
          />
          <Button
            title="SIGNUP WITH FACEBOOK"
            titleStyle={{ fontSize: 14, fontFamily: "ProximaNova-Bold" }}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#3b5998", "#3e4a7e"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            buttonStyle={{ borderRadius: 30 }}
            containerStyle={{ marginBottom: 10 }}
            onPress={() => {
              this.handleLoginWithFacebook();
            }}
            icon={
              <Icon
                name="facebook"
                type="zocial"
                color="white"
                size={18}
                containerStyle={{ marginRight: 5 }}
              />
            }
          />

          {Platform.OS === "ios" && (
            <AppleButton
              style={styles.appleBtn}
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_IN}
              onPress={() => this.appleSignIn()}
            />
          )}

          <View style={[styles.policyBox, { marginBottom: 10 }]}>
            <Text style={styles.policyText}>
              {Values.policyText1}
              <Text
                style={styles.policyTextUnderline}
                onPress={
                  () =>
                    this.gotoWebPage(
                      "https://matchmde.com/terms-of-service/"
                    ) /*this.props.navigation.navigate("Terms")*/
                }
              >
                {Values.policyText2}
              </Text>
              {Values.policyText3}
              <Text
                style={styles.policyTextUnderline}
                onPress={() =>
                  this.gotoWebPage("https://matchmde.com/privacy-policy/")
                }
              >
                {Values.policyText4}
              </Text>
              {Values.policyText5}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 25
  },
  logContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0
  },

  buttonContainer: {
    alignSelf: "center",
    width: "70%"
  },
  policyBox: {
    marginTop: 5
  },
  policyText: {
    textAlign: "center",
    color: "#91919d",
    fontSize: 10
  },
  policyTextUnderline: {
    textAlign: "center",
    color: "#91919d",
    fontSize: 11,
    textDecorationLine: "underline"
  },
  wrapper: {},
  appleBtn: { height: 44, width: "100%" }
});

const mapStateToProps = state => {
  return {
    startup: state.startup
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserToken: data => dispatch(StartupActions.updateUserToken(data)),
    clearToken: () => dispatch(StartupActions.updateUserToken(null)),
    clearProfileData: () => dispatch(UserActions.clearUserProfileData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Intro);
