import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { withNavigation } from "react-navigation";
import { userService } from "App/Services/UserService";

import { connect } from "react-redux";
import { sendNotification } from "../../Services/HelperServices";
import { Images } from "App/Theme";

const itemWidth = Dimensions.get("window").width / 2 - 26;
const itemHeight = itemWidth * 1.11;

class PeopleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peoples: [],
      isRefreshing: false
    };
    this.willFocusSubscription;
  }

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      payload => {
        this.fetchPeopleList();
      }
    );
  }

  componentWillUnmount = () => {
    this.willFocusSubscription.remove();
  };

  fetchPeopleList = async () => {
    let peopleResponse;
    this.setState({ isRefreshing: true });
    try {
      peopleResponse = await userService.listAllLikers(
        this.props.userToken.access_token
      );
      console.log("peoplelist data -> ", peopleResponse);
      let response = peopleResponse.data.data;
      response = response.map((v, i) => {
        return v.from;
      });
      console.log("peoplelist data -> ", response);
      //this.setState({peoples:peopleResponse.data.data})
      this.setState({ peoples: response });
    } catch (err) {
      console.log("LikePeopleResponse->", err);
    }
    this.setState({ isRefreshing: false });
  };

  getCorrectName(name) {
    return name.substring(0, 10);
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
              console.log("matches error ->", err2);
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

          this.fetchPeopleList();
        }
      })
      .catch(err => {
        console.log("send notification error -> ", err);
      });
  }

  renderItem = ({ item }) => {
    return (
      <View
        style={{
          alignItems: "flex-start",
          alignSelf: "center",
          flex: 1,
          marginTop: 10
        }}
      >
        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            this.props.navigation.push("OtherUserDetail_1", {
              other: item,
              onSwiped: isLiked => {
                this.likeUnlikePerson(item, isLiked);
              }
            });
          }}
        >
          <Image
            source={{ uri: item.picture }}
            style={{ width: itemWidth, height: itemHeight, borderRadius: 5 }}
          />
          <View
            style={{
              flexDirection: "row",
              width: itemWidth,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                marginTop: 12,
                fontSize: 17,
                color: "#17144e",
                fontWeight: "bold",
                maxWidth: itemWidth - 30
              }}
            >
              {this.getCorrectName(item.name)}
            </Text>
            {item.is_share_age && 
            <Text
              style={{
                marginTop: 12,
                fontSize: 17,
                color: "#17144e",
                fontWeight: "bold"
              }}
            >{`, ${userService.calcAge(item.birthday)}`}</Text>}
          </View>

          <Text style={{ marginTop: 5, fontSize: 17, color: "#91919d" }}>
            {this.getCorrectName(item.job)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <View style={{ flex: 1, marginStart: 18 }}>
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
            <Text style={{ marginTop: 30, fontSize: 20 }}>
              Complete your Profile to get more Likes
            </Text>
          </View>
        ) : (
          <FlatList
            data={this.state.peoples}
            renderItem={this.renderItem}
            onRefresh={this.fetchPeopleList}
            refreshing={this.state.isRefreshing}
            keyExtractor={this.keyExtractor}
            numColumns={2}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    /*dating:state.dating,*/
    profile: state.user.profile,
    userToken: state.startup.userToken
  };
};

export default withNavigation(connect(mapStateToProps)(PeopleList));
