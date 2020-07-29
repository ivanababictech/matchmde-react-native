import React, { Component } from "react";
import { View, Text, ScrollView, Image, Dimensions } from "react-native";

import { Images } from "App/Theme";
import { Button, CheckBox, Icon } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import RNPickerSelect from "react-native-picker-select";

let age = Array.from({ length: 82 }, (v, i) => ({
  label: `${18 + i}`,
  value: 18 + i
}));

export default class ProfileSecond extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: null,
      interest_gender: null,
      age_from: 18,
      age_to: 99
    };
  }

  handleNext = () => {
    if (this.state.gender == null) {
      alert("Please select your gender");
      return;
    }
    if (this.state.interest_gender == null) {
      alert("Please select your Looking gender");
      return;
    }
    this.props.onNext(this.state);
  };

  handleFromAge = (age_from, index, data) => {
    this.setState({ age_from: age_from });
  };

  handleToAge = (age_to, index, data) => {
    this.setState({ age_to: age_to });
  };

  render() {
    return (
      <ScrollView>
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
                marginLeft: 20,
                fontSize: 25,
                color: "#17144e",
                fontWeight: "bold"
              }}
            >
              {"Who Are You \nLooking For?"}
            </Text>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "space-around"
              }}
            >
              <Text style={{ color: "#17144e", fontSize: 17, flex: 1 }}>
                I am a:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center"
                }}
              >
                <CheckBox
                  checkedIcon={
                    <Image
                      source={Images.Man_Selected}
                      style={{ width: 68, height: 48 }}
                      resizeMode="contain"
                    />
                  }
                  uncheckedIcon={
                    <Image
                      source={Images.Man_Normal}
                      style={{ width: 68, height: 48 }}
                      resizeMode="contain"
                    />
                  }
                  checked={this.state.gender === "male"}
                  onPress={() => {
                    this.setState({ gender: "male" });
                  }}
                  containerStyle={{ margin: 0, padding: 0 }}
                />
                <CheckBox
                  checkedIcon={
                    <Image
                      source={Images.Woman_Selected}
                      style={{ width: 68, height: 48 }}
                      resizeMode="contain"
                    />
                  }
                  uncheckedIcon={
                    <Image
                      source={Images.Woman_Normal}
                      style={{ width: 68, height: 48 }}
                      resizeMode="contain"
                    />
                  }
                  checked={this.state.gender === "female"}
                  onPress={() => {
                    this.setState({ gender: "female" });
                  }}
                  containerStyle={{ margin: 0, padding: 0 }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                justifyContent: "space-between"
              }}
            >
              <Text style={{ color: "#17144e", fontSize: 17 }}>
                Looking for a:
              </Text>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  checkedIcon={
                    <Image
                      source={Images.Man_Selected}
                      style={{ width: 68, height: 48 }}
                      resizeMode="contain"
                    />
                  }
                  uncheckedIcon={
                    <Image
                      source={Images.Man_Normal}
                      style={{ width: 68, height: 48 }}
                      resizeMode="contain"
                    />
                  }
                  checked={
                    this.state.interest_gender === "male" ||
                    this.state.interest_gender === "both"
                  }
                  onPress={() => {
                    if (this.state.interest_gender === "male") {
                      this.setState({ interest_gender: null });
                    } else if (this.state.interest_gender === "female") {
                      this.setState({ interest_gender: "both" });
                    } else if (this.state.interest_gender === null) {
                      this.setState({ interest_gender: "male" });
                    } else {
                      this.setState({ interest_gender: "female" });
                    }
                  }}
                  containerStyle={{ margin: 0, padding: 0 }}
                />
                <CheckBox
                  checkedIcon={
                    <Image
                      source={Images.Woman_Selected}
                      style={{ width: 68, height: 48 }}
                      resizeMode="contain"
                    />
                  }
                  uncheckedIcon={
                    <Image
                      source={Images.Woman_Normal}
                      style={{ width: 68, height: 48 }}
                      resizeMode="contain"
                    />
                  }
                  checked={
                    this.state.interest_gender === "female" ||
                    this.state.interest_gender === "both"
                  }
                  onPress={() => {
                    if (this.state.interest_gender === "male") {
                      this.setState({ interest_gender: "both" });
                    } else if (this.state.interest_gender === "female") {
                      this.setState({ interest_gender: null });
                    } else if (this.state.interest_gender === null) {
                      this.setState({ interest_gender: "female" });
                    } else {
                      this.setState({ interest_gender: "male" });
                    }
                  }}
                  containerStyle={{ margin: 0, padding: 0 }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "space-between"
              }}
            >
              <Text style={{ color: "#17144e", fontSize: 17 }}>
                Between Ages:
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RNPickerSelect
                  onValueChange={value => this.setState({ age_from: value })}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
                  items={age}
                />
                <Text
                  style={{ marginRight: 10, fontSize: 17, color: "#91919d" }}
                >
                  {" "}
                  and{" "}
                </Text>
                <RNPickerSelect
                  onValueChange={value => this.setState({ age_to: value })}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
                  items={[...age].reverse()}
                />
              </View>
            </View>
            <Button
              title="Next"
              titleStyle={{ fontFamily: "ProximaNova-Bold" }}
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ["#4a46d6", "#964cc6"],
                start: { x: 0, y: 0 },
                end: { x: 0, y: 1 }
              }}
              buttonStyle={{ borderRadius: 30 }}
              icon={
                <Icon
                  name="md-arrow-round-forward"
                  type="ionicon"
                  color="white"
                  containerStyle={{ position: "absolute", right: 12 }}
                />
              }
              isDisabled={this.state.isDisabled}
              onPress={this.handleNext}
              containerStyle={{ marginBottom: 5, marginTop: 30 }}
            />
          </View>
        </View>
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
    width: Dimensions.get("window").width / 8,
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
    width: Dimensions.get("window").width / 8,
    height: 48
  },
  placeholderColor: "black",
  underline: { borderTopWidth: 0 }
};

let styles = {
  ageDropdownContainer: {
    width: 75,
    height: 48,
    padding: 0,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e6e2e2",
    borderRadius: 4
  }
};
