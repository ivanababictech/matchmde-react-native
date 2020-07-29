import React, { Component } from "react";
import "react-native-gesture-handler";
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  NavigationActions,
  DrawerActions,
  StackActions
} from "react-navigation";
import { Icon, Avatar, Divider, ListItem, Button } from "react-native-elements";
import { EventRegister } from "react-native-event-listeners";
import moment from "moment";
import { Images } from "App/Theme";
import { userService } from "App/Services/UserService";
import { connect } from "react-redux";
import StartupActions from "App/Stores/Startup/Actions";
import Values from "../../Theme/Values";

class DrawerScreen extends Component {
  constructor(props) {
    super(props);
  }

  onPressItem1(index) {
    //this.props.navigation.closeDrawer()

    if (index == 3) {
      this.props.setStoreTab(1);
    }

    this.props.navigation.navigate("Dating", { tabIndex: index });
    EventRegister.emit("TabChangeEvent", index);
    this.props.navigation.closeDrawer();
  }

  onPressItem2(routeName) {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate(routeName);
  }

  render() {
    return (
      <View style={styles.rootContainer}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.closeDrawer();
          }}
          style={{ width: "100%", alignItems: "flex-end", marginTop: 15 }}
        >
          <Image source={Images.delete} style={{ marginEnd: 20 }} />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View>
            <Avatar
              source={{ uri: this.props.profile.picture }}
              rounded
              size="large"
            />
            {this.props.profile.subscribe_end_date != null ? (
              <Image
                source={Images.ic_vip_pass}
                style={{
                  top: 0,
                  marginTop: 54,
                  end: 0,
                  position: "absolute",
                  width: 20,
                  height: 20
                }}
              />
            ) : null}
          </View>

          <View style={{ width: "60%" }}>
            <Text
              style={{
                color: "#17144e",
                fontSize: 22,
                fontFamily: "ProximaNova-Bold",
                marginLeft: 15
              }}
            >
              {`${this.props.profile.name}, ${userService.calcAge(
                this.props.profile.birthday
              )}`}
            </Text>
            <Text
              style={{
                color: "gray",
                fontSize: 20,
                marginLeft: 15,
                marginTop: 5
              }}
            >
              {`${this.props.profile.city}, ${this.props.profile.country}`}
            </Text>
          </View>
        </View>
        <Divider
          style={{
            backgroundColor: "#17144e",
            marginVertical: 10,
            marginLeft: 90,
            marginRight: 25
          }}
        />
        <ScrollView style={{ flex: 1, marginBottom: 10 }}>
          <ListItem
            leftElement={
              <Image
                source={Images.MatchmakerBlue}
                style={{ width: 25, height: 29 }}
                resizeMode="contain"
              />
            }
            title="Matchmaker"
            containerStyle={{ backgroundColor: "white" }}
            titleStyle={[styles.leftListItemTextStyle, {}]}
            onPress={() => {
              this.onPressItem1(1);
            }}
          />
          <Divider
            style={{
              backgroundColor: "gray",
              marginVertical: 5,
              marginLeft: 20,
              marginRight: 25
            }}
          />
          <ListItem
            leftElement={
              <Image
                source={Images.CompassBlue}
                style={{ width: 25, height: 29 }}
                resizeMode="contain"
              />
            }
            title="Discover"
            containerStyle={{ backgroundColor: "white" }}
            titleStyle={styles.leftListItemTextStyle}
            onPress={() => {
              this.onPressItem1(0);
            }}
          />
          <ListItem
            leftElement={
              <Image
                source={Images.BoyfriendBlue}
                style={{ width: 25, height: 29 }}
                resizeMode="contain"
              />
            }
            title="Connections"
            containerStyle={{ backgroundColor: "white" }}
            titleStyle={styles.leftListItemTextStyle}
            onPress={() => {
              this.onPressItem2("Connections");
            }}
          />
          <ListItem
            leftElement={
              <Image
                source={Images.MessageBlue}
                style={{ width: 25, height: 29 }}
                resizeMode="contain"
              />
            }
            title="Messages"
            containerStyle={{ backgroundColor: "white" }}
            titleStyle={styles.leftListItemTextStyle}
            onPress={() => {
              this.onPressItem1(2);
            }}
          />
          <ListItem
            leftElement={
              <Image
                source={Images.WomanBlue}
                style={{ width: 25, height: 29 }}
                resizeMode="contain"
              />
            }
            title="Most Popular"
            containerStyle={{ backgroundColor: "white" }}
            titleStyle={styles.leftListItemTextStyle}
            onPress={() => {
              this.onPressItem2("MostDesired");
            }}
          />
          <ListItem
            leftElement={
              <Image
                source={Images.HangoutLogoBlue}
                style={{ width: 25, height: 29 }}
                resizeMode="contain"
              />
            }
            title="Date Spots"
            containerStyle={{ backgroundColor: "white" }}
            titleStyle={styles.leftListItemTextStyle}
            onPress={() => {
              this.onPressItem2("DateSpot");
            }}
          />
          <ListItem
            leftElement={
              <Image
                source={Images.RewardBlue}
                style={{ width: 25, height: 29 }}
                resizeMode="contain"
              />
            }
            title="Rewards"
            containerStyle={{ backgroundColor: "white" }}
            titleStyle={styles.leftListItemTextStyle}
            onPress={() => {
              this.onPressItem2("Reward");
            }}
          />
          <ListItem
            leftElement={
              <Image
                source={Images.StoreBlue}
                style={{ width: 25, height: 29 }}
                resizeMode="contain"
              />
            }
            title="Store"
            containerStyle={{ backgroundColor: "white" }}
            titleStyle={styles.leftListItemTextStyle}
            onPress={() => {
              this.onPressItem1(3);
            }}
          />
          <ListItem
            leftElement={
              <Image
                source={Images.ProfileBlue}
                style={{ width: 25, height: 29 }}
                resizeMode="contain"
              />
            }
            title="Profile"
            containerStyle={{ backgroundColor: "white" }}
            titleStyle={styles.leftListItemTextStyle}
            onPress={() => {
              this.onPressItem1(4);
            }}
          />
        </ScrollView>
        <View style={{ marginRight: 30 }}>
          <Button
            title="GO PREMIUM"
            titleStyle={{ fontWeight: "bold" }}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#4a46d6", "#964cc6"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            buttonStyle={{ borderRadius: 30 }}
            containerStyle={{ width: "80%", alignSelf: "center" }}
            onPress={() => {
              this.onPressItem2("Purchase");
            }}
          />
          <Text style={styles.bottomText}>
            {this.props.profile.subscribe_end_date
              ? `Premium Subscription auto renews on ${moment(
                  this.props.profile.subscribe_end_date.replace(" ", "T")
                ).format("DD/MM/YYYY")}`
              : ""}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    paddingLeft: 30
  },
  bottomText: {
    color: "#91919d",
    fontSize: 12,
    marginVertical: 10,
    width: "100%",
    textAlign: "center"
  },
  leftListItemTextStyle: { fontFamily: "ProximaNova-Bold", fontSize: 17 }
});

const mapStateToProps = state => {
  return {
    profile: state.user.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setStoreTab: data => dispatch(StartupActions.updateStoreTab(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreen);
