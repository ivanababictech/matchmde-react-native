import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";
import { Button } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";

import { userService } from "App/Services/UserService";
import UserActions from "App/Stores/User/Actions";
import Toast from "react-native-root-toast";
import ApplicationStyles from "../../Theme/ApplicationStyles";
import * as RNIap from "react-native-iap";

const itemSkus = Platform.select({
  ios: ["3458A", "3458B", "3458C"],
  android: ["3456ab", "3456bb", "3456cb"]
});

class PurchaseConfirmDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      loading: false,
      isNotifying: false,
      successModalState: false,
      errorModalState: false,
      profile: this.props.profile
    };
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      try {
        const result = await RNIap.initConnection();
        await RNIap.consumeAllItemsAndroid();
        console.log("result", result);
      } catch (err) {
        console.warn(err.code, err.message);
      }
    }

    const subs = await RNIap.getSubscriptions(itemSkus);
    console.log("subs -> ", subs);
  }

  async onPurchase(type) {
    if (type === "usd") {
      const selectedItem = this.props.item.id - 1;
      console.log("Sub selectedItem -> ", selectedItem);

      try {
        // Will return a purchase object with a receipt which can be used to validate on your server.
        console.log("Sub itemSku -> ", itemSkus[selectedItem]);
        const purchase = await RNIap.requestPurchase(
          itemSkus[selectedItem],
          false
        );
        console.log("Sub purchase -> ", purchase);
        this.continueSub(type);
      } catch (err) {
        // standardized err.code and err.message available
        alert("Purchase failed");
        console.warn(err.code, err.message);
      }
    } else {
      this.continueSub(type);
    }
  }

  continueSub(type) {
    let body;
    if (this.state.text.length > 0) {
      body = {
        promo_code: this.state.text,
        type: type
      };
    } else {
      body = {
        type: type
      };
    }
    this.setState({ loading: false });
    userService
      .post(
        this.props.userToken.access_token,
        `/subscriptions/${this.props.item.id}`,
        body
      )
      .then(res => {
        this.setState({ loading: false }, () => {
          this.props.dismiss();
        });
        let profile = { ...this.props.profile };
        profile.balance = res.data.balance;
        profile.is_subscribe = res.data.is_subscribe;
        profile.subscribe_end_date = res.data.subscribe_end_date;
        this.props.updateProfile({ profile: profile });
        setTimeout(() => {
          alert("Thank you for your purchase");
        }, 500);
      })
      .catch(err => {
        console.log("subscriptions err -> ", err);
        setTimeout(() => {
          alert("Insufficient Match$, please purchase.");
        }, 500);
        this.setState({ loading: false }, () => {
          this.props.dismiss();
        });
      });
  }

  onChangeText(text) {
    this.setState({ text });
  }

  applyCoupon = () => {
    const body = { code: this.state.text };
    this.setState({ isLoading: true });
    userService
      .post(this.props.userToken.access_token, "/account/coupon", body)
      .then(res => {
        let profile = { ...this.props.profile };
        profile.balance = res.data.balance;
        this.props.updateProfile({ profile: profile });

        this.setState({ isLoading: false });
        alert("Coupon code successfully applied!");
        // Toast.show("Coupon code successfully applied!", ApplicationStyles.toastOptionSuccess);
      })
      .catch(err => {
        console.log("apply coupon err -> ", err);
        this.setState({ isLoading: false });
        // Toast.show("Coupon code Failed", ApplicationStyles.toastOptionError);
        alert("Coupon code Failed");
      });
  };

  render() {
    const { item } = this.props;
    const { profile } = this.state;

    let confirmTitle = "";
    if (profile.isEnableCoupon) {
      confirmTitle = `Confirm Purchase\n${item.price_luxe} Match $\nor\n$${item.price_sgd}`;
    } else {
      confirmTitle = `Confirm Purchase\n$${item.price_sgd}`;
    }
    return (
      <View style={{ alignItems: "center", width: 300 }}>
        <Image
          source={{ uri: item.icon }}
          style={{ width: 111, height: 111 }}
          resizeMode="contain"
        />
        <Text style={styles.desc}>{confirmTitle}</Text>

        {false && <Text style={{ alignSelf: "flex-start" }}>Coupon Code?</Text>}

        {false && (
          <View
            style={{
              flexDirection: "row",
              alignSelf: "stretch",
              alignItems: "center"
            }}
          >
            <TextInput
              returnKeyType="done"
              style={{
                width: 300,
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                paddingLeft: 3
              }}
              maxLength={20}
              onChangeText={text => {
                this.onChangeText(text);
              }}
              placeholder={"Apply Coupon Code"}
              value={this.state.text}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 15 }}
              onPress={this.applyCoupon}
            >
              <Text
                style={{ color: "#3cb9fc", fontFamily: "ProximaNova-Bold" }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {profile.isEnableCoupon && (
          <Button
            title="Purchase with Match$"
            titleStyle={{ fontFamily: "ProximaNova-Bold" }}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#4a46d6", "#964cc6"],
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
            loading={this.state.loading}
            buttonStyle={{ borderRadius: 30 }}
            containerStyle={{
              marginTop: 20,
              alignSelf: "center",
              width: "86%"
            }}
            onPress={() => {
              this.onPurchase("luxe");
            }}
          />
        )}
        <Button
          title="Purchase with $"
          titleStyle={{ fontFamily: "ProximaNova-Bold" }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#4a46d6", "#964cc6"],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 }
          }}
          loading={this.state.loading}
          buttonStyle={{ borderRadius: 30 }}
          containerStyle={{ marginTop: 20, alignSelf: "center", width: "86%" }}
          onPress={() => {
            this.onPurchase("usd");
          }}
        />
        <Button
          title="Cancel"
          titleStyle={{ color: "#91919d", fontFamily: "ProximaNova-Bold" }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#fff", "#efefef"],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 }
          }}
          loading={this.state.loading}
          buttonStyle={{ borderRadius: 30 }}
          containerStyle={{ marginTop: 20, alignSelf: "center", width: "86%" }}
          onPress={() => {
            this.props.dismiss();
          }}
        />
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    userToken: state.startup.userToken,
    profile: state.user.profile
  };
};
const mapDispatchToProps = dispatch => {
  return {
    updateProfile: photo => dispatch(UserActions.fetchUserSuccess(photo))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseConfirmDialog);
let styles = {
  desc: {
    fontSize: 26,
    fontFamily: "ProximaNova-Bold",
    color: "#17144e",
    textAlign: "center",
    marginTop: 30
  }
};
