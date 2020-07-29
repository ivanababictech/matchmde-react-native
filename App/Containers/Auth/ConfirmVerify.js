import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Header, Icon } from 'react-native-elements';
import { Values } from 'App/Theme';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import AsyncStorage from '@react-native-community/async-storage';

//import { BASE_URL, ENDPOINTS } from "../../servers/Api";
//import axios from "axios";

//import { setUserToken, fetchUserProfileFromAPI } from "../../redux/actions/actions";
import { connect } from "react-redux";
import firebase from 'react-native-firebase';

import { userService } from 'App/Services/UserService'
import StartupActions from 'App/Stores/Startup/Actions'

class ConfirmVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirm: false,
      isNotConfirm: false,
      isLogin: false,
      isDeactivated: false,
      isLoadingDone: false,
      progress: 0,
      phoneNumber: this.props.navigation.getParam("phoneNumber"),
      confirmResult: this.props.navigation.getParam("confirmResult"),
      confirmCode: this.props.navigation.getParam("confirmCode"),
      device_token: ""
    };
  }

  confirmCode = (verifyCode, confirmResult) => {
    if (confirmResult && verifyCode.length) {
      confirmResult
        .confirm(verifyCode)
        .then(user => {
          this.setState({ isNotConfirm: false });
          this.onLogin(user.uid);
          console.log("FireBase UID:", user.uid);
        })
        .catch(error => {
          console.log("firebase confirmResult err -> ",error);
          this.setState({ isNotConfirm: true });
        });
    }
  };

  _storeData = async userToken => {
    try {
      await AsyncStorage.setItem("userToken", JSON.stringify(userToken));
    } catch (error) {
      // Error saving data
    }
  };

  onLogin = uid => {
    const body = {
      firebase_id: uid,
      password: "password",
      platform: Platform.OS,
      device_token: this.props.startup.fcmtoken,
      latitude:this.props.startup.latitude,
      longitude:this.props.startup.longitude
    };

    userService.userExist(body).then(res=>{
        if (res.data === "deactivated") {
          this.setState({ isLogin: false, isLoadingDone: true, isDeactivated: true});
        } else {
          this._storeData(res.data.access_token);
          this.props.setUserToken(res.data);
          this.setState({ isLogin: true, isLoadingDone: true});
        }

    }).catch(error=>{
        console.log("Token Error:", error);
        this.setState({ isLogin: false, isLoadingDone: true});
    })
  };

  componentDidMount() {
    this.setProgress();
    this.confirmCode(this.state.confirmCode, this.state.confirmResult);
  }

  handleLoginWithPhone = () => {
    if (this.state.isLoadingDone) {
      setTimeout(() => {
        if (this.state.isNotConfirm) {
          this.props.navigation.navigate("InputPhoneNumber");
        } else if (this.state.isLogin) {
          this.props.navigation.navigate("Loading");
        } else {
          if (this.state.isDeactivated) {
              alert('This user is deactivated')
          } else {
            this.props.navigation.replace("InputProfile", {
              phoneNumber: this.state.phoneNumber,
            });
          }

        }
      }, 500);
    } else {
      this.setProgress();
    }
  };

  setProgress = async () => {
    this.setState({
      isLoadingDone: false
    });
    setTimeout(() => {
      this.setState({
        progress: 100
      });
    }, 800);
  };

  render() {
    return (
      <View style={styles.rootContainer}>
        <Header leftComponent={this.header_left} backgroundColor='transparent'/>
        <View style={styles.mainContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              {!this.state.isConfirm ? "Verifying..." : (this.state.isNotConfirm ? "Wrong verification code.\nPlease try again!" : "Done")}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={150} width={5} fill={this.state.progress}
              tintColor="#3cb9fc" rotation={0} duration={5000}
              onAnimationComplete={value => {
                setTimeout(() => {
                  this.setState({ isConfirm: value.finished });
                  if (value.finished) {
                    this.handleLoginWithPhone();
                  }
                }, 500);
              }}>
              { ()=>
                  this.state.isConfirm ? (
                    this.state.isNotConfirm ? (
                      <Icon type='ionicon' name={"md-close"} size={60} color={"#3cb9fc"} />
                    ) : (
                      <Icon type='ionicon' name={"md-checkmark"} size={60} color={"#3cb9fc"} />
                    )
                  ) : null
              }
            </AnimatedCircularProgress>
          </View>
          {this.state.isConfirm && !this.state.isNotConfirm ? (
            <View style={styles.goContainer}>
              <Text style={styles.titleText}>{"Taking you to"}</Text>
              <Text style={styles.titleText}>{"MatchMde."}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  header_left = () => {
    return (
      <TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }} style={{flexDirection:'row', alignItems:'center'}}>
        <Icon name='ios-arrow-back' type='ionicon' containerStyle={{marginRight:4}}/>
        <Text style={styles.headerLeftText}>Back</Text>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor:'#f9f9f9'
  },
  headerLeftText: {
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center"
  },
  titleContainer: {
    marginTop: 50,
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    color: "#17144e",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30
  },
  goContainer: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  return {
    startup: state.startup,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserToken: data => dispatch(StartupActions.updateUserToken(data)),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(ConfirmVerify);

