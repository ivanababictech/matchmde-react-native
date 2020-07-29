import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  Keyboard,
  UIManager,
  Platform,
  Alert
} from "react-native";
import { Button, Icon, CheckBox, Overlay, Header } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import MultiSlider from "react-native-easy-slider";
import { Dropdown } from "react-native-material-dropdown";
import Spinner from "react-native-spinkit";
import DateTimePicker from "react-native-modal-datetime-picker";

import { Images, ApplicationStyles } from "App/Theme";
import DatingActions from "App/Stores/Dating/Actions";
import CheckableComponent from "App/Components/Common/CheckableComponent";
import { userService } from "App/Services/UserService";
import UserActions from "App/Stores/User/Actions";

import { connect } from "react-redux";

const { State: TextInputState } = TextInput;

const width = Dimensions.get("window").width;
const educationData = [
  { value: "High school" },
  { value: "College" },
  { value: "Bachelor" },
  { value: "Master" },
  { value: "PhD" }
];
const nationalData = [
  { value: "Australia" },
  { value: "China" },
  { value: "France" },
  { value: "India" },
  { value: "Indonesia" },
  { value: "Italy" },
  { value: "Japan" },
  { value: "Pakistan" },
  { value: "Philippines" },
  { value: "Russia" },
  { value: "Singapore" },
  { value: "South Korea" },
  { value: "Taiwan" },
  { value: "Thailand" },
  { value: "Vietnam" },
  { value: "UK" },
  { value: "USA" },
  { value: "Others" }
];
const religionData = [
  { value: "Atheist" },
  { value: "Buddhist" },
  { value: "Christian" },
  { value: "Catholic" },
  { value: "Protestant" },
  { value: "Hindu" },
  { value: "Jewish" },
  { value: "Muslim" },
  { value: "Sikh" },
  { value: "Other" }
];
const statusData = [
  { value: "Single" },
  { value: "Separated" },
  { value: "Divorced" },
  { value: "Widowed" }
];
const hasChildrenData = [{ value: "Don't have" }, { value: "Have" }];
const drinkData = [
  { value: "Non-Drinker" },
  { value: "Social Drinker" },
  { value: "Heavy Drinker" }
];
const smokerData = [
  { value: "Non-Smoker" },
  { value: "Social Smoker" },
  { value: "Heavy Smoker" }
];

