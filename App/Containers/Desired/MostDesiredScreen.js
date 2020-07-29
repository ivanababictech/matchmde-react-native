import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Header, Badge } from "react-native-elements";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import * as i18nIsoCountries from "i18n-iso-countries";
i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));

import { Images } from "App/Theme";

import { userService } from "App/Services/UserService";
import { sendNotification } from "App/Services/HelperServices";

const itemWidth = Dimensions.get("window").width / 2 - 26;
const itemHeight = itemWidth * 1.11;

class MostDesiredScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peoples: [],
      listUpdate: true
    };
  }

  async componentDidMount() {
    const queryParam = {
      gender: "female",
      country: "Singapore",
      radius: 120
    };
    try {
      const response = await userService.fetchMostDesired(
        this.props.userToken.access_token,
        queryParam
      );
      //const peoples = this.state.peoples.concat(response.data.data)
      this.setState({
        peoples: response.data,
        listUpdate: !this.state.listUpdate
      });
    } catch (err) {
      console.log("fetch most desired err -> ", err);
    }
  }

  likeUnlikePerson(likedProfile, isLiked) {
    const body = { to: likedProfile.id, status: true };
    userService
      .likeUnlike(this.props.userToken.access_token, body)
      .then(response => {
        const res = response.data;
        if (res.is_matched) {
          this.setState({ matchData: likedProfile, isMatch: true });

          //this.props.getMatchedUsers( this.props.reduxUserToken.userToken, res => {});

          userService
            .matches(this.props.userToken.access_token)
            .then(response2 => {
              const matched = response2.data.data;
              this.props.updateMatched(matched);
            })
            .catch(err2 => {
              console.log("matches_ most popular error -> ", err2);
            });
          if (
            likedProfile.device_tokens &&
            likedProfile.device_tokens.length > 0
          ) {
            const body = {
              device_token: item.device_tokens[0].device_token,
              title: "Congratulation!",
              body: "You matched with " + this.props.reduxUserProfile.name,
              os_type: Platform.OS,
              date: Math.floor(Date.now())
            };
            sendNotification(body, res => {
              console.log("Send Notification Data:", res);
            });
          }
        } else {
          if (
            likedProfile.device_tokens &&
            likedProfile.device_tokens.length > 0
          ) {
            const body = {
              device_token: likedProfile.device_tokens[0].device_token,
              title: "Congratulation!",
              body: this.props.profile.name + " likes you",
              os_type: Platform.OS,
              date: Math.floor(Date.now())
            };

            sendNotification(body, res => {
              console.log("Send Notification Data:", res);
            });
          }
        }
      })
      .catch(err => {
        console.log("send notification data error -> ", err);
      });
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: "center",
          alignSelf: "center",
          flex: 1,
          marginBottom: 10
        }}
        onPress={() => {
          this.props.navigation.push("OtherProfile", {
            other: item,
            isMatched: true,
            onSwiped: isLiked => {
              this.likeUnlikePerson(item, isLiked);
            }
          });
        }}
      >
        <View>
          <Image
            source={{ uri: item.picture }}
            style={{ width: itemWidth, height: itemHeight, borderRadius: 5 }}
          />
          <Badge
            value={index + 1}
            containerStyle={{ position: "absolute", bottom: 0, left: 5 }}
            badgeStyle={{
              backgroundColor: "white",
              width: 26,
              height: 26,
              borderRadius: 13
            }}
            textStyle={{ color: "#17144e", fontSize: 15, fontWeight: "bold" }}
          />
        </View>
        <View style={styles.nameAndAge}>
          <Text
            style={[styles.h2, { fontWeight: "bold" }]}
          >{`${item.name}`}</Text>
          {item.is_share_age && <Text style={styles.h2}>{`,${userService.calcAge(item.birthday)}`}</Text>}
        </View>
        <Text style={{ fontSize: 17, color: "#91919d" }}>{item.job}</Text>
      </TouchableOpacity>
    );
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={this.renderHeaderLeft}
          backgroundColor="transparent"
          centerComponent={this.renderHeaderCenter}
        />
        {this.state.peoples.length == 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 50
            }}
          >
            <Image
              source={Images.MilaIcon2}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text style={{ marginTop: 30, fontSize: 20 }}>Most Popular</Text>
          </View>
        ) : (
          <FlatList
            data={this.state.peoples}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            numColumns={2}
            ListEmptyComponent={this.ListEmptyView}
            extraData={this.state.peoples}
          />
        )}
      </View>
    );
  }

  ListEmptyView = () => {
    return (
      <View style={styles.MainContainer}>
        {/*<Text style={{textAlign: 'center'}}> Sorry, No Data Present In FlatList... Try Again.</Text>*/}
      </View>
    );
  };

  renderHeaderLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.openDrawer();
        }}
      >
        <Image source={Images.LineMenu} />
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    return (
      <Text style={{ fontSize: 21, color: "#17144e", fontWeight: "bold" }}>
        Most Popular
      </Text>
    );
  };
}

let styles = {
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    margin: 10
  },
  nameAndAge: {
    flexDirection: "row",
    marginTop: 12
  },
  h2: {
    fontSize: 17,
    color: "#17144e"
  }
};
const mapStateToProps = state => {
  return {
    dating: state.dating,
    profile: state.user.profile,
    userToken: state.startup.userToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchDiscover: url => dispatch(DatingActions.fetchDiscovering(url)),
    updateMatched: data => dispatch(DatingActions.fetchMatchedSuccess(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MostDesiredScreen);
