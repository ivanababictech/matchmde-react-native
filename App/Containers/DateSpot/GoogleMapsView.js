import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Images } from 'App/Theme'
import {View, Text, Image, Keyboard, Platform,
  StatusBar,
  ScrollView,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  ToolbarAndroid,
  TouchableNativeFeedback,
} from 'react-native'

import ViewPagerAndroid from '@react-native-community/viewpager'

import Icon from 'react-native-vector-icons/Ionicons'
import IconMDI from 'react-native-vector-icons/MaterialIcons'
import { Header, Rating, Button } from 'react-native-elements'

import {
  CoordinatorLayout,
  BottomSheetHeader,
  MergedAppBarLayout,
  BackdropBottomSheet,
  BottomSheetBehavior,
  FloatingActionButton,
  ScrollingAppBarLayout,
} from 'react-native-bottom-sheet-behavior'

import MapView, { PROVIDER_GOOGLE, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { connect } from 'react-redux'

const { width, height } = Dimensions.get('window');

const anchorPoint = 280;
const RippleColor = (...args) => (
  Platform.Version >= 21
    ? TouchableNativeFeedback.Ripple(...args)
    : null
);

const WHITE = '#FFFFFF';
const PRIMARY_COLOR = '#4589f2';
const STATUS_BAR_COLOR = '#205cb2';
const STAR_COLOR = '#FF5722';

const { STATE_ANCHOR_POINT, STATE_COLLAPSED, STATE_EXPANDED } = BottomSheetBehavior;

const images = [
  require('./images/beer1.jpg'),
  require('./images/beer2.jpg'),
  require('./images/beer3.jpg'),
];

import { getPlaceDetail, getPlacePhotos } from "App/Services/HelperServices";

class GoogleMapsView extends Component {
  static contextTypes = {
    openDrawer: PropTypes.func,
  };

  state = {
    hidden: false,
    viewPagerSelected: 0,
    initialRegion:{
      latitude: Number(this.props.startup.latitude),
      longitude: Number(this.props.startup.longitude),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },
    isSheetView: false,
    placeId: "",
    photoArray: null,
    title: "",
    subtitle: "",
    phoneNumber: "",
    webLink: "",
    rating:0,
    markerIcon: "",
    locationUrl: "",

  };

  handleOpenDrawer = () => {
    Keyboard.dismiss();
    this.context.openDrawer()
  };

  handleFabPress = () => {
    ToastAndroid.show('Pressed', ToastAndroid.SHORT)
  };

  handleState = (state) => {
    this.bottomSheet.setBottomSheetState(state)
  };

  handleHeaderPress = () => {
    this.handleState(STATE_ANCHOR_POINT)
  };

  handleViewPager = (e) => {
    this.setState({ viewPagerSelected: e.nativeEvent.position })
  };

  renderDetailItem(icon, text) {
    return (
      <TouchableNativeFeedback delayPressIn={0} delayPressOut={0} background={RippleColor('#d1d1d1')}>
        <View>
          <View pointerEvents="none" style={styles.detailItem}>
            <Icon name={icon} size={22} color={PRIMARY_COLOR} />
            <Text pointerEvents="none" style={styles.detailText}>{text}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderBottomSheetContent() {
    return (
      <View style={styles.bottomSheetContent}>
        <View style={styles.detailListSection}>
          {/*this.renderDetailItem('md-map', 'Av. Lorem Ipsum dolor sit amet - consectetur adipising elit.')*/}
          {/*this.renderDetailItem('md-timer', 'Open now: 06:22:00')*/}
          {/*this.renderDetailItem('md-paper-plane', 'Place an order')*/}
          {this.renderDetailItem('md-call', this.state.phoneNumber)}
          {this.renderDetailItem('md-globe', this.state.webLink)}
        </View>
        <View style={styles.section}>
          <View style={styles.reviewStats}>
            <View style={styles.reviewAverage}>
              <Text style={styles.reviewAverageText}>{this.state.rating}</Text>
              <Rating type={"custom"} imageSize={35} readonly ratingColor='#F96D15'
                ratingBorderColor={"#F96D15"} startingValue={this.state.rating}/>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Button title='Select'
              onPress={() => {
                this.goDateList()
              }}
            />
        </View>
      </View>
    )
  }

  renderBackdropPager(source) {
    return (
      <View>
        <Image resizeMode="cover" style={{width, height: anchorPoint}} source={source} />
      </View>
    )
  }

  renderBackdrop() {
    const { viewPagerSelected } = this.state;
    return (
      <BackdropBottomSheet height={anchorPoint}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ViewPagerAndroid onPageSelected={this.handleViewPager} style={{flex: 1}}>
            {
              this.state.photoArray.map((v,i)=>{
                return this.renderBackdropPager({uri:v})
              })
            }
          </ViewPagerAndroid>
          <View style={styles.dots}>
            {
              this.state.photoArray.map((v,i)=>{
                return(
                  <View style={[styles.dot, viewPagerSelected === i && styles.dotActive]} />
                )
              })
            }
          </View>
        </View>
      </BackdropBottomSheet>
    )
  }

  renderMergedAppBarLayout() {
    return (
      <MergedAppBarLayout
        translucent
        mergedColor={PRIMARY_COLOR}
        toolbarColor={PRIMARY_COLOR}
        statusBarColor={STATUS_BAR_COLOR}
        style={styles.appBarMerged}>

      </MergedAppBarLayout>
    )
  }

  renderBottomSheet() {
    return (
      <BottomSheetBehavior
        // anchorEnabled
        anchorPoint={anchorPoint}
        peekHeight={80}
        elevation={8}
        ref={(bottomSheet) => { this.bottomSheet = bottomSheet }}
        onSlide={this.handleSlide}
        onStateChange={this.handleBottomSheetChange}>
        <View style={styles.bottomSheet}>
          <BottomSheetHeader
            onPress={this.handleHeaderPress}
            textColorExpanded={WHITE}
            backgroundColor={WHITE}
            backgroundColorExpanded={PRIMARY_COLOR}>
            <View pointerEvents='none' style={styles.bottomSheetHeader}>
              <View style={styles.bottomSheetLeft}>
                <Text selectionColor={'#000'} style={styles.bottomSheetTitle}>
                  { this.state.title }
                </Text>
                <View style={styles.starsContainer}>
                  <Text style={{marginRight: 8}} selectionColor={STAR_COLOR}>{ this.state.subtitle }</Text>
                </View>
              </View>
            </View>
          </BottomSheetHeader>
          {this.renderBottomSheetContent()}
        </View>
      </BottomSheetBehavior>
    )
  }

  renderMaps() {
    return (
      <MapView style={styles.containerMap}
        initialRegion={this.state.initialRegion}
        provider={PROVIDER_GOOGLE}
        onPoiClick={({ nativeEvent }) => this.getPlaceDetail(nativeEvent.placeId)}>
        {
          this.state.isSetLocation ? ( <Marker coordinate={this.state.coordinate}/>) : null
        }
      </MapView>
    )
  }

  renderToolbar() {
    return (
      <ScrollingAppBarLayout
        translucent
        style={styles.scrollAppBar}
        statusBarColor={STATUS_BAR_COLOR}>
      </ScrollingAppBarLayout>
    )
  }

  render() {
    return (
      <CoordinatorLayout style={styles.container}>
        <StatusBar translucent barStyle='dark-content' backgroundColor={STATUS_BAR_COLOR} />
        {this.renderToolbar()}
        <View style={styles.content}>
          {this.renderMaps()}
        </View>
        {(this.state.isSheetView && this.state.photoArray)?this.renderBackdrop():null}
        {(this.state.isSheetView && this.state.photoArray)?this.renderBottomSheet():null}
        {(this.state.isSheetView && this.state.photoArray)?this.renderMergedAppBarLayout():null}
      </CoordinatorLayout>
    )
  }

  getPlaceDetail = placeId => {
    getPlaceDetail(placeId, res => {
      let coordinate = {
        latitude: res.geometry.location.lat,
        longitude: res.geometry.location.lng
      };

      if(this.props.placeID) {
        this.setState({
          initialRegion: {
            latitude: Number(coordinate.latitude),
            longitude: Number(coordinate.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          },
        })
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
      this.setState({ photoArray: null, activeSlide: 0});
      for (let i = 0; i < res.photos.length; i++) {
        getPlacePhotos(res.photos[i].photo_reference, res => {
            temp_photoArray.push(res);
        });
      }
      this.setState({
        photoArray: temp_photoArray,
        isSheetView: true,
        viewPagerSelected: 0
      });
      // this.bottomSheet.show()
      this.bottomSheet.setBottomSheetState(STATE_EXPANDED)
    });
  };

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  content: {
    backgroundColor: 'transparent',
  },
  scrollAppBar: {
    zIndex: 1,
  },
  appBarMerged: {
    backgroundColor: 'transparent',
  },
  containerMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height,
    width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomSheet: {
    // height,
    zIndex: 5,
    backgroundColor: 'white'
  },
  bottomSheetHeader: {
    padding: 16,
    paddingLeft: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Don't forget this if you are using BottomSheetHeader
    backgroundColor: 'transparent'
  },
  bottomSheetLeft: {
    flexDirection: 'column'
  },
  bottomSheetTitle: {
    fontFamily: "ProximaNova-Bold",
    fontSize: 18,
  },
  dots: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 4,
    opacity: 0.8,
    backgroundColor: WHITE,
    borderRadius: 50,
  },
  dotActive: {
    width: 10,
    height: 10,
    opacity: 1,
    backgroundColor: '#3cb9fc',
  },
  bottomSheetContent: {
    //flex: 1,
    backgroundColor: WHITE,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailListSection: {
    paddingVertical: 8,
  },
  detailItem: {
    height: 42,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 26,
  },
  detailText: {
    color: '#333',
    fontSize: 14,
    marginLeft: 24,
    lineHeight: 22,
  },
  section: {
    padding: 22,
    borderColor: '#eee',
    borderTopWidth: 1,
  },
  reviewStats: {
    marginTop: 20,
    flexDirection: 'row',
  },
  reviewAverage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAverageText: {
    fontSize: 42,
    textAlign: 'center',
    color: STAR_COLOR,
    fontWeight: '200',
  },
});

const mapStateToPros = state =>{
  return{
    profile:state.user.profile,
    startup:state.startup
  }
};
export default connect(mapStateToPros)(GoogleMapsView)
