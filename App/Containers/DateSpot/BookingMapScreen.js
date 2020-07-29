import React, { Component } from "react";
import { View, TouchableOpacity, Text, ScrollView, Switch, Dimensions, TextInput, FlatList, Modal, Image, WebView, ActivityIndicator} from "react-native";
import { Header, ListItem, Avatar, Icon, Button} from 'react-native-elements';
import LinearGradient from "react-native-linear-gradient";

import { isIphoneX } from 'react-native-iphone-x-helper'
import { connect } from "react-redux";

class BookingMapScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.rootContainer}>
        <Header leftComponent={this.header_left} rightComponent={this.header_right} backgroundColor="transparent"/>
        <LinearGradient
          style={styles.rootContainer}
          colors={["#0AD2CD", "#2DFEF8"]}
          locations={[0.3, 1]}
          start={{ x: 0, y: 1.0 }}
          end={{ x: 1.0, y: 0.8 }}
        >
          <WebView
            source={{ uri: this.props.navigation.getParam("placeUrl") }}
            style={{ width: Dimensions.get("window").width }}
            renderLoading={<ActivityIndicator />}
          />
        </LinearGradient>
      </View>
    );
  }

  header_left = () => {
    return (
      <TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }}>
        <View style={styles.headerLeftText}>
          <Icon type='ionicon' name='ios-arrow-back' size={25} color='black' />
        </View>
      </TouchableOpacity>
    );
  };

  header_right = () => {
    return (
      <TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }}>
          <Text style={styles.headerCenterText}>Continue</Text>
      </TouchableOpacity>
    );
  };
}

export default connect()(BookingMapScreen)

let styles={
  rootContainer: {
    flex: 1,
    backgroundColor:'#f9f9f9'
  },
  headerCenterText: {
    fontSize: 14,
    fontWeight: "600",
  }
};
