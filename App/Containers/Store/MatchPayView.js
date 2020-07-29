import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import { Overlay, Icon, Button } from "react-native-elements";
import Spinner from "react-native-spinkit";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";

import { userService } from "App/Services/UserService";
import UserActions from "App/Stores/User/Actions";

import Swiper from "react-native-swiper";
import { Images } from "App/Theme";
import * as RNIap from "react-native-iap";

const itemWidth = Dimensions.get("window").width / 2 - 20;
const itemHeight = 230;

const saveStringData = [
  "",
  "SAVE 32%",
  "SAVE 49%",
  "SAVE 76%",
  "SAVE 84%",
  "SAVE 88%"
];

const itemSkus = Platform.select({
  ios: ["5678A", "5678B", "5678D", "5678C", "5678E", "5678F"],
  android: ["5678a", "5678b", "5678d", "5678c", "5678e", "5678f"]
});

class MatchPayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isRefreshing: false,
      isLoading: false,
      selected: -1
    };
  }
  async componentDidMount() {
    this.loadCreditItems();

    const products = await RNIap.getProducts(itemSkus);
    console.log("products -> ", products);
  }

  loadCreditItems = () => {
    this.setState({ isRefreshing: true });
    userService
      .get_request(this.props.userToken.access_token, "purchase_items")
      .then(res => {
        console.log("Puchase Items=", res.data);
        this.setState({ items: res.data });
      })
      .catch(err => {
        this.setState({ isRefreshing: false });
      });
  };

  handleRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.loadCreditItems();
    });
  };

  buyCredit(item) {
    console.log("MatchPayView buyCredit -> ", item);

    this.setState({ isLoading: true });
    userService
      .post(
        this.props.userToken.access_token,
        `/purchase/currency/${item.id}`,
        {}
      )
      .then(res => {
        this.setState({ isLoading: false }, () =>
          this.updateMyBalance(res.data.balance)
        );
      })
      .catch(err => {
        this.setState({ isLoading: false }, () =>
          this.purchaseStateDialog("Purchase Failed, try again later.")
        );
      });
  }

  async buyCreditWithApple(selectedItem) {
    console.log("MatchPayView selectedItem -> ", selectedItem);

    try {
      // Will return a purchase object with a receipt which can be used to validate on your server.
      console.log("MatchPayView itemSku -> ", itemSkus[selectedItem]);
      const purchase = await RNIap.requestPurchase(
        itemSkus[selectedItem],
        false
      );
      console.log("MatchPayView purchase -> ", purchase);
      this.buyCredit(this.state.items[selectedItem]);
    } catch (err) {
      // standardized err.code and err.message available
      alert("Purchase failed");
      console.warn(err.code, err.message);
    }
  }

  purchaseStateDialog(msg) {
    setTimeout(() => Alert.alert("Success", msg), 500);
  }

  updateMyBalance(balance) {
    let profile = { ...this.props.profile };
    profile.balance = balance;
    this.props.updateProfilePhotos({ profile: profile });

    this.purchaseStateDialog("Thank you for your purchase!");
  }

  continuePurchase() {
    if (this.state.selected == -1) {
      alert("Please select one option");
      return;
    }
    Alert.alert(
      "Confirm",
      "Purchase?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            // this.buyCredit(this.state.items[this.state.selected])
            this.buyCreditWithApple(this.state.selected);
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const { items, isRefreshing } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        <FlatList
          data={items}
          extraData={this.state.selected}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          numColumns={2}
          // refreshing={isRefreshing}
          // onRefresh={this.handleRefresh}
          ListHeaderComponent={this.CreditListHeader}
          ListFooterComponent={
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
                this.continuePurchase();
              }}
            />
          }
        />

        <Overlay
          width="auto"
          height="auto"
          overlayStyle={{ padding: 30 }}
          isVisible={this.state.isLoading}
          borderRadius={15}
        >
          <Spinner type="Circle" color="#3cb9fc" />
        </Overlay>
      </View>
    );
  }

  CreditListHeader = () => {
    return (
      <View>
        <Text style={styles.title}>{`What can you do with \nMatch $?`}</Text>
        <Image
          source={Images.GiftMatch}
          style={styles.logoImage}
          resizeMode="cover"
        />
        <Swiper
          style={styles.wrapper}
          dotColor="darkgrey"
          dotStyle={{ marginTop: 0 }}
          activeDotColor="#3cb9fc"
          activeDotStyle={{ marginTop: 0 }}
          autoplay={true}
          loop={true}
        >
          <View>
            <Text style={styles.swiperTitle}>Send a Gift</Text>
            <Text style={styles.swiperContent}>To your loved ones!</Text>
          </View>
          <View>
            <Text style={styles.swiperTitle}>Purchase Boost</Text>
            <Text style={styles.swiperContent}>Stand out from the crowd!</Text>
          </View>
          {/* <View>
						<Text style={styles.swiperTitle}>Transfer to a Friend</Text>
						<Text style={styles.swiperContent}>Give it to someone special!</Text>
					</View> */}
        </Swiper>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    let price_luxe = item.price_luxe;
    switch (price_luxe) {
      case "1200":
        price_luxe = "1,200";
        break;
      case "11000":
        price_luxe = "11,000";
        break;
      case "33000":
        price_luxe = "33,000";
        break;
      case "66000":
        price_luxe = "66,000";
        break;
      default:
        break;
    }
    if (index == 3) {
      return (
        <TouchableOpacity
          style={
            index == this.state.selected
              ? styles.itemWrap_selected
              : [
                  styles.itemWrap,
                  {
                    borderColor: "#3cb9fc",
                    borderWidth: 2
                  }
                ]
          }
          onPress={() => {
            this.setState({ selected: index });
          }}
        >
          <Text style={styles.label1}>{item.title}</Text>
          <Image
            source={{ uri: item.icon }}
            style={styles.itemIcon}
            resizeMode="contain"
          />
          <Text style={styles.label2}>{`${price_luxe} Match $`}</Text>
          <Text style={styles.savelabel}>{saveStringData[index]}</Text>
          <View
            style={{ flexDirection: "row", marginTop: 5, alignItems: "center" }}
          >
            <Text style={styles.label3}>{`$${item.price_sgd}`}</Text>
            <Text style={styles.label3_sgd}>{" (SGD)"}</Text>
          </View>

          <Text style={styles.mostPopularStyle}>{"MOST POPULAR"}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={
            index == this.state.selected
              ? styles.itemWrap_selected
              : styles.itemWrap
          }
          onPress={() => {
            this.setState({ selected: index });
          }}
        >
          <Text style={styles.label1}>{item.title}</Text>
          <Image
            source={{ uri: item.icon }}
            style={styles.itemIcon}
            resizeMode="contain"
          />
          <Text style={styles.label2}>{`${price_luxe} Match $`}</Text>
          <Text style={styles.savelabel}>{saveStringData[index]}</Text>
          <View
            style={{ flexDirection: "row", marginTop: 5, alignItems: "center" }}
          >
            <Text style={styles.label3}>{`$${item.price_sgd}`}</Text>
            <Text style={styles.label3_sgd}>{" (SGD)"}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  keyExtractor = (item, index) => `${index}`;
}

let styles = {
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#17144e",
    fontWeight: "bold",
    marginTop: 50
  },
  logoImage: {
    width: 120,
    height: 125,
    marginTop: 20,
    alignSelf: "center"
  },
  label1: {
    fontStyle: "italic",
    fontSize: 15,
    color: "#17144e",
    textAlign: "center",
    marginVertical: 10
  },
  label2: {
    fontSize: 17,
    color: "#17144e",
    textAlign: "center",
    marginTop: 5
  },
  mostPopularStyle: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
    marginTop: -12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#3cb9fc",
    overflow: "hidden",
    borderRadius: 12,
    top: 0,
    position: "absolute"
  },
  savelabel: {
    fontSize: 14,
    color: "#3cb9fc",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 5
  },
  label3: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#17144e",
    textAlign: "center"
  },
  label3_sgd: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#17144e",
    textAlign: "center"
  },
  itemWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: itemWidth,
    height: itemHeight,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  itemWrap_selected: {
    alignItems: "center",
    justifyContent: "center",
    width: itemWidth,
    height: itemHeight,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 2,
    shadowColor: "#3cb9fc",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: "#B537F2"
  },
  itemIcon: {
    width: 100,
    height: 80
  },
  wrapper: {
    height: 140
  },
  swiperTitle: {
    alignSelf: "center",
    fontSize: 21,
    color: "#17144e",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 15
  },
  swiperContent: {
    alignSelf: "center",
    fontSize: 17,
    color: "#91919d",
    marginLeft: 20,
    marginRight: 20,
    textAlign: "center"
  }
};
const mapStateToProps = state => {
  return {
    userToken: state.startup.userToken,
    profile: state.user.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateProfilePhotos: photo => dispatch(UserActions.fetchUserSuccess(photo))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MatchPayView);
