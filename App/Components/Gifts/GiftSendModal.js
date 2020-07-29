import React, { Component } from "react";
import { View, Text, Image, TextInput, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";

import { userService } from "App/Services/UserService";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import TextInput2 from "./../Profile/TextInput2";

class GiftSendModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: "",
      errorMsg: null
    };
  }

  sendGift = () => {
    if (this.state.message === "") {
      this.setState({ errorMsg: "Please write a message" }, () => {
        this.removeErrorMsg();
      });
      return;
    }
    this.setState({ loading: true });
    const { gift, toUser } = this.props;
    const body = { to: toUser.id, message: this.state.message };
    console.log(
      "Send Message Body=",
      toUser,
      body,
      this.props.userToken.access_token,
      gift.id
    );

    userService
      .post(this.props.userToken.access_token, `/gifts/${gift.id}`, body)
      .then(res => {
        this.setState({ loading: false }, () =>
          this.props.onSendSuccess(res.data.gift.price)
        );
      })
      .catch(err => {
        console.log(" gift success err -> ", err.response.data);
        this.setState(
          {
            loading: false,
            errorMsg: "Insufficient Match $. Go to Store to purchase."
          },
          () => {
            this.removeErrorMsg();
          }
        );
      });
  };

  removeErrorMsg = () => {
    setTimeout(() => {
      this.setState({ errorMsg: null });
    }, 2000);
  };

  render() {
    return (
      <View style={{ width: Dimensions.get("window").width - 100 }}>
        <Image
          source={{ uri: this.props.gift.icon }}
          style={{ width: "46%", height: 80, alignSelf: "center" }}
          resizeMode="contain"
        />
        <Text
          style={{
            marginTop: 30,
            textAlign: "center",
            color: "#17144e",
            fontSize: 26,
            fontFamily: "ProximaNova-Bold",
            alignSelf: "center"
          }}
        >
          {"Confirm Purchase\n" + this.props.gift.price + " Match $"}
        </Text>
        <Text style={{ marginTop: 40, color: "#17144e", fontSize: 17 }}>
          Write a Message
        </Text>
        <View style={{ width: "100%" }}>
          <TextInput2
            returnKeyType="done"
            style={{
              borderColor: "gray",
              borderWidth: 1,
              height: 60,
              padding: 5
            }}
            multiline={true}
            blurOnSubmit={true}
            placeholder="Type your message here"
            value={this.state.message}
            onChangeText={value => {
              this.setState({ message: value });
            }}
          />
        </View>

        {this.state.errorMsg ? (
          <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
        ) : null}
        <Button
          title="PURCHASE"
          titleStyle={{ fontFamily: "ProximaNova-Bold" }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#4a46d6", "#964cc6"],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 }
          }}
          loading={this.state.loading}
          buttonStyle={{ borderRadius: 30 }}
          onPress={this.sendGift}
          containerStyle={{ marginBottom: 5, marginTop: 35 }}
        />
        <Button
          title="CANCEL"
          titleStyle={{ color: "#91919d", fontFamily: "ProximaNova-Bold" }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#fff", "#efefef"],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 }
          }}
          buttonStyle={{ borderRadius: 30 }}
          onPress={this.props.onBackdropPress}
          containerStyle={{ marginBottom: 5, marginTop: 5 }}
        />
      </View>
    );
  }
}

GiftSendModal.propTypes = {
  gift: PropTypes.object,
  onBackdropPress: PropTypes.func,
  onSendSuccess: PropTypes.func
};

let styles = {
  errorMsg: {
    color: "red",
    fontSize: 15,
    marginVertical: 5
  }
};
const mapStateToProps = state => {
  return {
    userToken: state.startup.userToken
  };
};

export default connect(mapStateToProps)(GiftSendModal);
