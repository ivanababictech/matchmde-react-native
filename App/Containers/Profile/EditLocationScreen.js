import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Alert
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import RNGooglePlaces from "react-native-google-places";
import { Header, Icon, Button } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { userService } from "App/Services/UserService";
import { connect } from "react-redux";
import UserActions from "App/Stores/User/Actions";
import { Images } from "App/Theme";
import DatingActions from "App/Stores/Dating/Actions";
import StartupActions from "App/Stores/Startup/Actions";
import AsyncStorage from "@react-native-community/async-storage";
import { getPlaceDetailWithCoordinates } from "App/Services/HelperServices";
import * as i18nIsoCountries from "i18n-iso-countries";
i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));
class EditLocationScreen extends Component {
  static navigationOption = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      latitude: Number(this.props.profile.latitude),
      longitude: Number(this.props.profile.longitude),
      locationName: this.props.profile.city,
      locationCountry: "",
      loading: false,
      settingState: 0
    };

    console.log(
      "latitude, longitude",
      this.state.latitude,
      this.state.longitude
    );
  }

  async componentDidMount() {
    const sState = await this.getLocationSettingState();
    this.setState({
      settingState: sState
    });
  }

  getLocationSettingState = async () => {
    try {
      let locationSettingState = await AsyncStorage.getItem(
        "locationSettingState"
      );
      if (locationSettingState !== null) {
        return Number(locationSettingState);
      }
      return 1;
    } catch (error) {
      return 1;
    }
  };

  setLocationSettingState = async sState => {
    this.setState({
      settingState: sState
    });
    await AsyncStorage.setItem("locationSettingState", "" + sState);
  };

  onRegionChange = coordinate => {
    console.log("Region Changed=", coordinate);
    const { longitude, latitude } = coordinate;
    console.log(coordinate);
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    };
    this.map.animateToRegion(newRegion, 1000);

    getPlaceDetailWithCoordinates(latitude, longitude, res => {
      const addressComponent = res.filter(
        v => v.address_components.length === 3
      );
      console.log("addressComponents", res);

      if (addressComponent.length >= 1) {
        const address = addressComponent[0].address_components;
        const city = address[0].long_name;
        const country = address[1].long_name;
        console.log("city and country", city, country);
        setTimeout(() => {
          this.setState({
            longitude,
            latitude,
            locationName: city,
            locationCountry: country
          });
        }, 1000);
      } else {
        alert("Please select correct place.");
      }
    });

    // getPlaceDetail(placeId, res => {
    // 	console.log("123123123123", res)
    // 	let coordinate = {
    // 		latitude: res.geometry.location.lat,
    // 		longitude: res.geometry.location.lng
    // 	};

    // 	this.setState({
    // 		latitude: Number(coordinate.latitude),
    // 		longitude: Number(coordinate.longitude),
    // 		locationName: res.name
    // 	})
    // })
  };

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        console.log(place);
        const { longitude, latitude } = place.location;
        // const { address } = place
        // console.log(address)
        // this.setState({ longitude, latitude, locationName: address })
        // console.log(this.state.locationName)
        // const newRegion = {
        // 	latitude, longitude,
        // 	latitudeDelta: 0.0922,
        // 	longitudeDelta: 0.0421,
        // }
        // this.map.animateToRegion(newRegion, 1000)
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
        this.onRegionChange({ longitude, latitude });
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  refreshSettingState = sState => {
    this.state.settingState = sState;
  };

  handleAutoDetect = () => {
    this.setLocationSettingState(1);
  };

  handleChangeLocation = () => {
    if (this.props.profile.is_subscribe) {
      if (this.state.settingState === 1) {
        this.setLocationSettingState(2);
      }

      this.setState({ loading: true });
      const body = {
        latitude: this.state.latitude,
        longitude: this.state.longitude
      };
      console.log("changed location ->", body);
      userService
        .put(
          this.props.startup.userToken.access_token,
          "/account/location",
          body
        )
        .then(res => {
          console.log("changed location from server ->", res.data);
          const { latitude, longitude } = res.data;
          const data = { latitude, longitude };
          this.setState({ loading: false });
          this.props.updateLocation(data);

          let profile = { ...this.props.profile };
          profile.city = this.state.locationName;
          profile.country = this.state.locationCountry;
          profile.latitude = latitude;
          profile.longitude = longitude;
          // profile.country = i18nIsoCountries.getAlpha2Code(this.state.locationCountry, "en")
          console.log("new country -> ", this.state.locationCountry);
          console.log("new profile -> ", profile.country, profile.city);
          this.props.updateProfile({ profile: profile });

          Alert.alert("Success", "Location changed!");

          this.props.updateDiscoverNumber(1);
          this.props.fetchDiscover(1);

          userService
            .post(
              this.props.userToken.access_token,
              "/account/profile",
              profile
            )
            .then(res => {
              console.log("profile from server", res);
            });
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false });
          alert("Changed location failed, try again.");
        });
    } else {
      alert("Should be premium account");
    }
  };

  render() {
    const { latitude, longitude } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          backgroundColor="transparent"
          leftComponent={this.renderHeaderLeft}
          rightComponent={this.renderRightComponent}
          centerComponent={this.renderTitle}
        />
        <View
          style={{
            flex: 1,
            margin: 10,
            borderRadius: Platform.OS === "ios" ? 20 : 0,
            borderWidth: 2,
            borderColor: "#3cb9fc"
          }}
        >
          <MapView
            ref={ref => (this.map = ref)}
            style={{ flex: 1, borderRadius: 20 }}
            onPress={event => this.onRegionChange(event.nativeEvent.coordinate)}
            region={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <Marker coordinate={{ latitude, longitude }} image={Images.Pin} />
          </MapView>

          <View
            style={{
              width: "100%",
              height: 56,
              position: "absolute",
              backgroundColor: "white",
              bottom: 0,
              borderBottomEndRadius: 20,
              borderBottomLeftRadius: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Icon
                name="location-arrow"
                type="font-awesome"
                color="black"
                containerStyle={{ marginRight: 8, marginTop: 1 }}
                size={19}
              />
              <Text style={{ color: "#554e4e", fontSize: 17 }}>
                {this.state.locationName}
              </Text>
            </View>
          </View>
        </View>

        <Button
          title="AUTO DETECT LOCATION"
          titleStyle={{ color: "#91919d", fontWeight: "bold" }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#ffffff", "#efefef"],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 }
          }}
          buttonStyle={
            this.state.settingState === 1
              ? { borderRadius: 30, borderWidth: 2, borderColor: "#66ff00" }
              : { borderRadius: 30 }
          }
          onPress={this.handleAutoDetect}
          containerStyle={{
            marginBottom: 10,
            width: "86%",
            alignSelf: "center",
            marginTop: 40
          }}
        />

        <Button
          title="SET THIS LOCATION"
          titleStyle={{ fontWeight: "bold" }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#4a46d6", "#964cc6"],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 }
          }}
          loading={this.state.loading}
          buttonStyle={
            this.state.settingState === 2
              ? { borderRadius: 30, borderWidth: 2, borderColor: "#66ff00" }
              : { borderRadius: 30 }
          }
          onPress={this.handleChangeLocation}
          containerStyle={{
            marginBottom: 12,
            width: "86%",
            alignSelf: "center"
          }}
        />
      </View>
    );
  }

  renderHeaderLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.goBack(null);
        }}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Icon name="ios-arrow-back" color="#17144e" type="ionicon" />
        <Text style={{ marginLeft: 10, color: "#17144e" }}>Back</Text>
      </TouchableOpacity>
    );
  };

  renderTitle = () => {
    return (
      <Text style={{ color: "#17144e", fontSize: 21, fontWeight: "bold" }}>
        Edit Location
      </Text>
    );
  };

  renderRightComponent = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            this.openSearchModal();
          }}
          style={{ marginRight: 10 }}
        >
          <Image source={Images.Search} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("EditLocationSetting", {
              onRefreshSetting: this.refreshSettingState
            });
          }}
        >
          <Image
            source={Images.ic_setting}
            style={{ tintColor: "rgb(127,74,202)", display: "none" }}
          />
        </TouchableOpacity>
      </View>
    );
  };
}

const mapStateToProps = state => {
  return {
    userToken: state.startup.userToken,
    profile: state.user.profile,
    startup: state.startup,
    dating: state.dating
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateLocation: data => dispatch(StartupActions.startSuccess(data)),
    updateProfile: data => dispatch(UserActions.fetchUserSuccess(data)),
    updateDiscoverNumber: num =>
      dispatch(DatingActions.updateDiscoverNumber(num)),
    fetchDiscover: url => dispatch(DatingActions.fetchDiscovering(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLocationScreen);
