import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  TextInput
} from "react-native";
import {
  Header,
  Icon,
  Button,
  Divider,
  Badge,
  CheckBox
} from "react-native-elements";
import MultiSlider from "react-native-easy-slider";
import { Dropdown } from "react-native-material-dropdown";
import LinearGradient from "react-native-linear-gradient";
import Toast from "react-native-root-toast";

import { Images } from "App/Theme";
import CheckableComponent from "App/Components/Common/CheckableComponent";
import { userService } from "App/Services/UserService";

import UserActions from "App/Stores/User/Actions";
import DatingActions from "App/Stores/Dating/Actions";

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

const width = Dimensions.get("window").width;
const sliderLength = width - 50;
import { connect } from "react-redux";

const initStateData = {
  scrollEnabled: true,

  search: "all",
  distance: "80",

  interest_gender: "both",
  from_age: 18,
  to_age: 80,
  education: "",
  hobby: "",
  drinking: "",
  smoking: "",

  body_type: "",
  nationality: "",
  job: "",
  from_income: 0,
  to_income: 999000,
  religion: "",
  status: "",
  has_children: false,
  city: "",

  premiumFilterShowing: false,
  loading: false
};

class FilterScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,

      search: "all",
      distance: "80",

      interest_gender: "both",
      from_age: 18,
      to_age: 80,
      education: "",
      hobby: "",
      drinking: "",
      smoking: "",

      body_type: "",
      nationality: "",
      job: "",
      from_income: 0,
      to_income: 999000,
      religion: "",
      status: "",
      has_children: false,
      city: "",

      premiumFilterShowing: false,
      loading: false
    };
    this.toast = null;
  }

  componentDidMount() {
    console.log("filter data -> ", this.props.filter);

    if (this.props.filter.interest_gender != null) {
      let {
        search,
        distance,
        interest_gender,
        from_age,
        to_age,
        education,
        hobby,
        drinking,
        smoking,
        body_type,
        nationality,
        job,
        from_income,
        to_income,
        religion,
        status,
        has_children,
        city
      } = this.props.filter;

      if (body_type === null) body_type = "";
      if (city === null) city = "";
      if (drinking === null) drinking = "";
      if (education === null) education = "";
      if (religion === null) religion = "";
      if (smoking === null) smoking = "";
      if (status === null) status = "";
      if (hobby === null) hobby = "";

      this.setState({
        search,
        distance,
        interest_gender,
        from_age,
        to_age,
        education,
        hobby,
        drinking,
        smoking,
        body_type,
        nationality,
        job,
        from_income,
        to_income,
        religion,
        status,
        has_children,
        city
      });
    }
  }

  onUpdateFilter = () => {
    this.setState({ loading: true });
    userService
      .post(this.props.userToken.access_token, "/filter", this.state)
      .then(res => {
        this.showToast("Filter Updated");
        this.setState({ loading: false });
        this.updateUserFilter(res.data);
        this.props.fetchDiscover(1);
        this.props.updateDiscoverNumber(1);
      })
      .catch(err => {
        console.log("filter err -> ", err);
        this.setState({ loading: false });
        this.showToast("Something went wrong. Filter Update failed");
      });
  };

  updateUserFilter(updatedFilter) {
    this.props.updateProfileFilter({ filters: updatedFilter });
  }

  onDeleteFilter() {
    this.setState({ ...initStateData });
    userService
      .delete_request(this.props.userToken.access_token, "/filter")
      .then(res => {
        this.props.updateProfileFilter({ filters: {} });
        this.props.fetchDiscover(1);
        this.props.updateDiscoverNumber(1);
      });
  }

  kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
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

  showToast(msg) {
    this.toast = Toast.show(msg, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {},
      onShown: () => {},
      onHide: () => {},
      onHidden: () => {}
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={this.render_left}
          rightComponent={this.render_right}
          centerComponent={this.render_headerCenter}
          backgroundColor="transparent"
        />
        <ScrollView scrollEnabled={this.state.scrollEnabled}>
          <View style={{ marginLeft: 25 }}>
            <Text
              style={{ marginVertical: 15, color: "#17144e", fontSize: 17 }}
            >
              Find Members
            </Text>
            <View style={{ flexDirection: "row" }}>
              <CheckBox
                onPress={() => {
                  this.setState({ search: "all" });
                }}
                checked={this.state.search === "all"}
                checkedIcon={<CheckableComponent checked label="ALL" />}
                uncheckedIcon={<CheckableComponent label="ALL" />}
                containerStyle={styles.checkboxContainer}
              />
              <CheckBox
                onPress={() => {
                  this.setState({ search: "online" });
                }}
                checked={this.state.search == "online"}
                checkedIcon={<CheckableComponent checked label="ONLINE" />}
                uncheckedIcon={<CheckableComponent label="ONLINE" />}
                containerStyle={styles.checkboxContainer}
              />
              <CheckBox
                onPress={() => {
                  this.setState({ search: "new" });
                }}
                checked={this.state.search == "new"}
                checkedIcon={<CheckableComponent checked label="NEW" />}
                uncheckedIcon={<CheckableComponent label="NEW" />}
                containerStyle={styles.checkboxContainer}
              />
            </View>
          </View>
          <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 15
              }}
            >
              <Text style={{ fontSize: 17, color: "#17144e" }}>Distance</Text>
              <Text
                style={{ fontSize: 17, color: "#17144e", fontWeight: "bold" }}
              >
                {this.state.distance}km
              </Text>
            </View>
            <MultiSlider
              sliderLength={sliderLength}
              isMarkersSeparated={true}
              containerStyle={{
                height: 40,
                width: "100%",
                margin: 0,
                padding: 0
              }}
              min={0}
              max={300}
              values={[Number(this.state.distance)]}
              onValuesChangeFinish={values => {
                this.setState({ distance: values[0] });
              }}
              onValuesChange={values => {
                this.setState({ distance: values[0] });
              }}
              customMarkerLeft={e => {
                return <Image source={Images.Thumb} />;
              }}
              customMarkerRight={e => {
                return <Image source={Images.Thumb} />;
              }}
            />
          </View>
          <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 15
              }}
            >
              <Text style={{ fontSize: 17, color: "#17144e" }}>Age</Text>
              <Text
                style={{ fontSize: 17, color: "#17144e", fontWeight: "bold" }}
              >
                {this.state.from_age} - {this.state.to_age}
              </Text>
            </View>
            <MultiSlider
              sliderLength={sliderLength}
              isMarkersSeparated={true}
              containerStyle={{
                height: 40,
                width: "100%",
                margin: 0,
                padding: 0
              }}
              min={18}
              max={80}
              values={[Number(this.state.from_age), Number(this.state.to_age)]}
              onValuesChangeFinish={values => {
                this.setState({
                  from_age: Number(values[0]),
                  to_age: Number(values[1])
                });
              }}
              onValuesChange={values => {
                this.setState({ from_age: values[0], to_age: values[1] });
              }}
              customMarkerLeft={e => {
                return <Image source={Images.Thumb} />;
              }}
              customMarkerRight={e => {
                return <Image source={Images.Thumb} />;
              }}
            />
          </View>
          {/* <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
						<Text style={{ fontSize: 17, color: '#17144e', marginVertical: 15 }}>I am interested in</Text>
						<View style={{ flexDirection: 'row' }}>
							<CheckBox onPress={() => { this.setState({ interest_gender: 'male' }) }}
								checked={this.state.interest_gender == 'male'}
								checkedIcon={<CheckableComponent checked label='MEN' />}
								uncheckedIcon={<CheckableComponent label='MEN' />}
								containerStyle={styles.checkboxContainer} />
							<CheckBox onPress={() => { this.setState({ interest_gender: 'female' }) }}
								checked={this.state.interest_gender == 'female'}
								checkedIcon={<CheckableComponent checked label='WOMEN' />}
								uncheckedIcon={<CheckableComponent label='WOMEN' />}
								containerStyle={styles.checkboxContainer} />
							<CheckBox onPress={() => { this.setState({ interest_gender: 'both' }) }}
								checked={this.state.interest_gender == 'both'}
								checkedIcon={<CheckableComponent checked label='BOTH' />}
								uncheckedIcon={<CheckableComponent label='BOTH' />}
								containerStyle={styles.checkboxContainer} />
						</View>
					</View> */}
          <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
            <Text
              style={{ fontSize: 17, color: "#17144e", marginVertical: 15 }}
            >
              Education
            </Text>
            <Dropdown
              label=""
              data={educationData}
              onChangeText={(value, index, data) => {
                this.setState({ education: value });
              }}
              labelHeight={8}
              value={this.state.education}
              style={{ fontFamily: "ProximaNova-Bold" }}
              containerStyle={{
                height: 48,
                padding: 0,
                marginRight: 10,
                borderWidth: 1,
                borderColor: "#e6e2e2"
              }}
              rippleInsets={{ bottom: -10, top: -10, left: 0, right: 0 }}
              inputContainerStyle={{
                borderBottomWidth: 0,
                marginBottom: -10,
                paddingLeft: 10
              }}
            />
          </View>
          <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
            <Text
              style={{ fontSize: 17, color: "#17144e", marginVertical: 15 }}
            >
              Interests
            </Text>
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
                checkedIcon={<CheckableComponent checked label="PHOTOGRAPHY" />}
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
          </View>
          <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
            <Text
              style={{ fontSize: 17, color: "#17144e", marginVertical: 15 }}
            >
              Drinker
            </Text>
            <Dropdown
              label=""
              data={drinkData}
              onChangeText={(value, index, data) => {
                this.setState({ drinking: value });
              }}
              labelHeight={8}
              value={this.state.drinking}
              containerStyle={{
                height: 48,
                padding: 0,
                marginRight: 10,
                borderWidth: 1,
                borderColor: "#e6e2e2"
              }}
              rippleInsets={{ bottom: -10, top: -10, left: 0, right: 0 }}
              style={{ fontFamily: "ProximaNova-Bold" }}
              inputContainerStyle={{
                borderBottomWidth: 0,
                marginBottom: -10,
                paddingLeft: 10
              }}
            />
          </View>
          <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
            <Text
              style={{ fontSize: 17, color: "#17144e", marginVertical: 15 }}
            >
              Smoker
            </Text>
            <Dropdown
              label=""
              data={smokerData}
              onChangeText={(value, index, data) => {
                this.setState({ smoking: value });
              }}
              labelHeight={8}
              value={this.state.smoking}
              containerStyle={{
                height: 48,
                padding: 0,
                marginRight: 10,
                borderWidth: 1,
                borderColor: "#e6e2e2"
              }}
              rippleInsets={{ bottom: -10, top: -10, left: 0, right: 0 }}
              style={{ fontFamily: "ProximaNova-Bold" }}
              inputContainerStyle={{
                borderBottomWidth: 0,
                marginBottom: -10,
                paddingLeft: 10
              }}
            />
          </View>
          {this.renderPremiumFilters()}
          <Button
            title="APPLY"
            ViewComponent={LinearGradient}
            titleStyle={{ fontWeight: "bold" }}
            linearGradientProps={{
              colors: ["#4a46d6", "#964cc6"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            buttonStyle={{ borderRadius: 30 }}
            loading={this.state.loading}
            onPress={this.onUpdateFilter}
            containerStyle={{
              marginBottom: 5,
              marginTop: 10,
              alignSelf: "center",
              width: 320
            }}
          />
        </ScrollView>
      </View>
    );
  }

  renderPremiumFilters() {
    if (this.props.profile.subscribe_end_date) {
      return (
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center"
            }}
            onPress={() => {
              this.setState({
                premiumFilterShowing: !this.state.premiumFilterShowing
              });
            }}
          >
            <Text style={{ color: "#b537f2", marginTop: 3, marginRight: 10 }}>
              Premium Filter
            </Text>
            <Icon name="caretdown" type="antdesign" color="#b537f2" size={20} />
          </TouchableOpacity>
          {this.state.premiumFilterShowing ? (
            <View>
              <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
                <Text
                  style={{ fontSize: 17, color: "#17144e", marginVertical: 15 }}
                >
                  Body Type
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <CheckBox
                    onPress={() => {
                      this.setState({ body_type: "Thin" });
                    }}
                    checked={this.state.body_type == "Thin"}
                    checkedIcon={<CheckableComponent checked label="THIN" />}
                    uncheckedIcon={<CheckableComponent label="THIN" />}
                    containerStyle={styles.checkboxContainer}
                  />
                  <CheckBox
                    onPress={() => {
                      this.setState({ body_type: "Athletic" });
                    }}
                    checked={this.state.body_type == "Athletic"}
                    checkedIcon={
                      <CheckableComponent checked label="ATHLETIC" />
                    }
                    uncheckedIcon={<CheckableComponent label="ATHLETIC" />}
                    containerStyle={styles.checkboxContainer}
                  />
                  <CheckBox
                    onPress={() => {
                      this.setState({ body_type: "Average" });
                    }}
                    checked={this.state.body_type == "Average"}
                    checkedIcon={<CheckableComponent checked label="AVERAGE" />}
                    uncheckedIcon={<CheckableComponent label="AVERAGE" />}
                    containerStyle={styles.checkboxContainer}
                  />
                </View>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                  <CheckBox
                    onPress={() => {
                      this.setState({ body_type: "Curvy" });
                    }}
                    checked={this.state.body_type == "Curvy"}
                    checkedIcon={<CheckableComponent checked label="CURVY" />}
                    uncheckedIcon={<CheckableComponent label="CURVY" />}
                    containerStyle={styles.checkboxContainer}
                  />
                  <CheckBox
                    onPress={() => {
                      this.setState({ body_type: "Big/Tall" });
                    }}
                    checked={this.state.body_type == "Big/Tall"}
                    checkedIcon={
                      <CheckableComponent checked label="BIG/TALL" />
                    }
                    uncheckedIcon={<CheckableComponent label="BIG/TALL" />}
                    containerStyle={styles.checkboxContainer}
                  />
                </View>
              </View>
              <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
                <Text
                  style={{ fontSize: 17, color: "#17144e", marginVertical: 15 }}
                >
                  Job Title
                </Text>
                <TextInput
                  returnKeyType="done"
                  style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    paddingLeft: 8
                  }}
                  onChangeText={name => this.setState({ job: name })}
                  value={this.state.job}
                />
              </View>
              <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 15
                  }}
                >
                  <Text style={{ fontSize: 17, color: "#17144e" }}>Income</Text>
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#17144e",
                      fontWeight: "bold"
                    }}
                  >
                    ${this.kFormatter(Number(this.state.from_income))} - $
                    {this.kFormatter(Number(this.state.to_income))} P.A.
                  </Text>
                </View>
                <MultiSlider
                  sliderLength={sliderLength}
                  isMarkersSeparated={true}
                  containerStyle={{
                    height: 40,
                    width: "100%",
                    margin: 0,
                    padding: 0
                  }}
                  min={0}
                  max={999000}
                  values={[
                    Number(this.state.from_income),
                    Number(this.state.to_income)
                  ]}
                  onValuesChangeFinish={values => {
                    this.setState({
                      from_income: values[0],
                      to_income: values[1]
                    });
                  }}
                  onValuesChange={values => {
                    this.setState({
                      from_income: values[0],
                      to_income: values[1]
                    });
                  }}
                  customMarkerLeft={e => {
                    return <Image source={Images.Thumb} />;
                  }}
                  customMarkerRight={e => {
                    return <Image source={Images.Thumb} />;
                  }}
                />
              </View>
              <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
                <Text
                  style={{ fontSize: 17, color: "#17144e", marginVertical: 15 }}
                >
                  Religion
                </Text>
                <Dropdown
                  label=""
                  data={religionData}
                  onChangeText={(value, index, data) => {
                    this.setState({ religion: value });
                  }}
                  labelHeight={8}
                  value={this.state.religion}
                  containerStyle={{
                    height: 48,
                    padding: 0,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: "#e6e2e2"
                  }}
                  rippleInsets={{ bottom: -10, top: -10, left: 0, right: 0 }}
                  style={{ fontFamily: "ProximaNova-Bold" }}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    marginBottom: -10,
                    paddingLeft: 10
                  }}
                />
              </View>
              <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
                <Text
                  style={{ fontSize: 17, color: "#17144e", marginVertical: 15 }}
                >
                  Status
                </Text>
                <Dropdown
                  label=""
                  data={statusData}
                  onChangeText={(value, index, data) => {
                    this.setState({ status: value });
                  }}
                  labelHeight={8}
                  value={this.state.status}
                  containerStyle={{
                    height: 48,
                    padding: 0,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: "#e6e2e2"
                  }}
                  rippleInsets={{ bottom: -10, top: -10, left: 0, right: 0 }}
                  style={{ fontFamily: "ProximaNova-Bold" }}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    marginBottom: -10,
                    paddingLeft: 10
                  }}
                />
              </View>
              <View style={{ marginLeft: 25, marginTop: 10, marginRight: 25 }}>
                <Text
                  style={{ fontSize: 17, color: "#17144e", marginVertical: 15 }}
                >
                  Children
                </Text>
                <Dropdown
                  label=""
                  data={hasChildrenData}
                  onChangeText={(value, index, data) => {
                    this.setState({
                      has_children: value == "Have" ? true : false
                    });
                  }}
                  labelHeight={8}
                  value={this.state.has_children ? "Have" : "Don't have"}
                  containerStyle={{
                    height: 48,
                    padding: 0,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: "#e6e2e2"
                  }}
                  rippleInsets={{ bottom: -10, top: -10, left: 0, right: 0 }}
                  style={{ fontFamily: "ProximaNova-Bold" }}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    marginBottom: -10,
                    paddingLeft: 10
                  }}
                />
              </View>
            </View>
          ) : null}
        </View>
      );
    } else {
      return (
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center"
            }}
            onPress={() => {}}
          >
            <Text style={{ color: "gray", marginTop: 3, marginRight: 10 }}>
              Premium Filter
            </Text>
            <Icon name="caretdown" type="antdesign" color="gray" size={20} />
          </TouchableOpacity>
        </View>
      );
    }
  }

  render_left = () => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.goBack();
      }}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <Icon name="ios-arrow-back" type="ionicon" color="#17144e" size={21} />
      <Text style={{ marginLeft: 10, color: "#17144e" }}>Back</Text>
    </TouchableOpacity>
  );

  render_right = () => (
    <TouchableOpacity onPress={() => this.onDeleteFilter()}>
      <Text style={{ fontSize: 17 }}>Reset</Text>
    </TouchableOpacity>
  );

  render_headerCenter = () => (
    <Text style={{ color: "#17144e", fontWeight: "bold", fontSize: 21 }}>
      Filter
    </Text>
  );
}

let styles = {
  checkboxContainer: {
    padding: 0,
    marginVertical: 5,
    marginLeft: 0,
    marginRight: 10
  }
};

const mapStateToProps = state => {
  return {
    filter: state.user.filters,
    profile: state.user.profile,
    userToken: state.startup.userToken,
    dating: state.dating
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateProfileFilter: data => dispatch(UserActions.fetchUserSuccess(data)),
    fetchDiscover: url => dispatch(DatingActions.fetchDiscovering(url)),
    updateDiscoverNumber: num =>
      dispatch(DatingActions.updateDiscoverNumber(num))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FilterScreen);
