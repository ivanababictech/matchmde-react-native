import React, { Component } from "react";
import { View, Text, Image, Platform } from "react-native";
import Spinner from "react-native-spinkit";
import firebase from "react-native-firebase";
import Toast from "react-native-root-toast";

import { Images, ApplicationStyles } from "App/Theme";
import { userService } from "App/Services/UserService";
//import { ENDPOINTS, BASE_URL } from "App/servers/Api";

import StartupActions from "App/Stores/Startup/Actions";
import { connect } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";

class SendingProfile extends Component {
  UNSAFE_componentWillMount() {

    /*firebase.messaging().getToken()
			.then(token => {
			    const { profileData } = this.props;
				const {profile_image} = profileData

				userSerivce.uploadImageToAWS3(profile_image)
					.then(res=>{
						//this.onRegister(res);
					})
		});*/
    const { profileData } = this.props;
    const { profile_image } = profileData;

    userService.uploadImageToAWS3(profile_image).then(res => {
      // RNFetchBlob.fs
      // .unlink(profile_image)
      // .then(() => {
      // 	console.log("File deleted");
      // })
      this.onRegister(res);
    });
  }

  onRegister(imageUri) {
    let { profileData } = this.props;
    profileData['picture'] = imageUri;
    console.log(profileData);
    if (profileData.phone_number == undefined) {
      profileData.phone_number = "";
    }
    profileData.education = "Bachelor";

    const body = {
      ...profileData,
      firebase_id: firebase.auth().currentUser.uid,
      password: "password",
      platform: Platform.OS,
      referral_link: "123qwer1243",
      device_token: this.props.startup.fcmtoken,
      latitude: this.props.startup.latitude,
      longitude: this.props.startup.longitude
    };

    console.log(body)

    userService
      .registerUser(body)
      .then(res => {
        console.log("Register User Response=", res);

        this.props.setUserToken(res.data);

        const bodyPhoto = {
          thumbnail: body.picture,
          url: body.picture,
          order: 0
        };
        console.log("Access Token=", res.data.access_token);
        userService
          .uploadOnePhoto(res.data.access_token, bodyPhoto)
          .then(res => {
            this.props.onNext();
          })
          .catch(err => {
            console.log("uploadOnePhoto -> ", err);
            this.toast = Toast.show(
              "Can not Sign up.",
              ApplicationStyles.toastOptionError
            );
            this.props.onBack();
          });
      })
      .catch(error => {
        console.warn("Catch Error in Register User:", error);
        this.setState({
          isLoading: false,
          isDisabled: false
        });
        //Toast.hide(this.toast);
        this.toast = Toast.show(
          "Can not Sign up.",
          ApplicationStyles.toastOptionError
        );
        this.props.onBack();
      });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={Images.Image02}
          style={{ width: 160, height: 160, marginBottom: 40 }}
        />
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 30,
            color: "#17144e"
          }}
        >
          Welcome to Matchmade!
        </Text>
        <Text style={{ fontSize: 17, color: "#91919d", textAlign: "center" }}>
          {"Let me get cracking and find you some \nmatches."}
        </Text>
        <Spinner
          style={{ marginTop: 50 }}
          isVisible={true}
          type="Circle"
          color="#3cb9fc"
        />
        <Text style={{ color: "#17144e", marginTop: 38, fontStyle: "italic" }}>
          I’ll be right back!
        </Text>
      </View>
    );
  }
}

const mapStateToPros = state => {
  return {
    startup: state.startup
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserToken: data => dispatch(StartupActions.updateUserToken(data))
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(SendingProfile);
