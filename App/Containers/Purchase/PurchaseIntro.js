import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Linking,
  Alert
} from "react-native";
import { Icon, Header, Button, Overlay } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import Swiper from "react-native-swiper";
import { thousands_separators } from "App/Services/HelperServices";
import { Images } from "App/Theme";
import { userService } from "App/Services/UserService";
import PurchaseConfirmDialog from "App/Components/Purchase/PurchaseConfirmDialog";
import moment from "moment";
import { Values } from "App/Theme";

const width = Dimensions.get("window").width;
const purchaseItemWidth = 170;
const purchaseItemHeight = 210;

const purchaseItems = [1, 2, 3, 4];
const saveData = ["", "SAVE 34%", "SAVE 50%"];

class PurchaseIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptions: [],
      selected: -1,
      confirming: false,
      selectedItem: null,
      profile: this.props.profile
    };
  }

  gotoWebPage(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }

  componentDidMount() {
    userService
      .get_request(this.props.userToken.access_token, "/subscriptions")
      .then(res => {
        this.setState({
          subscriptions: res.data.filter(item => item.period !== 14)
        });
      });
  }

  showConfirmDialog() {
    if (this.state.selected == -1) {
      alert("Please select one option");
      return;
    }

    if (this.props.profile.subscribe_end_date != null) {
      if (
        Date.parse(this.props.profile.subscribe_end_date.replace(/ /g, "T")) >=
        new Date().getTime()
      ) {
        Alert.alert(
          "You are currently subscribed",
          "To review subscription settings or cancel this subscription, tap Manage.\n" + 
          "Tap OK to change subscription - Your new subscription will begin when your current subscription expires on " +
          `${moment(this.props.profile.subscribe_end_date.replace(" ", "T")).format("DD/MM/YYYY")}`,
          [
            {
              text: "Manage",
              onPress: () => this.gotoWebPage("https://apps.apple.com/account/billing"),
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () => {
                this.setState({
                  confirming: true,
                  selectedItem: this.state.subscriptions[this.state.selected]
                });
              }
            }
          ],
          { cancelable: false }
        );
        return;
      }
    }
    this.setState({
      confirming: true,
      selectedItem: this.state.subscriptions[this.state.selected]
    });
  }

  render() {
    const { profile } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        <Header
          leftComponent={this.renderHeaderLeft}
          backgroundColor="transparent"
          centerComponent={this.renderHeaderCenter}
          rightComponent={this.renderHeaderRight}
        />
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image source={Images.ic_vip_pass} style={styles.imgRating} />
          {/* <Text style={styles.subtitle}>More Likes! More Matches !</Text> */}
          <Swiper
            style={styles.wrapper}
            dotColor="darkgrey"
            dotStyle={{ marginTop: 0 }}
            activeDotColor="#3cb9fc"
            activeDotStyle={{ marginTop: 0 }}
            autoplay={true}
            loop={true}
          >
            <View style={{}}>
              <Text style={styles.h2}>Matchmaker</Text>
              <Text style={styles.subtitle}>
                Get More Intros! Upto 20 Daily!
              </Text>
            </View>
            <View style={{}}>
              <Text style={styles.h2}>Free Match $</Text>
              <Text style={styles.subtitle}>Receive 200 Match $ Daily!</Text>
            </View>
            <View style={{}}>
              <Text style={styles.h2}>Unlock All Filters</Text>
              <Text style={styles.subtitle}>Choose exactly who you view!</Text>
            </View>
            <View style={{}}>
              <Text style={styles.h2}>Change Location</Text>
              <Text style={styles.subtitle}>
                Match with anyone in the world!
              </Text>
            </View>
            {profile.isEnableCoupon && (
              <View style={{}}>
                <Text style={styles.h2}>Invisible Mode</Text>
                <Text style={styles.subtitle}>
                  Choose who views your profile!
                </Text>
              </View>
            )}
            {profile.isEnableCoupon && (
              <View style={{}}>
                <Text style={styles.h2}>Hide Age & Location</Text>
                <Text style={styles.subtitle}>
                  Choose what others view about you!
                </Text>
              </View>
            )}
          </Swiper>
          <FlatList
            data={this.state.subscriptions}
            horizontal={true}
            renderItem={this.renderPurchaseItem}
            keyExtractor={(item, index) => `${index}`}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTextBold}>
              {Values.recurringBillingDes1}
            </Text>
            <Text style={styles.descriptionText}>
              {Values.recurringBillingDes2}
            </Text>
            <Text style={styles.descriptionText}>
              {Values.recurringBillingDes3}
              <Text
                style={styles.descriptionTextUnderLine}
                onPress={() =>
                  this.gotoWebPage("https://matchmde.com/privacy-policy/")
                }
              >
                {Values.verificationDescription8}
              </Text>
              {Values.recurringBillingDes4}
              <Text
                style={styles.descriptionTextUnderLine}
                onPress={() =>
                  this.gotoWebPage("https://matchmde.com/terms-of-service/")
                }
              >
                {Values.verificationDescription2}
              </Text>
            </Text>
          </View>
          <Button
            title="CONTINUE"
            titleStyle={{ fontWeight: "bold" }}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#4a46d6", "#964cc6"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            buttonStyle={{ borderRadius: 30 }}
            iconRight
            icon={
              <Icon
                name="md-arrow-round-forward"
                type="ionicon"
                color="white"
                containerStyle={{ position: "absolute", right: 12 }}
              />
            }
            containerStyle={{
              marginBottom: 10,
              marginTop: 20,
              alignSelf: "center",
              width: "86%"
            }}
            onPress={() => {
              this.showConfirmDialog();
            }}
          />

          <Text style={styles.bottomText}>
            {this.props.profile.subscribe_end_date !== null
              ? `Premium Subscription auto renews on ${moment(
                  this.props.profile.subscribe_end_date.replace(" ", "T")
                ).format("DD/MM/YYYY")}`
              : ""}
          </Text>
        </ScrollView>
        <Overlay
          isVisible={this.state.confirming}
          width="auto"
          height="auto"
          overlayStyle={{ padding: 30 }}
          borderRadius={14}
        >
          <PurchaseConfirmDialog
            item={this.state.selectedItem}
            dismiss={() => {
              this.setState({ confirming: false });
            }}
          />
        </Overlay>
      </View>
    );
  }

  renderPurchaseItem = ({ item, index }) => {
    const { profile } = this.state;
    let price_luxe = item.price_luxe;
    switch (price_luxe) {
      case "10000":
        price_luxe = "10,000";
        break;
      case "30000":
        price_luxe = "30,000";
        break;
      case "60000":
        price_luxe = "60,000";
        break;
      default:
        break;
    }
    if (index == 1) {
      return (
        <TouchableOpacity
          style={[
            index == this.state.selected
              ? styles.itemStyleSelected
              : [
                  styles.itemStyleNormal,
                  {
                    borderColor: "#3cb9fc",
                    borderWidth: 2
                  }
                ],
            {}
          ]}
          onPress={() => {
            this.setState({ selected: index });
          }}
        >
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Image
            source={{ uri: item.icon }}
            style={{ width: 60, height: 60, marginTop: 10 }}
            resizeMode="contain"
          />
          {profile.isEnableCoupon && (
            <Text style={styles.itemLuxe}>{price_luxe} Match $</Text>
          )}
          <Text style={styles.itemSave}>{saveData[index]}</Text>
          <Text style={styles.itemPrice}>${`${item.price_sgd} (SGD)`}</Text>
          <Text style={styles.mostPopularStyle}>{"MOST POPULAR"}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={
            index == this.state.selected
              ? styles.itemStyleSelected
              : styles.itemStyleNormal
          }
          onPress={() => {
            this.setState({ selected: index });
          }}
        >
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Image
            source={{ uri: item.icon }}
            style={{ width: 60, height: 60, marginTop: 10 }}
            resizeMode="contain"
          />
          {profile.isEnableCoupon && (
            <Text style={styles.itemLuxe}>{price_luxe} Match $</Text>
          )}
          <Text style={styles.itemSave}>{saveData[index]}</Text>
          <Text style={styles.itemPrice}>${`${item.price_sgd} (SGD)`}</Text>
        </TouchableOpacity>
      );
    }
  };

  renderHeaderLeft = () => {
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
          color="#17144e"
        />
        <Text style={styles.headerLeftText}>Back</Text>
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    return (
      <Text style={{ fontSize: 21, color: "#17144e", fontWeight: "bold" }}>
        Go Premium
      </Text>
    );
  };

  renderHeaderRight = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={Images.DollarCoinStack}
          style={{ width: 20, height: 21 }}
          resizeMode="contain"
        />
        <Text>{thousands_separators(this.props.profile.balance)}</Text>
      </View>
    );
  };
}
const mapStateToProps = state => {
  return {
    userToken: state.startup.userToken,
    profile: state.user.profile
  };
};
export default connect(mapStateToProps)(PurchaseIntro);
let styles = {
  h1: {
    fontSize: 24,
    textAlign: "center",
    alignSelf: "center",
    color: "#17144e",
    fontWeight: "bold",
    marginTop: 40
  },
  h2: {
    fontSize: 21,
    textAlign: "center",
    alignSelf: "center",
    color: "#17144e",
    fontWeight: "bold",
    marginTop: 40
  },
  imgRating: {
    marginTop: 20,
    alignSelf: "center",
    width: 150,
    height: 150
  },
  subtitle: {
    fontSize: 17,
    color: "#91919d",
    alignSelf: "center",
    textAlign: "center",
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20
  },
  itemStyleNormal: {
    width: purchaseItemWidth,
    height: purchaseItemHeight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: "grey",
    borderWidth: 1,
    margin: 10
  },
  itemStyleSelected: {
    width: purchaseItemWidth,
    height: purchaseItemHeight,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#B537F2",
    borderWidth: 2,
    borderRadius: 8,
    margin: 10
  },
  itemTitle: {
    color: "#17144e",
    fontStyle: "italic",
    fontSize: 15
  },
  itemLuxe: {
    color: "#17144e",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 10
  },
  itemPrice: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "bold"
  },
  itemSave: {
    fontWeight: "700",
    fontSize: 13,
    color: "#3cb9fc",
    marginTop: 3
  },
  wrapper: {
    height: 160
  },
  bottomText: {
    color: "#91919d",
    fontSize: 12,
    marginVertical: 30,
    width: "100%",
    textAlign: "center"
  },
  mostPopularStyle: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
    marginTop: -13,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#3cb9fc",
    overflow: "hidden",
    borderRadius: 12,
    top: 0,
    position: "absolute"
  },
  descriptionContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  descriptionText: {
    color: "#91919d",
    fontSize: 14,
    textAlign: "center"
  },
  descriptionTextBold: {
    color: "#91919d",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center"
  },
  descriptionTextUnderLine: {
    color: "#91919d",
    fontSize: 14,
    textDecorationLine: "underline",
    textAlign: "center",
    fontWeight: "bold"
  }
};
