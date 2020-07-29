import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  Keyboard,
  Linking
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Header, Icon, Button } from "react-native-elements";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";
import Toast from "react-native-root-toast";
import SmsRetriever from "react-native-sms-retriever";

import { Values, Images, ApplicationStyles } from "App/Theme";
import firebase from "react-native-firebase";

class InputPhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "CONTINUE",
      countryCode: "65",
      cca2: "SG",
      phoneNumber: "",

      user: null,
      message: "",
      codeInput: "",
      confirmResult: null,
      loading: false
    };
  }

  sendSMS = phone_number => {
    this.setState({ isLoading: true });
    firebase
      .auth()
      .signInWithPhoneNumber(phone_number)
      .then(confirmResult => {
        // Toast.hide(this.toast);
        // this.toast = Toast.show("Code has been sent!", ApplicationStyles.toastOptionSuccess);
        // this._onSmsListenerPressed()
        this.setState({ isLoading: false });
        setTimeout(() => {
          this.props.navigation.navigate("InputVerificationCode", {
            phoneNumber: phone_number,
            confirmResult: confirmResult
          });
        }, 500);
      })
      .catch(error => {
        Toast.hide(this.toast);
        this.toast = Toast.show(
          "Can't sign in with phone number.",
          ApplicationStyles.toastOptionError
        );
        this.setState({ isLoading: false });
      });
    /*this.props.navigation.navigate("InputProfile", {
      phoneNumber: '+79217897614',
      uid:'9fdCDvPmT2hqVllevmt8vWJTL432'
    });*/
  };

  _onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        SmsRetriever.addSmsListener(event => {
          SmsRetriever.removeSmsListener();
        });
      }
    } catch (error) {
      console.log("SmsListenerPressed error", error);
    }
  };

  handleLoginWithPhone = () => {
    // this._onSmsListenerPressed()
    // return

    Keyboard.dismiss();

    if (this.validation(this.state.phoneNumber, this.state.countryCode)) {
      let phone_number = "+" + this.state.countryCode + this.state.phoneNumber;
      this.sendSMS(phone_number);
    }
  };

  phoneNumberValidation = number => {
    let value = number.replace(/[^\d]/g, "");
    if (value.length < 16) {
      this.setState({ phoneNumber: value });
    }
  };

  validation = (phoneNumber, countryCode) => {
    let number = phoneNumber.replace(/[^\d]/g, "");
    if (number.length <= 15 && countryCode.length > 0 && number.length >= 5) {
      //Toast.hide(this.toast);
      return true;
    } else if (!number.length > 0) {
      //Toast.hide(this.toast);
      this.toast = Toast.show(
        "Phone number is required.",
        ApplicationStyles.toastOptionError
      );
      return false;
    } else {
      //Toast.hide(this.toast);
      this.toast = Toast.show(
        "Phone number is incorrect.",
        ApplicationStyles.toastOptionError
      );
      return false;
    }
  };

  gotoWebPage(url) {
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
        <Header
          leftComponent={this.header_left}
          centerComponent={this.header_center}
          rightComponent={this.header_right}
          backgroundColor="#1d233100"
        />
        <ScrollView
        //keyboardShouldPersistTaps= "always"
        >
          <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Enter your phone number</Text>
            </View>
            <Text style={styles.subtitleText}>
              {"We'll use this number to create \nyour account"}
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.countryCodeContainer}>
                <CountryPicker
                  countryList={Values.country_code}
                  cca2={this.state.cca2}
                  showCallingCode={true}
                  translation="eng"
                  hideAlphabetFilter={true}
                  closeable={true}
                  filterable={true}
                  onChange={value =>
                    this.setState({
                      cca2: value.cca2,
                      countryCode: value.callingCode
                    })
                  }
                />
              </View>
              <View style={styles.phoneNumberContainer}>
                <Text style={styles.countryCodeText}>
                  (+{this.state.countryCode}){" "}
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.phoneInput}
                  returnKeyType="done"
                  onChangeText={value => this.phoneNumberValidation(value)}
                  value={this.state.phoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {Values.phoneNumberDescription1}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="SEND SMS"
                titleStyle={{ fontFamily: "ProximaNova-Bold" }}
                ViewComponent={LinearGradient}
                linearGradientProps={{
                  colors: ["#4a46d6", "#964cc6"],
                  start: { x: 0, y: 0 },
                  end: { x: 0, y: 1 }
                }}
                loading={this.state.loading}
                buttonStyle={{ borderRadius: 30 }}
                onPress={this.handleLoginWithPhone}
                loading={this.state.isLoading}
                containerStyle={{ marginBottom: 5 }}
              />
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
    marginTop: 50,
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
  subtitleText: {
    textAlign: "center",
    color: "#91919d"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 20
  },
  countryCodeContainer: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#FFF",
    height: 40,
    marginHorizontal: 5,
    alignItems: "center",
    paddingTop: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  phoneNumberContainer: {
    flex: 4,
    borderRadius: 5,
    backgroundColor: "#FFF",
    height: 40,
    marginHorizontal: 5,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
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
    width: "80%",
    marginTop: 50
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: "#000",
    margin: 0,
    padding: 0
  },
  countryCodeText: {
    fontSize: 18
  }
});

export default InputPhoneNumber;
