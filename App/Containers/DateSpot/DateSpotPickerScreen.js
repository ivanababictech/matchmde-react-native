import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Switch,
  Dimensions,
  TextInput,
  Image,
  Modal,
  DatePickerIOS
} from "react-native";

import { WebView } from "react-native-webview";

import { Header, Rating, Icon, Button, Divider } from "react-native-elements";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  PROVIDER_DEFAULT
} from "react-native-maps";
import Pulse from "react-native-pulse";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { withNavigation } from "react-navigation";
import RNGooglePlaces from "react-native-google-places";

import { isIphoneX } from "react-native-iphone-x-helper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import BottomSheet from "reanimated-bottom-sheet";
import moment from "moment";

import { connect } from "react-redux";

import { Images } from "App/Theme";
import { getPlaceDetail, getPlacePhotos } from "App/Services/HelperServices";
import LinearGradient from "react-native-linear-gradient";
import { black } from "ansi-colors";

class DateSpotPickerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      loaded: false,
      coordinate: {
        latitude: 37.78825,
        longitude: -122.4324
      },
      MyCoordinate: {
        latitude: Number(this.props.startup.latitude),
        longitude: Number(this.props.startup.longitude)
      },
      initialRegion: {
        latitude: Number(this.props.startup.latitude),
        longitude: Number(this.props.startup.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },

      isSheetView: false,
      isSetLocation: false,
      isLoading: false,
      isWebView: false,
      activeSlide: 0,
      modalVisible: false,
      date: new Date(),
      time: "",

      reserveDate: "",
      reserveTime: "",

      placeId: "",
      photoArray: null,
      title: "",
      subtitle: "",
      phoneNumber: "",
      webLink: "",
      rating: 0,
      markerIcon: "",
      locationUrl: ""
    };
  }

  goDateList = () => {
    this.props.navigation.navigate("DateList", {
      placeId: this.state.placeId,
      placeName: this.state.title,
      placeAddress: this.state.subtitle,
      placeUrl: this.state.locationUrl,
      placeIcon: this.state.markerIcon,
      placePhotos: this.state.photoArray,
      phoneNumber: this.state.phoneNumber,
      coordinate: this.state.coordinate
    });
  };

  getPlaceDetail = placeId => {
    getPlaceDetail(placeId, res => {
      let coordinate = {
        latitude: res.geometry.location.lat,
        longitude: res.geometry.location.lng
      };

      if (this.props.placeID) {
        this.setState({
          initialRegion: {
            latitude: Number(coordinate.latitude),
            longitude: Number(coordinate.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }
        });
      }

      this.setState({
        placeId: res.place_id,
        title: res.name,
        subtitle: res.formatted_address,
        phoneNumber: res.international_phone_number,
        webLink: res.website,
        rating: res.rating,
        markerIcon: res.icon,
        locationUrl: res.url,
        coordinate: coordinate,
        isSetLocation: true
      });
      let temp_photoArray = [];
      this.setState({
        photoArray: null,
        activeSlide: 0
      });
      const limitPhoto = 1;
      if (res.photos.length < 2) {
        limitPhoto = res.photos.length;
      }
      for (let i = 0; i < limitPhoto; i++) {
        getPlacePhotos(res.photos[i].photo_reference, res => {
          temp_photoArray.push(res);
        });
      }

      console.log("photo array=", temp_photoArray);
      this.setState({
        photoArray: temp_photoArray,
        isSheetView: true
      });
    });
  };

  get pagination() {
    const { photoArray, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={photoArray.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)"
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  renderInner = () => (
    <View style={styles.sheetContainer}>
      <ScrollView style={styles.sheetContent}>
        <View>
          <Carousel
            data={this.state.photoArray}
            renderItem={(item, index) => (
              <Image
                key={index}
                style={styles.sheetImage}
                source={{ uri: item.item }}
              />
            )}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={Dimensions.get("window").width - 60}
            layout={"default"}
            hasParallaxImages={true}
            onSnapToItem={index => this.setState({ activeSlide: index })}
          />
        </View>
        {/* {this.pagination} */}
        <View style={styles.sheetContentItem}>
          <Icon type="material" name="bookmark" size={25} color="#000" />
          <Text style={styles.sheetContentItemText}>{this.state.title}</Text>
        </View>
        <View style={styles.sheetContentItem}>
          <Icon type="material" name="location-on" size={25} color="#000" />
          <Text style={styles.sheetContentItemText}>{this.state.subtitle}</Text>
        </View>
        {this.state.phoneNumber ? (
          <View style={styles.sheetContentItem}>
            <Icon type="material" name="call" size={25} color="#000" />
            <Text style={styles.sheetContentItemText}>
              {this.state.phoneNumber}
            </Text>
          </View>
        ) : null}

        <View style={styles.sheetRatingContainer}>
          <Text style={styles.ratingTitle}>{this.state.rating}</Text>
          <Rating
            type={"custom"}
            imageSize={35}
            readonly
            ratingColor="#F96D15"
            ratingBorderColor={"#F96D15"}
            startingValue={this.state.rating}
          />
        </View>
      </ScrollView>
    </View>
  );

  renderHeader = () => (
    <View style={styles.sheetHeaderContainer}>
      <Divider
        style={{
          marginTop: 10,
          marginLeft: 120,
          marginRight: 120,
          color: black,
          height: 3
        }}
      />

      <View style={styles.sheetHeaderContent}>
        <View style={[styles.sheetRatingContainer, { marginBottom: 0 }]}>
          <Button
            title="Select"
            titleStyle={{ color: "#fff", fontWeight: "bold" }}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#4a46d6", "#964cc6"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            buttonStyle={{ borderRadius: 30, width: "100%" }}
            onPress={() => {
              this.goDateList();
              this.bottomSheet.current.snapTo(2);
            }}
            containerStyle={{ marginBottom: 0, marginBottom: 0 }}
          />
        </View>
      </View>
    </View>
  );

  bottomSheet = React.createRef();

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        console.log("selected location=", place);
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
        this.getPlaceDetail(place.placeID);
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  onRegionChange = coordinate => {
    const { longitude, latitude } = coordinate;
    console.log(coordinate);
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    };
    this.map.animateToRegion(newRegion, 1000);
  };

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
      <Text
        style={{
          fontSize: 21,
          color: "#17144e",
          fontFamily: "ProximaNova-Bold"
        }}
      >
        Pick a Date Spot
      </Text>
    );
  };

  renderRightComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.openSearchModal();
        }}
        style={{ marginRight: 0 }}
      >
        <Image source={Images.Search} />
      </TouchableOpacity>
    );
  };

  render() {
    console.log("Location Url=", this.state.locationUrl);
    return (
      <View style={styles.rootContainer}>
        <Header
          leftComponent={this.renderHeaderLeft}
          rightComponent={this.renderRightComponent}
          backgroundColor="transparent"
          centerComponent={this.renderHeaderCenter}
        />
        {this.state.isWebView ? (
          <WebView
            source={{ uri: this.state.locationUrl }}
            style={{ width: Dimensions.get("window").width }}
          />
        ) : (
          <View>
            <MapView
              style={styles.mapView}
              ref={ref => (this.map = ref)}
              initialRegion={this.state.initialRegion}
              provider={PROVIDER_GOOGLE}
              onPoiClick={({ nativeEvent }) =>
                this.getPlaceDetail(nativeEvent.placeId)
              }
            >
              <Marker coordinate={this.state.MyCoordinate}>
                <View style={styles.preMarker}>
                  <View style={styles.meMarker} />
                </View>
              </Marker>
              {this.state.isSetLocation ? (
                <Marker coordinate={this.state.coordinate} />
              ) : null}
            </MapView>
            {this.state.isSheetView && this.state.photoArray ? (
              <BottomSheet
                ref={this.bottomSheet}
                snapPoints={["80%", 380, isIphoneX ? 110 : 50]}
                renderContent={this.renderInner}
                renderHeader={this.renderHeader}
                initialSnap={0}
              />
            ) : null}
          </View>
        )}

        {/* <View style={{width: '100%', position: 'absolute', marginTop: 10 }}>
					<TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 10}}>
						<Icon name='ios-arrow-back' type='ionicon' color='#17144e' size={21} />
						<Text style={{ marginLeft: 10, color: '#17144e', marginBottom: 2 }}>Back</Text>
					</TouchableOpacity>
				</View> */}
      </View>
    );
  }
}

