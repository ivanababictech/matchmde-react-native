import React, { Component } from "react";
import {View,StyleSheet,TouchableOpacity,Text,Image,Dimensions} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Header, Button } from 'react-native-elements';

import Pulse from "react-native-pulse";
import { connect } from "react-redux";
import { userService } from 'App/Services/UserService'
import { getPlaceDetailWithCoordinates } from "App/Services/HelperServices";
import UserActions from 'App/Stores/User/Actions'
import {fbService} from "../../Services/FirebaseService";
import Spinner from 'react-native-spinkit';
import AsyncStorage from '@react-native-community/async-storage';

class LoadingView extends Component {
  constructor(props) {
    super(props);
  }

  getLocationSettingState = async () => {
    try {
        let locationSettingState = await AsyncStorage.getItem('locationSettingState');
        if (locationSettingState !== null) {
            return Number(locationSettingState);
        }
        return 1;
    } catch (error) {
        return 1;
    }
}

  async componentDidMount() {
    const sState = await this.getLocationSettingState();

    if(sState === 1) {
      this.onRegionChange();
    }
    
    setTimeout(() => {
      this.onLoad();
    }, 1000);
    
  }

  onLoad() {
    const access_token = this.props.startup.userToken.access_token;
    
    this.props.fetchAllInformation(access_token, this.props.navigation.getParam("isSignUp"));

    fbService.getIndroductionState(this.props.user.profile.firebase_id, res => {
      if (res != null && res == true) {
        fbService.setUserFCMToken(this.props.user.profile.firebase_id, this.props.startup.fcmtoken, null);
      }
    })
  }

  onRegionChange() {

    const { longitude, latitude } = this.props.startup;
    
    console.log("startup data ->", this.props.startup);

		getPlaceDetailWithCoordinates(latitude, longitude, res => {
			const addressComponent = res.filter(v => v.address_components.length == 3);
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
        userService.post(this.props.startup.userToken.access_token, '/account/profile', profile).then(res => {
          console.log("profile from server", res);
          // this.props.updateProfile({ profile: res.data });
          console.log("profile from local", this.props.user.profile);
        })
			}

    })
  }

  render() {
    if(!this.props.isLoading){

      // if (this.props.navigation.getParam("isSignUp") != null) {
        // this.onRegionChange()
      // }
    }
    return (
      <View style={styles.rootContainer}>
          <View style={styles.mainContainer}>
            {/* <Pulse color="#3cb9fc" numPulses={5} diameter={400} speed={5} duration={2500} initialDiameter={200}/> */}
            <Spinner style={{marginTop:50}} size= {100} isVisible={true} type='Circle' color='#3cb9fc'/>
            <View style={styles.inCircle}>
              <Image source={{ uri: this.props.user.picture }}
                style={styles.avatarImage}
                resizeMode={"cover"}/>
            </View>
          </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  mainContainer: {
    flex: 1,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0
  },
  avatarImage: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.4,
    borderRadius: (Dimensions.get("window").width * 0.4) / 2
  }
});

const mapStateToProps = state => {
  return {
    user:state.user,
    startup:state.startup,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllInformation:(access_token, isSignUp)=>dispatch(UserActions.fetchAllInformation(access_token, isSignUp)),
    updateProfile:(data)=>dispatch(UserActions.fetchUserSuccess(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingView);
