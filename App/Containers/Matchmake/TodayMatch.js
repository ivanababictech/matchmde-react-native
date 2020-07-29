import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { withNavigation } from "react-navigation";

import { userService } from "App/Services/UserService";
import { Images } from "App/Theme";
import { connect } from "react-redux";
import { fbService } from "App/Services/FirebaseService";
import { sendNotification } from "../../Services/HelperServices";
import UserActions from "App/Stores/User/Actions";

const itemWidth = Dimensions.get("window").width / 2 - 20;
const itemHeight = itemWidth * 1.11;

class TodayMatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      users: [],
      isRefreshing: false
    };
  }

  loadUsers = async () => {
    let peopleResponse;
    try {
      peopleResponse = await userService.get_request(
        this.props.userToken.access_token,
        "/suggest_matches"
      );
      let matched = peopleResponse.data;
      this.props.updateTodayMatch(matched);
      // this.setState({ users: matched, isRefreshing: false });
    } catch (err) {
      console.log("today matches err -> ", err);
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        isRefreshing: false
      },
      () => {
        this.loadUsers();
      }
    );
  };

  handleLoadMore = () => {
    // this.setState({
    // 	page: this.state.page + 1
    // }, () => {
    // 	this.loadUsers();
    // });
  };

  async componentDidMount() {
    this.loadUsers();
  }

  onChat = (person, me) => {
    fbService.setFriends(me.id, person.id, res => {
      if (res) {
        this.props.navigation.navigate("TodayChatDetail", {
          youInfo: person,
          meInfo: me,
          chatroom: res
        });
      }
    });
  };

  likeUnlikePerson(likedProfile, isLiked) {
    const body = { to: likedProfile.id, status: true };
    console.log("Token", this.props.userToken.access_token, "  body=", body);
    userService
      .likeUnlike(this.props.userToken.access_token, body)
      .then(response => {
        const res = response.data;
        this.loadUsers();

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
              console.log("matches todayMatch error -> ", err2);
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
        console.log("likeUnlike error -> ", err);
      });
  }

  gotoProfile(item) {
    this.props.navigation.push("OtherProfile", {
      other: item,
      onSwiped: isLiked => {
        this.likeUnlikePerson(item, isLiked);
      }
    });
  }

  renderItem = ({ item }) => {
    return (
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flex: 1,
          marginTop: 4,
          marginBottom: 0,
          marginStart: 10
        }}
      >
        <TouchableOpacity
          // onPress={() => this.onChat(item, this.props.profile)}
          onPress={() => this.gotoProfile(item)}
          style={{ alignItems: "center" }}
        >
          <Image
            source={{ uri: item.picture }}
            style={{ width: itemWidth, height: itemHeight, borderRadius: 5 }}
          />
          <View style={styles.itemMiddleView}>
            <Text
              style={{
                fontSize: 17,
                color: "#17144e",
                fontWeight: "bold",
                textAlign: "center"
              }}
            >{`${item.name}`}</Text>
            {item.is_share_age && <Text
              style={{ fontSize: 17, color: "#17144e" }}
            >{`, ${userService.calcAge(item.birthday)}`}</Text>}
          </View>
          <Text style={{ marginTop: 2, fontSize: 17, color: "#91919d" }}>
            {item.job}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  ListEmptyView = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={Images.MilaIcon2}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
        <Text style={{ marginTop: 30, fontSize: 20 }}>Introductions</Text>
      </View>
    );
  };

  renderListHeader = () => {
    return (
      // <View style={{flexDirection:'row', alignItems:'center', height:67, backgroundColor:'#def4ff', paddingLeft:15}}>
      // 	<Image source={Images.Image02} style={{width:45, height:45}}/>
      // 	<Text style={{color:'#17144e', fontSize:17, marginLeft:10}}>Your Matches for Today</Text>
      // </View>
      null
    );
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    const { isRefreshing } = this.state;
    const users = this.props.todayMUsers;
    console.log("Today Match users -> ", this.props.todayMUsers);
    if (!isRefreshing && (users === null || users.length === 0)) {
      return this.ListEmptyView();
    } else {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={users}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            numColumns={2}
            refreshing={isRefreshing}
            onRefresh={this.handleRefresh}
            onEndReached={this.handleLoadMore}
            onEndThreshold={0}
            ListHeaderComponent={this.renderListHeader}
          />
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    profile: state.user.profile,
    userToken: state.startup.userToken,
    todayMUsers: state.user.todayMUsers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTodayMatch: data => dispatch(UserActions.fetchIntroduction(data))
  };
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(TodayMatch)
);

const styles = StyleSheet.create({
  itemMiddleView: {
    marginTop: 0,
    flexDirection: "row",
    width: itemWidth,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});