class EditProfileScreen extends Component {
  static navigationOptions = {
    title: "Edit Profile"
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      isLoading: false,

      name: "",
      birthday: "",
      religion: "",
      height: 80,
      body_type: "",
      education: "",
      nationality: "Singapore",
      job: "",
      hobby: "",
      has_children_str: "Don't have",

      shift: new Animated.Value(0)
    };
  }

  componentDidMount() {
    /*this.setState({
			name:this.props.profile.name,
			birthday:this.props.profile.birthday,
			height:this.props.profile.height,
			body_type:this.props.profile.body_type,
		})*/
    const state = this.props.profile;
    this.setState({
      ...state,
      isLoading: false,
      has_children_str: state.has_children ? "Have" : "Don't have",
      hobby: state.hobby != null ? state.hobby : ""
    });
  }

  addHobby(addedH) {
    const hobby = this.state.hobby;
    if (hobby.includes(addedH.hobby)) {
      this.setState({
        hobby: this.state.hobby.replace(`${addedH.hobby},`, "")
      });
    } else {
      this.setState({
        hobby: this.state.hobby + `${addedH.hobby},`
      });
    }
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({
      birthday:
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    });
    this.hideDateTimePicker();
  };

  async onSave() {
    this.setState({ isLoading: true });
    try {
      console.log("putted profile info=", this.state);
      const rawResponse = await userService.post(
        this.props.userToken.access_token,
        "/account/profile",
        this.state
      );

      let profile = { ...this.props.profile, ...this.state };
      console.log("Profile Saving=", profile);
      //this.props.updateProfilePhotos(photos)
      this.props.updateProfilePhotos({ profile: profile });

      this.props.updateDiscoverNumber(1);
      this.props.fetchDiscover(1);

      this.loadUsers();

      setTimeout(() => Alert.alert("Success", "Profile saved"), 500);
    } catch (err) {
      alert("Failed, try later");
      console.log("account profile error -> ", err);
    }
    this.setState({ isLoading: false });
  }

  loadUsers = async () => {
    let peopleResponse;
    try {
      peopleResponse = await userService.get_request(
        this.props.userToken.access_token,
        "/suggest_matches"
      );
      let matched = peopleResponse.data;
      this.props.updateTodayMatch(matched);
    } catch (err) {
      console.log("today matches err -> ", err);
    }
  };

  kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  handleKeyboardDidShow = () => {
    Animated.timing(this.state.shift, {
      toValue: Platform.OS === "ios" ? -280 : 0,
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

  enableScroll = () => this.setState({ scrollEnabled: true });
  disableScroll = () => this.setState({ scrollEnabled: false });

  renderHeaderLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.goBack();
        }}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Icon name="ios-arrow-back" color="#17144e" type="ionicon" />
        <Text style={{ marginLeft: 10, color: "#17144e" }}>Back</Text>
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    return (
      <Text style={{ fontSize: 21, color: "#17144e", fontWeight: "bold" }}>
        Edit Profile
      </Text>
    );
  };

  render() {
    const { shift } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        <Header
          leftComponent={this.renderHeaderLeft}
          backgroundColor="transparent"
          centerComponent={this.renderHeaderCenter}
        />
        <View
          style={{
            flex: 1,
            padding: 27,
            paddingTop: 0,
            backgroundColor: "#f9f9f9"
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Animated.View style={[{ transform: [{ translateY: shift }] }]}>
              <Text style={styles.optionDesc}>Name</Text>
              <TextInput
                style={[styles.singleLineInput, { color: "gray" }]}
                value={this.state.name}
                editable={false}
                onChangeText={name => this.setState({ name })}
              />
              <Text style={styles.optionDesc}>Date of Birth</Text>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => {}}
              >
                <TextInput
                  style={[styles.singleLineInput, { color: "gray" }]}
                  placeholder="Your Date of Birth(DD/MM/YY)"
                  editable={false}
                  pointerEvents="none"
                  value={this.state.birthday}
                />
                <Icon
                  type="evilicon"
                  name="calendar"
                  containerStyle={{ position: "absolute", right: 10 }}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.optionDesc}>Height</Text>
                <Text style={styles.optionDesc}>{this.state.height}cm</Text>
              </View>
              <MultiSlider
                onValuesChangeStart={this.disableScroll}
                onValuesChangeFinish={this.enableScroll}
                sliderLength={width - 108}
                containerStyle={{ alignSelf: "center" }}
                values={[this.state.height]}
                min={80}
                max={300}
                onValuesChangeFinish={values => {
                  this.setState({ height: values[0] });
                }}
                onValuesChange={values => {
                  this.setState({ height: values[0] });
                }}
                customMarker={e => {
                  return <Image source={Images.Thumb} />;
                }}
              />
              <Text style={styles.optionDesc}>Body Type</Text>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <CheckBox
                  onPress={() => {
                    this.setState({ body_type: "Thin" });
                  }}
                  checked={this.state.body_type === "Thin"}
                  checkedIcon={<CheckableComponent checked label="THIN" />}
                  uncheckedIcon={<CheckableComponent label="THIN" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.setState({ body_type: "Athletic" });
                  }}
                  checked={this.state.body_type === "Athletic"}
                  checkedIcon={<CheckableComponent checked label="ATHLETIC" />}
                  uncheckedIcon={<CheckableComponent label="ATHLETIC" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.setState({ body_type: "Average" });
                  }}
                  checked={this.state.body_type === "Average"}
                  checkedIcon={<CheckableComponent checked label="AVERAGE" />}
                  uncheckedIcon={<CheckableComponent label="AVERAGE" />}
                  containerStyle={styles.checkboxContainer}
                />
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <CheckBox
                  onPress={() => {
                    this.setState({ body_type: "Curvy" });
                  }}
                  checked={this.state.body_type === "Curvy"}
                  checkedIcon={<CheckableComponent checked label="CURVY" />}
                  uncheckedIcon={<CheckableComponent label="CURVY" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.setState({ body_type: "Big/Tall" });
                  }}
                  checked={this.state.body_type === "Big/Tall"}
                  checkedIcon={<CheckableComponent checked label="BIG/TALL" />}
                  uncheckedIcon={<CheckableComponent label="BIG/TALL" />}
                  containerStyle={styles.checkboxContainer}
                />
              </View>
              <Text style={styles.optionDesc}>Nationality</Text>
              <Dropdown
                label=""
                containerStyle={styles.dropdownContainer}
                labelHeight={8}
                value={this.state.nationality}
                data={nationalData}
                rippleInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
                onChangeText={(args, index, data) => {
                  this.state.nationality = args;
                }}
                inputContainerStyle={styles.dropdownInput}
              />
              <Text style={styles.optionDesc}>Education</Text>
              <Dropdown
                label=""
                data={educationData}
                containerStyle={styles.dropdownContainer}
                labelHeight={8}
                value={this.state.education}
                onChangeText={value => {
                  this.setState({ education: value });
                }}
                rippleInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
                inputContainerStyle={styles.dropdownInput}
              />
              <Text style={styles.optionDesc}>Interests</Text>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Exercise" });
                  }}
                  checked={this.state.hobby.includes("Exercise")}
                  checkedIcon={<CheckableComponent checked label="EXERCISE" />}
                  uncheckedIcon={<CheckableComponent label="EXERCISE" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Photography" });
                  }}
                  checked={this.state.hobby.includes("Photography")}
                  checkedIcon={
                    <CheckableComponent checked label="PHOTOGRAPHY" />
                  }
                  uncheckedIcon={<CheckableComponent label="PHOTOGRAPHY" />}
                  containerStyle={styles.checkboxContainer}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Art" });
                  }}
                  checked={this.state.hobby.includes("Art")}
                  checkedIcon={<CheckableComponent checked label="ART" />}
                  uncheckedIcon={<CheckableComponent label="ART" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Traveling" });
                  }}
                  checked={this.state.hobby.includes("Traveling")}
                  checkedIcon={<CheckableComponent checked label="TRAVELING" />}
                  uncheckedIcon={<CheckableComponent label="TRAVELING" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Games" });
                  }}
                  checked={this.state.hobby.includes("Games")}
                  checkedIcon={<CheckableComponent checked label="GAMES" />}
                  uncheckedIcon={<CheckableComponent label="GAMES" />}
                  containerStyle={styles.checkboxContainer}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Music" });
                  }}
                  checked={this.state.hobby.includes("Music")}
                  checkedIcon={<CheckableComponent checked label="MUSIC" />}
                  uncheckedIcon={<CheckableComponent label="MUSIC" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Reading" });
                  }}
                  checked={this.state.hobby.includes("Reading")}
                  checkedIcon={<CheckableComponent checked label="READING" />}
                  uncheckedIcon={<CheckableComponent label="READING" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Pets" });
                  }}
                  checked={this.state.hobby.includes("Pets")}
                  checkedIcon={<CheckableComponent checked label="PETS" />}
                  uncheckedIcon={<CheckableComponent label="PETS" />}
                  containerStyle={styles.checkboxContainer}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Politics" });
                  }}
                  checked={this.state.hobby.includes("Politics")}
                  checkedIcon={<CheckableComponent checked label="POLITICS" />}
                  uncheckedIcon={<CheckableComponent label="POLITICS" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Outdoors" });
                  }}
                  checked={this.state.hobby.includes("Outdoors")}
                  checkedIcon={<CheckableComponent checked label="OUTDOORS" />}
                  uncheckedIcon={<CheckableComponent label="OUTDOORS" />}
                  containerStyle={styles.checkboxContainer}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Indoors" });
                  }}
                  checked={this.state.hobby.includes("Indoors")}
                  checkedIcon={<CheckableComponent checked label="INDOORS" />}
                  uncheckedIcon={<CheckableComponent label="INDOORS" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Dancing" });
                  }}
                  checked={this.state.hobby.includes("Dancing")}
                  checkedIcon={<CheckableComponent checked label="DANCING" />}
                  uncheckedIcon={<CheckableComponent label="DANCING" />}
                  containerStyle={styles.checkboxContainer}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Cooking" });
                  }}
                  checked={this.state.hobby.includes("Cooking")}
                  checkedIcon={<CheckableComponent checked label="COOKING" />}
                  uncheckedIcon={<CheckableComponent label="COOKING" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Movies" });
                  }}
                  checked={this.state.hobby.includes("Movies")}
                  checkedIcon={<CheckableComponent checked label="MOVIES" />}
                  uncheckedIcon={<CheckableComponent label="MOVIES" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.addHobby({ hobby: "Sports" });
                  }}
                  checked={this.state.hobby.includes("Sports")}
                  checkedIcon={<CheckableComponent checked label="SPORTS" />}
                  uncheckedIcon={<CheckableComponent label="SPORTS" />}
                  containerStyle={styles.checkboxContainer}
                />
              </View>
              <Text style={styles.optionDesc}>Job Title</Text>
              <TextInput
                style={styles.singleLineInput}
                value={this.state.job}
                returnKeyType="done"
                onChangeText={job => this.setState({ job })}
              />
              <Text style={styles.optionDesc}>I am Interested in</Text>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <CheckBox
                  onPress={() => {
                    this.setState({ interest_gender: "male" });
                  }}
                  checked={this.state.interest_gender === "male"}
                  checkedIcon={<CheckableComponent checked label="MEN" />}
                  uncheckedIcon={<CheckableComponent label="MEN" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.setState({ interest_gender: "female" });
                  }}
                  checked={this.state.interest_gender === "female"}
                  checkedIcon={<CheckableComponent checked label="WOMEN" />}
                  uncheckedIcon={<CheckableComponent label="WOMEN" />}
                  containerStyle={styles.checkboxContainer}
                />
                <CheckBox
                  onPress={() => {
                    this.setState({ interest_gender: "both" });
                  }}
                  checked={this.state.interest_gender === "both"}
                  checkedIcon={<CheckableComponent checked label="BOTH" />}
                  uncheckedIcon={<CheckableComponent label="BOTH" />}
                  containerStyle={styles.checkboxContainer}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.optionDesc}>Income</Text>
                {/* <Text>${this.kFormatter(Number(this.state.income_from))}-${this.kFormatter(Number(this.state.income_to))}</Text> */}
                <Text>
                  ${this.kFormatter(Number(this.state.income_from))} P.A.
                </Text>
              </View>
              <MultiSlider
                onValuesChangeStart={this.disableScroll}
                onValuesChangeFinish={this.enableScroll}
                isMarkersSeparated={true}
                containerStyle={{ alignSelf: "center" }}
                sliderLength={width - 108}
                values={[Number(this.state.income_from)]}
                min={0}
                max={999000}
                onValuesChangeFinish={values => {
                  this.setState({ income_from: values[0] });
                }}
                onValuesChange={values => {
                  this.setState({ income_from: values[0] });
                }}
                customMarkerLeft={e => {
                  return <Image source={Images.Thumb} />;
                }}
                customMarkerRight={e => {
                  return <Image source={Images.Thumb} />;
                }}
              />
              <Text style={styles.optionDesc}>Religion</Text>
              <Dropdown
                label=""
                data={religionData}
                containerStyle={styles.dropdownContainer}
                labelHeight={8}
                value={this.state.religion}
                style={{ fontFamily: "ProximaNova-Bold" }}
                onChangeText={value => {
                  this.setState({ religion: value });
                }}
                rippleInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
                inputContainerStyle={styles.dropdownInput}
              />
              <Text style={styles.optionDesc}>Status</Text>
              <Dropdown
                label=""
                data={statusData}
                containerStyle={styles.dropdownContainer}
                labelHeight={8}
                value={this.state.status}
                style={{ fontFamily: "ProximaNova-Bold" }}
                onChangeText={value => {
                  this.setState({ status: value });
                }}
                rippleInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
                inputContainerStyle={styles.dropdownInput}
              />
              <Text style={styles.optionDesc}>Children</Text>
              <Dropdown
                label=""
                data={hasChildrenData}
                containerStyle={styles.dropdownContainer}
                labelHeight={8}
                value={this.state.has_children_str}
                valueExtractor={(item, index) => item.value}
                style={{ fontFamily: "ProximaNova-Bold" }}
                labelExtractor={(item, index) => item.label}
                onChangeText={value => {
                  this.setState({
                    has_children: value === "Have" ? true : false
                  });
                }}
                rippleInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
                inputContainerStyle={styles.dropdownInput}
              />
              <Text style={styles.optionDesc}>Drinker</Text>
              <Dropdown
                label=""
                data={drinkData}
                containerStyle={styles.dropdownContainer}
                labelHeight={8}
                value={this.state.drinking}
                style={{ fontFamily: "ProximaNova-Bold" }}
                onChangeText={value => {
                  this.setState({ drinking: value });
                }}
                rippleInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
                inputContainerStyle={styles.dropdownInput}
              />
              <Text style={styles.optionDesc}>Smoker</Text>
              <Dropdown
                label=""
                data={smokerData}
                containerStyle={styles.dropdownContainer}
                labelHeight={8}
                value={this.state.smoking}
                style={{ fontFamily: "ProximaNova-Bold" }}
                onChangeText={value => {
                  this.setState({ smoking: value });
                }}
                rippleInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
                inputContainerStyle={styles.dropdownInput}
              />
              <Text style={styles.optionDesc}>About Myself</Text>
              <TextInput
                style={[
                  styles.singleLineInput,
                  { height: 100, textAlignVertical: "top" }
                ]}
                multiline={true}
                placeholder="Write something unique about yourself"
                returnKeyType="done"
                blurOnSubmit={true}
                onBlur={() => {
                  this.handleKeyboardDidHide();
                }}
                onFocus={() => {
                  this.handleKeyboardDidShow();
                }}
                value={this.state.about_me}
                onChangeText={text => this.setState({ about_me: text })}
                numberOfLines={4}
              />
              <Button
                title="SAVE"
                titleStyle={{ fontWeight: "bold" }}
                ViewComponent={LinearGradient}
                linearGradientProps={{
                  colors: ["#4a46d6", "#964cc6"],
                  start: { x: 0, y: 0 },
                  end: { x: 0, y: 1 }
                }}
                buttonStyle={{ borderRadius: 30 }}
                containerStyle={{ marginVertical: 5 }}
                onPress={() => {
                  this.onSave();
                }}
              />

              <Overlay
                width="auto"
                height="auto"
                overlayStyle={{ padding: 30 }}
                isVisible={this.state.isLoading}
                onBackdropPress={() => this.setState({ isLoading: false })}
                borderRadius={15}
              >
                <Spinner type="Circle" color="#3cb9fc" />
              </Overlay>
            </Animated.View>
          </ScrollView>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
        </View>
      </View>
    );
  }
}

let styles = {
  optionDesc: {
    color: "#17144e",
    fontSize: 17,
    marginBottom: 10,
    marginTop: 10
  },
  singleLineInput: {
    ...ApplicationStyles.textInputStyle,
    height: 48,
    flex: 1
  },
  checkboxContainer: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    marginVertical: 0,
    marginHorizontal: 0
  },
  dropdownInput: {
    borderBottomWidth: 0,
    marginBottom: -10,
    paddingLeft: 10,
    marginRight: 3,
    backgroundColor: "white"
  },
  dropdownContainer: {
    height: 48,
    padding: 0,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e6e2e2"
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
    updateProfilePhotos: photo => dispatch(UserActions.fetchUserSuccess(photo)),
    updateDiscoverNumber: num =>
      dispatch(DatingActions.updateDiscoverNumber(num)),
    fetchDiscover: url => dispatch(DatingActions.fetchDiscovering(url)),
    updateTodayMatch: data => dispatch(UserActions.fetchIntroduction(data))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
