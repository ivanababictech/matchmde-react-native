import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { withNavigation } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import { Avatar, Button, Divider, Overlay, Icon } from "react-native-elements";
import Spinner from "react-native-spinkit";
import Toast from "react-native-root-toast";

import { Images } from "App/Theme";
import { userService } from "App/Services/UserService";
import moment from "moment";

import { connect } from "react-redux";
import * as i18nIsoCountries from "i18n-iso-countries";
import ApplicationStyles from "../../Theme/ApplicationStyles";
import { bool } from "prop-types";
i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} from "react-native-fbsdk";
import firebase from "react-native-firebase";
import UserActions from "App/Stores/User/Actions";

import InstagramLogin from "react-native-instagram-login";
import LinkedInModal from "react-native-linkedin";
import { getCorrrectName } from "App/Services/HelperServices";

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      isLoading: false,
      isModalVerifyEnabled: false,
      shift: new Animated.Value(0),
      profile: this.props.profile
    };
  }

  componentDidMount() {
    this.listener = EventRegister.addEventListener("ProfilePageMounted", () => {
      console.log(
        "this.props.userToken.access_token",
        this.props.userToken.access_token
      );
      let profileRes = userService
        .accountGetProfile(this.props.userToken.access_token)
        .then(res => {
          console.log("Updated Profile=", res.data);
          this.setState({ profile: res.data });
        });
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  applyCoupon = () => {
    const body = { code: this.state.text };
    this.setState({ isLoading: true });
    console.log("coupon code", body);
    userService
      .post(this.props.userToken.access_token, "/account/coupon", body)
      .then(res => {
        console.log(res);

        let profile = { ...this.props.profile };
        profile.balance = res.data.balance;
        this.props.updateProfile({ profile: profile });

        this.setState({ isLoading: false });
        this.setState({ text: "" });
        Toast.show(
          "Coupon code successfully applied!",
          ApplicationStyles.toastOptionSuccess
        );
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
        this.setState({ text: "" });
        Toast.show("Coupon code Failed", ApplicationStyles.toastOptionError);
      });
  };
  onCloseModal() {
    this.setState({ isModalVerifyEnabled: false });
  }

  onFaceVerify() {
    if (this.props.profile.face_verified) {
      alert("Photo verification already done.");
      return;
    }
    this.onCloseModal();
    this.props.navigation.navigate("FaceVerify", {
      image: this.props.profile.picture,
      continueVerify: this.verifiedPhoto,
      isContinueVerify: true
    });
  }

  verifiedPhoto = isDone => {
    this.setState({ isModalVerifyEnabled: true });
    if (isDone) {
      console.log("photo verified.");

      let profile = { };
      profile.face_verified = true;
      this.props.updateProfile({ profile: profile });
      userService
        .post(this.props.userToken.access_token, "/account/profile", profile)
        .then(res => {
          console.log("profile from server", res);
        });
    } else {
      // setTimeout(() =>
      //         alert("Photo verification failed. Please try again.")
      //     , 500)
    }
  };

  onLinkedinVerify() {
    if (this.props.profile.linkedin_verified) {
      alert("Linkedin verification already done.");
    }

    // this.linkedRef.show()
  }

  verifiedLinkedin(isverified) {
    if (isverified) {
      console.log("linkedin verified.");

      let profile = { ...this.props.profile };
      profile.linkedin_verified = true;
      profile.linkedin_url = "https://www.linkedin.com/";
      this.props.updateProfile({ profile: profile });
      userService
        .put(this.props.userToken.access_token, "/account/linkedin", profile)
        .then(res => {
          console.log("profile from server", res);
        });
    } else {
      alert("Linkedin verification failed. Please try again.");
    }
  }

  verifiedInstagram(isverified) {
    if (isverified) {
      console.log("instagram verified.");

      let profile = { ...this.props.profile };
      profile.instagram_verified = true;
      profile.instagram_url = "https://www.instagram.com/";
      this.props.updateProfile({ profile: profile });
      userService
        .put(this.props.userToken.access_token, "/account/instagram", profile)
        .then(res => {
          console.log("profile from server", res);
        });
    } else {
      alert("Instagram verification failed. Please try again.");
    }
  }

  onInstagramVerify() {
    // alert("Instagram verification will add later.")
    // return

    if (this.props.profile.instagram_verified) {
      alert("Instagram verification already done.");
      return;
    }

    this.instagramLogin.show();
  }

  async onFacebookVerify() {
    // this.onCloseModal()

    if (this.props.profile.facebook_verified) {
      alert("Faceboook verification already done.");
      return;
    }

    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile"
      ]);
      if (result.isCancelled) {
        console.log("Facebook Login Canceled!");
        this.setState({ isLoadingFacebook: false, isDisabled: false });
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        const { accessToken } = data;
        console.log("FACEBOOK_ACCESSTOKEN:", accessToken);
        const initCallBack = (error, result) => {
          if (error) {
            alert("Facebook Verification is failed. Please try again.");
          } else {
            console.log("facebook profile info: ");
            console.log(result.id);

            let profile = { ...this.props.profile };
            profile.facebook_verified = true;
            profile.facebook_url = "https://www.facebook.com/";
            this.props.updateProfile({ profile: profile });
            userService
              .put(
                this.props.userToken.access_token,
                "/account/facebook",
                profile
              )
              .then(res => {
                console.log("profile from server", res);
              });
          }
        };

        const credential = firebase.auth.FacebookAuthProvider.credential(
          accessToken
        );

        const user = firebase.auth().signInWithCredential(credential);
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
      console.warn(err);
      alert("Facebook Verification is failed. Please try again.");
    }
  }

  handleKeyboardDidShow = () => {
    Animated.timing(this.state.shift, {
      toValue: Platform.OS === "ios" ? -200 : 0,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  renderSuccessModalContent() {
    const successMsg = "Yay! You Are a Real\nHuman!";
    return (
      <View>
        <Image
          source={Images.Image02}
          style={{
            width: 130,
            height: 130,
            marginTop: 10,
            alignSelf: "center"
          }}
          resizeMode="contain"
        />
        <View>
          <Button
            title="Verify Photo"
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#4a46d6", "#964cc6"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            loading={this.state.loading}
            buttonStyle={{ borderRadius: 30 }}
            onPress={() => {
              this.onFaceVerify();
            }}
            titleStyle={{ fontSize: 16, fontWeight: "bold" }}
            icon={
              this.props.profile.face_verified ? (
                <Icon
                  name="md-checkmark"
                  type="ionicon"
                  color="white"
                  containerStyle={{ position: "absolute", left: 16 }}
                />
              ) : null
            }
            containerStyle={{
              marginTop: 25,
              marginBottom: 10,
              width: 250,
              alignSelf: "center"
            }}
          />
          <Image
            source={Images.ic_face}
            style={{
              right: 10,
              top: 33,
              width: 20,
              height: 20,
              position: "absolute"
            }}
          />
        </View>

        <View>
          <Button
            title="Verify Facebook"
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#4a46d6", "#964cc6"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            loading={this.state.loading}
            buttonStyle={{ borderRadius: 30 }}
            icon={
              this.props.profile.facebook_verified ? (
                <Icon
                  name="md-checkmark"
                  type="ionicon"
                  color="white"
                  containerStyle={{ position: "absolute", left: 16 }}
                />
              ) : null
            }
            onPress={() => {
              this.onFacebookVerify();
            }}
            titleStyle={{ fontSize: 16, fontWeight: "bold" }}
            containerStyle={{
              marginTop: 10,
              marginBottom: 10,
              width: 250,
              alignSelf: "center"
            }}
          />
          <Image
            source={Images.ic_facebook}
            style={{
              right: 10,
              top: 20,
              width: 20,
              height: 20,
              position: "absolute"
            }}
          />
        </View>

        {/* <View>
          <Button title="Verify Instagram"
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ['#4a46d6', '#964cc6'],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 },
            }}
            loading={this.state.loading}
            buttonStyle={{ borderRadius: 30 }}
            icon={this.props.profile.instagram_verified ? <Icon name='md-checkmark' type='ionicon' color='white' containerStyle={{ position: 'absolute', left: 16 }} /> : null}
            onPress={() => { this.onInstagramVerify() }}
            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
            containerStyle={{ marginTop: 10, marginBottom: 10, width: 250, alignSelf: 'center' }} />
          <InstagramLogin
            ref={ref => this.instagramLogin = ref}
            clientId='1254063971433008'
            redirectUrl='https://google.com'
            scopes={['basic']}
            onLoginSuccess={(token) => { this.verifiedInstagram(true) }}
            onLoginFailure={(data) => { this.verifiedInstagram(false) }}
          />
          <Image source={Images.ic_instagram} style={{ right: 10, top: 20, width: 20, height: 20, position: 'absolute' }} />
        </View> */}
        <View>
          <Button
            title="Verify LinkedIn"
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#4a46d6", "#964cc6"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            loading={this.state.loading}
            buttonStyle={{ borderRadius: 30 }}
            titleStyle={{ fontSize: 16, fontWeight: "bold" }}
            icon={
              this.props.profile.linkedin_verified ? (
                <Icon
                  name="md-checkmark"
                  type="ionicon"
                  color="white"
                  containerStyle={{ position: "absolute", left: 16 }}
                />
              ) : null
            }
            onPress={() => {
              this.onLinkedinVerify();
            }}
            containerStyle={
              !this.props.profile.linkedin_verified
                ? {
                    marginTop: 10,
                    marginBottom: 10,
                    width: 250,
                    alignSelf: "center",
                    position: "absolute"
                  }
                : {
                    marginTop: 10,
                    marginBottom: 10,
                    width: 250,
                    alignSelf: "center"
                  }
            }
          />

          {!this.props.profile.linkedin_verified ? (
            <LinkedInModal
              ref={this.linkedRef}
              clientID="81b2j6n5u2uvak"
              clientSecret="EK0IRBm6oXBtinp3"
              redirectUri="https://google.com"
              linkText={null}
              onSuccess={token => {
                this.verifiedLinkedin(true);
              }}
              onError={error => {
                this.verifiedLinkedin(false);
              }}
            />
          ) : null}

          <Image
            source={Images.ic_linkedin}
            style={{
              right: 10,
              top: 20,
              width: 20,
              height: 20,
              position: "absolute"
            }}
          />
        </View>
        <View>
          <Button
            title="Close"
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#fff", "#efefef"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            loading={this.state.loading}
            buttonStyle={{ borderRadius: 30 }}
            titleStyle={{ color: "#91919d", fontWeight: "bold" }}
            onPress={() => {
              this.onCloseModal();
            }}
            containerStyle={{
              marginTop: 10,
              marginBottom: 10,
              width: 250,
              alignSelf: "center"
            }}
          />
        </View>
      </View>
    );
  }
  render() {
    const { shift, profile } = this.state;
    return (
      <View style={styles.rootContainer}>
        <ScrollView style={styles.scrollContainer}>
          <Animated.View style={[{ transform: [{ translateY: shift }] }]}>
            <View style={{ alignSelf: "center",  marginTop: 30}}>
              <Avatar
                rounded
                size="xlarge"
                source={{ uri: this.props.profile.picture }}
                showEditButton={false}
              />
              <TouchableOpacity
                style={styles.editBtnStyle}
                onPress={() => {
                  this.props.navigation.navigate("EditPhoto");
                }}
              >
                <Image
                  source={Images.BluePen}
                  style={{ width: 19, height: 19 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 2,
                justifyContent: "center"
              }}
            >
              <Text style={styles.nameLabel}>
                {getCorrrectName(this.props.profile.name)}
              </Text>
              <Text style={styles.ageLabel}>{`,${userService.calcAge(
                this.props.profile.birthday
              )}`}</Text>
            </View>
            {/* <Text style={styles.residentalLabel}>{this.props.profile.city},{i18nIsoCountries.getName(this.props.profile.country, "en")}</Text> */}
            <Text style={styles.residentalLabel}>
              {this.props.profile.city},{this.props.profile.country}
            </Text>
            {/* <View style={{ flexDirection: 'row', width: '72%', alignSelf: 'center', marginTop: 20 }}
            ViewComponent={LinearGradient}
            linearGradientProps={{ colors: ['#4a46d6', '#964cc6'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 }, }}
          >
            <Button title="EDIT PROFILE"
              buttonStyle={{ borderRadius: 0, borderTopLeftRadius: 30, borderBottomLeftRadius: 30 }} containerStyle={{ flex: 1 }}
              onPress={() => { this.props.navigation.navigate("EditProfile"); }}
            />
            <View style={{ width: 1, height: '50%', backgroundColor: 'white' }} />
            <Button title="SETTINGS"

              buttonStyle={{ borderRadius: 0, borderTopRightRadius: 30, borderBottomRightRadius: 30 }} containerStyle={{ flex: 1 }}
              onPress={() => { this.props.navigation.navigate("EditSettings"); }}
            />
          </View> */}

            <LinearGradient
              style={{
                flexDirection: "row",
                width: 320,
                height: 44,
                alignSelf: "center",
                marginTop: 20,
                borderRadius: 30
              }}
              colors={["#4a46d6", "#964cc6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Button
                title="EDIT PROFILE"
                titleStyle={{ fontWeight: "bold", fontSize: 16 }}
                buttonStyle={{
                  borderRadius: 0,
                  borderTopLeftRadius: 30,
                  borderBottomLeftRadius: 30,
                  backgroundColor: "transparent",
                  marginTop: 3
                }}
                containerStyle={{ flex: 1 }}
                onPress={() => {
                  this.props.navigation.navigate("EditProfile");
                }}
              />
              <View
                style={{
                  width: 1,
                  backgroundColor: "white",
                  marginTop: 8,
                  marginBottom: 8
                }}
              />
              <Button
                title="SETTINGS"
                titleStyle={{ fontWeight: "bold", fontSize: 16 }}
                buttonStyle={{
                  borderRadius: 0,
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                  backgroundColor: "transparent",
                  marginTop: 3
                }}
                containerStyle={{ flex: 1 }}
                onPress={() => {
                  this.props.navigation.navigate("EditSettings");
                }}
              />
            </LinearGradient>

            <View
              style={[styles.controlBox, { marginTop: 20, marginLeft: "12%" }]}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10
                }}
                onPress={() => {
                  this.setState({ isModalVerifyEnabled: true });
                }}
              >
                <Image source={Images.Image28} style={{ marginRight: 10 }} />
                <Text
                  style={{ fontSize: 17, fontWeight: "bold", color: "#17144e" }}
                >
                  Verify Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10
                }}
                onPress={() => {
                  this.props.navigation.navigate("EditLocation");
                }}
              >
                <Image source={Images.Image29} style={{ marginRight: 10 }} />
                <Text
                  style={{ fontSize: 17, fontWeight: "bold", color: "#17144e" }}
                >
                  Edit Location
                </Text>
              </TouchableOpacity>
            </View>
            <Divider
              style={{
                backgroundColor: "grey",
                marginVertical: 10,
                marginHorizontal: 30
              }}
            />
            <View
              style={[styles.controlBox, { marginTop: 20, marginLeft: "12%" }]}
            >
              {/* <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10
                }}
                onPress={() => {}}
              >
                <Image source={Images.Image30} style={{ marginRight: 10 }} />
                <Text
                  style={{ fontSize: 17, fontWeight: "bold", color: "#17144e" }}
                >
                  Refer a Friend
                </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10
                }}
                onPress={() => {
                  this.props.navigation.navigate("Purchase");
                }}
              >
                <Image source={Images.Image31} style={{ marginRight: 10 }} />
                <Text
                  style={{ fontSize: 17, fontWeight: "bold", color: "#17144e" }}
                >
                  Go Premium
                </Text>
              </TouchableOpacity>
            </View>
            {profile.isEnableCoupon && (
              <View
                style={[
                  styles.controlBox,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    width: "72%",
                    alignSelf: "center"
                  }
                ]}
              >
                <TextInput
                  style={{
                    height: 40,
                    borderColor: "lightgray",
                    borderWidth: 1,
                    flex: 1,
                    paddingRight: 60,
                    paddingLeft: 5
                  }}
                  returnKeyType="done"
                  onChangeText={text => this.setState({ text })}
                  onBlur={() => {
                    this.handleKeyboardDidHide();
                  }}
                  onFocus={() => {
                    this.handleKeyboardDidShow();
                  }}
                  placeholder={"Apply Coupon Code"}
                  value={this.state.text}
                />
                {this.state.isLoading ? (
                  <Spinner
                    isVisible={this.state.isLoading}
                    type="Circle"
                    color="#3cb9fc"
                    size={20}
                    style={{ position: "absolute", right: 10 }}
                  />
                ) : (
                  <TouchableOpacity
                    style={{ position: "absolute", right: 10 }}
                    onPress={this.applyCoupon}
                  >
                    <Text
                      style={{
                        color: "#3cb9fc",
                        fontSize: 17,
                        fontWeight: "bold"
                      }}
                    >
                      Apply
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.controlBox}>
              <Text style={styles.bottomText}>
                {this.props.profile.subscribe_end_date
                  ? `Premium Subscription auto renews on ${moment(
                      this.props.profile.subscribe_end_date.replace(" ", "T")
                    ).format("DD/MM/YYYY")}`
                  : ""}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
        <Overlay
          isVisible={this.state.isModalVerifyEnabled}
          width="auto"
          height="auto"
          borderRadius={14}
          overlayStyle={{ padding: 30 }}
        >
          {this.renderSuccessModalContent()}
        </Overlay>
      </View>
    );
  }
}
let styles = {
  rootContainer: {
    flex: 1
  },
  nameLabel: {
    color: "#17144e",
    fontSize: 25,
    textAlign: "right",
    maxHeight: 50,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 2,
    fontWeight: "bold"
  },
  ageLabel: {
    color: "#17144e",
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
    marginLeft: 2,
    marginRight: 30
  },
  residentalLabel: {
    fontSize: 17,
    textAlign: "center",
    marginTop: 8,
    color: "#91919d"
  },
  controlBox: {
    width: Dimensions.get("window").width - 40,
    marginVertical: 5,
    marginHorizontal: 20
  },
  bottomText: {
    color: "#91919d",
    fontSize: 12,
    marginVertical: 30,
    width: "100%",
    textAlign: "center"
  },
  editBtnStyle: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  }
};

const mapStateToProps = state => {
  return {
    profile: state.user.profile,
    userToken: state.startup.userToken
  };
};
const mapDispatchToProps = dispatch => {
  return {
    updateProfile: data => dispatch(UserActions.fetchUserSuccess(data))
  };
};
export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
);