const mapStateToPros = state => {
  return {
    profile: state.user.profile,
    startup: state.startup
  };
};
export default withNavigation(connect(mapStateToPros)(DateSpotPickerScreen));

let styles = {
  rootContainer: {
    flex: 1,
    alignItems: "center"
  },
  mapView: {
    width: Dimensions.get("window").width,
    height: "100%",
    justifyContent: "flex-end"
  },
  meMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: "#FFFDDA",
    borderWidth: 3,
    backgroundColor: "#0AD2CD"
  },
  preMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  sheetContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#FFF"
  },
  sheetContent: {
    marginTop: isIphoneX ? 0 : 30,
    width: "100%",
    height: 200
  },
  sheetImage: {
    width: "100%",
    height: 200,
    backgroundColor: "grey",
    borderRadius: 10
  },
  sheetContentItem: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 30,
    alignItems: "center",
    marginVertical: 5
  },
  sheetContentItemIcon: {
    width: 20,
    height: 20
  },
  sheetContentItemText: {
    color: "#000",
    fontSize: 14,
    marginHorizontal: 10
  },
  sheetRatingContainer: {
    width: "100%",
    marginVertical: 10,
    alignItems: "center"
  },
  ratingTitle: {
    color: "#F96D15",
    fontSize: 72
  },
  sheetHeaderContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -10
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.84,
    elevation: 5
  },
  sheetHeaderContent: {
    height: 50,
    marginBottom: isIphoneX ? 30 : 0,
    marginTop: isIphoneX ? 30 : 0,
    justifyContent: "center"
  },
  sheetHeaderTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginHorizontal: 30
  },
  sheetHeaderSubtitle: {
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
    marginHorizontal: 30
  }
};
