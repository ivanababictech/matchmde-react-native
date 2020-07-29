import React, { Component } from "react";
import {
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Vibration,
  Animated,
  Dimensions,
  Platform
} from "react-native";

import { Images, ApplicationStyles } from "App/Theme";
import { Icon, Button } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";
import LinearGradient from "react-native-linear-gradient";
import DateTimePicker from "react-native-modal-datetime-picker";
import Toast from "react-native-root-toast";

import { userService } from "App/Services/UserService";

import TextInput2 from "./TextInput2";
import RNPickerSelect from "react-native-picker-select";

import { withNavigation } from "react-navigation";

const { width, height } = Dimensions.get("window");
const bodyTypeData = [
  { value: "Thin" },
  { value: "Athletic" },
  { value: "Average" },
  { value: "Curvy" },
  { value: "Big/Tall" }
];
const educationData = [
  { value: "High school" },
  { value: "College" },
  { value: "Bachelor" },
  { value: "Master" },
  { value: "PhD" }
];
const heightData = Array.from({ length: 111 }, (v, i) => ({
  label: `${140 + i}`,
  value: 140 + i
}));

const { State: TextInputState } = TextInput;

class ProfileFirst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.navigation.getParam("facebookName"),
      birthday: null,
      birthday_show: null,
      height: 160,
      body_type: "Athletic",
      job_title: "Unemployed",
      education: "Bachelor",
      isDateTimePickerVisible: false,
      email: "",
      shift: new Animated.Value(0)
    };
  }

  handleKeyboardDidShow = () => {
    // const { height: windowHeight } = Dimensions.get('window');
    // const keyboardHeight = event.endCoordinates.height;
    // const currentlyFocusedField = TextInputState.currentlyFocusedField();
    // UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
    //     const fieldHeight = height;
    //     const fieldTop = pageY;
    //     const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
    //     if (gap >= 0) {
    //         return;
    //     }
    //     Animated.timing(
    //         this.state.shift,
    //         {
    //             toValue: gap,
    //             duration: 500,
    //             useNativeDriver: true,
    //         }
    //     ).start();
    // });

    Animated.timing(this.state.shift, {
      toValue: -150,
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

  handleNext = () => {
    const {
      name,
      birthday,
      height,
      body_type,
      job_title,
      education,
      email
    } = this.state;
    if (name == null) {
      alert("Please input your Name");
      return;
    }
    if (!this.validateEmail(email)) {
      alert("Email is not correct");
      return;
    }
    if (birthday == null) {
      alert("Please input your Date of birth");
      return;
    }
    if (this.calcAge(birthday) < 18) {
      alert("Invalid date");
      return;
    }
    if (height == null) {
      alert("Please input your height");
      return;
    }
    if (body_type == null) {
      alert("Please input your body type");
      return;
    }
    if (job_title == null) {
      alert("Please input about your work");
      return;
    }
    if (education == null) {
      alert("please input about your Education");
      return;
    }

    this.props.onNext({
      name,
      birthday,
      height,
      body_type,
      job_title,
      education,
      email
    });
  };

  calcAge = dobStr => {
    let dob = this.toDate(dobStr);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  toDate = dateStr => {
    const parts = dateStr.split("/");
    return new Date(parts[2], parts[0] - 1, parts[1]);
  };

  validateEmail = eM => {
    if (eM === "") return true;
    let reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(eM);
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    let birthdayVal_show =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    let birthdayVal =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    if (userService.calcAge(birthdayVal) <= 13) {
      Toast.show(
        "Age should be 13 over.",
        ApplicationStyles.toastOptionSuccess
      );
    } else {
      this.setState({ birthday: birthdayVal });
      this.setState({ birthday_show: birthdayVal_show });
      this.hideDateTimePicker();
    }
  };

  handleEducation = (education, index, data) => {
    this.setState({ education });
  };

  handleBodyType = (body_type, index, data) => {
    this.setState({ body_type });
  };

  render() {
    const { shift } = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <Animated.View
          style={[
            { flex: 1, justifyContent: "center" },
            { transform: [{ translateY: shift }] }
          ]}
        >
          <View style={{ marginLeft: "7%", marginRight: "7%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "4%"
              }}
            >
              <Image source={Images.Image02} />
              <Text
                style={{
                  marginLeft: 16,
                  fontSize: 24,
                  color: "#17144e",
                  fontFamily: "ProximaNova-Bold"
                }}
              >
                {"Let Me Know You \na Little More"}
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 30
                }}
              >
                <Icon
                  name="calendar"
                  type="octicon"
                  containerStyle={{ marginRight: 8 }}
                />
                <Text style={styles.titleTextStyle}>
                  Tell us your name and date of birth:
                </Text>
              </View>
              <Image
                source={require("../../Assets/Images/cal.png")}
                resizeMode="contain"
                style={{
                  alignSelf: "center",
                  marginTop: height / 14,
                  width: 120,
                  height: 120,
                  marginBottom: height / 14
                }}
              />
              <TextInput2
                style={styles.textInputStyle}
                maxLength={25}
                placeholder="Your Name"
                returnKeyType="done"
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
              />
              <TouchableOpacity onPress={this.showDateTimePicker}>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="Your Date of Birth(DD/MM/YY)"
                  editable={false}
                  pointerEvents="none"
                  value={this.state.birthday_show}
                />
              </TouchableOpacity>

              <Button
                title="NEXT"
                titleStyle={{ fontFamily: "ProximaNova-Bold" }}
                ViewComponent={LinearGradient}
                linearGradientProps={{
                  colors: ["#4a46d6", "#964cc6"],
                  start: { x: 0, y: 0 },
                  end: { x: 0, y: 1 }
                }}
                buttonStyle={{ borderRadius: 30 }}
                isDisabled={this.state.isDisabled}
                icon={
                  <Icon
                    name="md-arrow-round-forward"
                    type="ionicon"
                    color="white"
                    containerStyle={{ position: "absolute", right: 12 }}
                  />
                }
                onPress={this.handleNext}
                containerStyle={{ marginBottom: 25, marginTop: 30 }}
              />
            </View>
          </View>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            datePickerModeAndroid={"spinner"}
            onCancel={this.hideDateTimePicker}
          />
        </Animated.View>
      </ScrollView>
    );
  }
}

const pickerStyle = {
  inputIOS: {
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderColor: "#e6e2e2",
    borderWidth: 1,
    fontSize: 17,
    color: "black",
    // fontFamily: 'ProximaNova-Bold',
    width: Dimensions.get("window").width - 58,
    height: 48
  },
  inputAndroid: {
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderColor: "#e6e2e2",
    borderWidth: 1,
    fontSize: 17,
    color: "black",
    // fontFamily: 'ProximaNova-Bold',
    width: Dimensions.get("window").width - 100,
    height: 48
  },
  placeholderColor: "white",
  underline: { borderTopWidth: 0 }
};

let styles = {
  textInputStyle: {
    height: 48,
    borderColor: "#e6e2e2",
    borderWidth: 1,
    marginTop: 15,
    paddingLeft: 10,
    borderRadius: 4,
    fontSize: 17,
    color: "#000"
    // fontFamily: 'ProximaNova-Bold'
  },
  textInput: {
    backgroundColor: "white",
    height: 40
  },
  dropdownContainer: {
    height: 48,
    paddingVertical: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#e6e2e2"
  },
  dropdownInput: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingLeft: 10,
    marginRight: 3
  },
  titleTextStyle: {
    fontSize: 17,
    color: "#17144e",
    fontFamily: "ProximaNova-Bold"
  }
};

export default withNavigation(ProfileFirst);
