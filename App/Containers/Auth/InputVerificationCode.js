import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Linking
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { Header, Icon, Button } from "react-native-elements";
import Toast from "react-native-root-toast";
import firebase from "react-native-firebase";

import { Images, Values, ApplicationStyles } from "App/Theme";

import OTPInputView from "@twotalltotems/react-native-otp-input";

class InputVerificationCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isDisabled: false,
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
      code6: "",
      verifyCode: "",
      smsCode: "",

      user: null,
      message: "",
      codeInput: "",
      phoneNumber: this.props.navigation.getParam("phoneNumber"),
      confirmResult: this.props.navigation.getParam("confirmResult")
    };
  }

  gotoWebPage(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }

  resendSMS = phone_number => {
    this.setState({
      isDisabled: true,
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
      code6: ""
    });
    firebase
      .auth()
      .signInWithPhoneNumber(phone_number)
      .then(confirmResult => {
        // Toast.hide(this.toast);
        this.toast = Toast.show(
          "Code has been resent!",
          ApplicationStyles.toastOptionSuccess
        );
        this.setState({ confirmResult: confirmResult, isDisabled: false });
      })
      .catch(error => {
        Toast.hide(this.toast);
        this.toast = Toast.show(
          "Sign In With Phone Number Error.",
          ApplicationStyles.toastOptionError
        );
        this.setState({ isDisabled: false });
      });
  };

  handleLoginWithPhone = () => {
    // let code =
    //   this.state.code1 +
    //   this.state.code2 +
    //   this.state.code3 +
    //   this.state.code4 +
    //   this.state.code5 +
    //   this.state.code6;

    const code = this.state.smsCode;

    if (
      this.validation(code) &&
      this.state.confirmResult &&
      this.state.phoneNumber
    ) {
      this.props.navigation.navigate("ConfirmVerify", {
        phoneNumber: this.state.phoneNumber,
        confirmResult: this.state.confirmResult,
        confirmCode: code
      });
    }
  };

  setVerifyCode = (value, position) => {
    if (position === "pos1") {
      if (value === "") {
        this.code1.focus();
      } else {
        this.code2.focus();
      }
      if (value.length < 2) {
        this.setState({
          code1: value
        });
      }
    }
    if (position === "pos2") {
      if (value === "") {
        this.code1.focus();
      } else {
        this.code3.focus();
      }
      if (value.length < 2) {
        this.setState({
          code2: value
        });
      }
    }
    if (position === "pos3") {
      if (value === "") {
        this.code2.focus();
      } else {
        this.code4.focus();
      }
      if (value.length < 2) {
        this.setState({
          code3: value
        });
      }
    }
    if (position === "pos4") {
      if (value === "") {
        this.code3.focus();
      } else {
        this.code5.focus();
      }
      if (value.length < 2) {
        this.setState({
          code4: value
        });
      }
    }
    if (position === "pos5") {
      if (value === "") {
        this.code4.focus();
      } else {
        this.code6.focus();
      }
      if (value.length < 2) {
        this.setState({
          code5: value
        });
      }
    }
    if (position === "pos6") {
      if (value === "") {
        this.code5.focus();
      } else {
        this.code6.focus();
      }
      if (value.length < 2) {
        this.setState({
          code6: value
        });
      }
    }
  };

  validation = value => {
    let number = value.replace(/[^\d]/g, "");
    if (number.length === 6) {
      Toast.hide(this.toast);
      return true;
    } else if (number.length > 0) {
      Toast.hide(this.toast);
      this.toast = Toast.show(
        "Verify code should 6 digits.",
        ApplicationStyles.toastOptionError
      );
      return false;
    } else {
      Toast.hide(this.toast);
      this.toast = Toast.show(
        "Verify code is required.",
        ApplicationStyles.toastOptionError
      );
      return false;
    }
  };

  render() {
    console.log("verify code result -> ", this.state.confirmResult);
    return (
      <View style={styles.rootContainer}>
        <Header
          leftComponent={this.header_left}
          centerComponent={this.header_center}
          rightComponent={this.header_right}
          backgroundColor="transparent"
        />
        <ScrollView>
          <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Enter your verification code</Text>
            </View>

            <OTPInputView
              style={{ width: "80%", height: 120 }}
              pinCount={6}
              code={this.state.smsCode}
              onCodeChanged={code => {
                this.setState({ smsCode: code });
              }}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={code => {}}
            />
            {/* <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {Values.verificationDescription1}
                <Text
                  style={styles.descriptionTextUnderLine}
                  onPress={() =>
                    this.gotoWebPage(
                      "https://www.facebook.com/full_data_use_policy"
                    )
                  }
                >
                  {Values.verificationDescription2}
                </Text>
                {Values.verificationDescription3}
                <Text
                  style={styles.descriptionTextUnderLine}
                  onPress={() =>
                    this.gotoWebPage(
                      "https://www.facebook.com/full_data_use_policy"
                    )
                  }
                >
                  {Values.verificationDescription4}
                </Text>
                {Values.verificationDescription5}
                <Text
                  style={styles.descriptionTextUnderLine}
                  onPress={() =>
                    this.gotoWebPage("https://www.facebook.com/policy/cookies/")
                  }
                >
                  {Values.verificationDescription6}
                </Text>
                {Values.verificationDescription7}
                <Text
                  style={styles.descriptionTextUnderLine}
                  onPress={() =>
                    this.gotoWebPage(
                      "https://www.facebook.com/legal/FB_Work_Privacy"
                    )
                  }
                >
                  {Values.verificationDescription8}
                </Text>
                {Values.verificationDescription9}
                <Text
                  style={styles.descriptionTextUnderLine}
                  onPress={() =>
                    this.gotoWebPage("https://www.facebook.com/terms.php")
                  }
                >
                  {Values.verificationDescription10}
                </Text>
                {Values.verificationDescription11}
              </Text>
            </View> */}
            <View style={styles.buttonContainer}>
              <Button
                title="VERIFY NUMBER"
                titleStyle={{ fontFamily: "ProximaNova-Bold" }}
                ViewComponent={LinearGradient}
                linearGradientProps={{
                  colors: ["#4a46d6", "#964cc6"],
                  start: { x: 0, y: 0 },
                  end: { x: 0, y: 1 }
                }}
                buttonStyle={{ borderRadius: 30 }}
                isDisabled={this.state.isDisabled}
                onPress={this.handleLoginWithPhone}
                containerStyle={{ marginBottom: 5 }}
              />
              <View style={styles.sendCodeContainer}>
                <TouchableOpacity
                  onPress={() => this.resendSMS(this.state.phoneNumber)}
                  disabled={this.state.isDisabled}
                >
                  <Text style={styles.sendCode}>Resend code</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  header_left = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.goBack(null);
        }}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Icon
          name="ios-arrow-back"
          type="ionicon"
          containerStyle={{ marginRight: 4 }}
        />
        <Text style={styles.headerLeftText}>Back</Text>
      </TouchableOpacity>
    );
  };

  header_center = () => {
    return <Image source={Images.Image03} />;
  };

  header_right = () => {
    return (
      <TouchableOpacity>
        <Text />
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 45,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#3cb9fc"
  },

  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderRadius: 5,
    fontSize: 15,
    fontFamily: "ProximaNova-Bold"
  },

  underlineStyleHighLighted: {
    borderColor: "#3cb9fc"
  },

  rootContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  headerLeftText: {
    fontSize: 13
  },
  mainContainer: {
    flex: 1,
    alignItems: "center"
  },
  titleContainer: {
    marginTop: 20,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    color: "#17144e",
    fontSize: 22,
    fontWeight: "600"
  },
  inputContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    marginVertical: 20,
    marginBottom: 10
  },
  CodeContainer: {
    borderRadius: 5,
    backgroundColor: "#FFF",
    width: 40,
    height: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  descriptionContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center"
  },
  descriptionText: {
    color: "#91919d",
    fontSize: 14,
    textAlign: "center"
  },
  descriptionTextUnderLine: {
    color: "#91919d",
    fontSize: 14,
    textDecorationLine: "underline",
    textAlign: "center"
  },
  buttonContainer: {
    flex: 1,
    width: "70%",
    marginTop: 100
  },
  phoneInput: {
    flex: 1,
    width: "100%",
    fontSize: 18,
    fontFamily: "ProximaNova-Bold",
    textAlign: "center",
    color: "#000",
    margin: 0,
    padding: 0
  },
  sendCodeContainer: {
    width: "80%",
    alignItems: "center",
    marginHorizontal: "10%",
    marginTop: 20,
    marginBottom: 20
  },
  sendCode: {
    color: "#b537f2",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
    textAlign: "center"
  }
});

export default InputVerificationCode;
