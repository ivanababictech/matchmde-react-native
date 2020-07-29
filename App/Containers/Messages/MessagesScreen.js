import React, { Component } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { Button, ListItem, Overlay, Avatar } from "react-native-elements";
import { withNavigation } from "react-navigation";
import { EventRegister } from "react-native-event-listeners";
import DatingActions from "App/Stores/Dating/Actions";
import { connect } from "react-redux";

import { Images } from "App/Theme";
import { fbService } from "App/Services/FirebaseService";
import { userService } from "App/Services/UserService";
import GiftReceiveModal from "../../Components/Messages/GiftReceiveModal";
import { getCorrrectName } from "App/Services/HelperServices";

const IMAGEMARK = "$I$M$A$G$E$M$A$R$K$";

class MessagesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminLastMsg: null,
      isModal: false,
      dateUser: {},
      peoples: [],
      chatList: [],
      value2: null,
      extraData: true,
      isRefreshing: false,
      gift: {},
      unMatchedGift: []
    };
    this.adminMessageRef = fbService.adminNotifyLastRef();

    console.log("Entered To Chat List Page");
  }

  handleRefresh = async () => {
    // this.setState({
    // 	isRefreshing: true
    // });
    console.log("refresh");
    this.adminMessageRef.off();

    this.adminMessageRef = fbService.adminNotifyLastRef();

    await this.loadDataBase();
  };

  keyExtractor = (item, index) => index.toString();

  UNSAFE_componentWillUpdate() {
    console.log("will update");
  }

  UNSAFE_componentWillReceiveProps() {
    console.log("will receive props");
  }

  async componentDidMount() {
    this.listener = EventRegister.addEventListener("ChatMounted", () => {
      console.log("Chat Mounted");
      this.loadDataBase();
    });
  }

  async loadDataBase() {
    this.adminMessageRef.on("child_added", snapshot => {
      this.setState({
        adminLastMsg: snapshot.val(),
        extraData: !this.state.extraData
      });
    });

    let peopleResponse;
    let timeResponse;
    let unMatchedGiftResp;
    try {
      peopleResponse = await userService.listAllMatchers(
        this.props.userToken.access_token
      );
      unMatchedGiftResp = await userService.get_request(
        this.props.userToken.access_token,
        "/gifts/get_gifts_unmatched"
      );
      timeResponse = await userService.getServerTimestamp();
      // console.log("DATAAAAA", peopleResponse, unMatchedGiftResp);
      let currentTime = timeResponse.data.time;
      const friends = [];
      if (unMatchedGiftResp.data[0]) {
        // this.setState({unMatchedGift : unMatchedGiftResp.data.filter(map => {
        // 		const unMatch = peopleResponse.data.data.filter(t => {
        // 			const friendID = this.props.profile.id === t.to.id ? t.from.id : t.to.id;
        // 			return friendID === map.from.id;
        // 		});
        // 		return !unMatch
        // 	})});
        this.setState({
          unMatchedGift: unMatchedGiftResp.data
        });
      }
      console.log(peopleResponse.data);
      peopleResponse.data.data.map(map => {
        let period = currentTime - Date.parse(map.created_at) / 1000;
        const friend =
          map.from.id === this.props.profile.id ? map.to : map.from;
        const match_feedback =
          map.from.id === this.props.profile.id
            ? map.match_feedback_from
            : map.match_feedback_to;
        const date_feedback =
          map.from.id === this.props.profile.id
            ? map.date_feedback_from
            : map.date_feedback_to;
        const date = map.date ?? "";
        console.log("match:", map);
        if (map.is_new) {
          friend.message = "You're matched";
          friend.extraInfo = "Start a Chat!";
          // if (map.from.id === this.props.profile.id) {
          //   friend.message = "You sent a Gift";
          //   friend.extraInfo = "received_gift";
          //   friend.gift = map.is_new;
          // } else {
          //   friend.message = "Sent you a Gift";
          //   friend.extraInfo = "received_gift";
          //   friend.gift = map.is_new;
          // }
        } else if (map.message_count_total < 1 && period > 24 * 3600) {
          friend.message = "Start a Chat!";
          friend.extraInfo = "no_activity";
        } else if (
          map.message_count_from > 0 &&
          map.message_count_to > 0 &&
          map.message_count_total > 29 &&
          !match_feedback &&
          period > 48 * 3600
        ) {
          friend.message = "Match Feedback";
          friend.extraInfo = "match_feedback";
        } else if (
          map.message_count_from > 9 &&
          map.message_count_to > 9 &&
          map.message_count_total > 39 &&
          period > 72 * 3600 &&
          !date
        ) {
          friend.message = "Time for a Date!";
          friend.extraInfo = "date_time";
        } else if (date && !date.is_accepted) {
          friend.message = "Wants to Date!";
          friend.extraInfo = "asking_date";
          friend.date = date;
        } else if (
          !date_feedback &&
          currentTime - Date.parse(date.updated_at) / 1000 > 12 * 3600
        ) {
          friend.message = "Date Feedback";
          friend.extraInfo = "date_feedback";
        } else {
          friend.message = map.last_message;
          friend.extraInfo = null;
        }
        friends.push(friend);
      });
      console.log("Chat List=", friends);
      this.setState({ chatList: friends });
    } catch (err) {
      console.log("get last msg error -> ", err);
    }
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
    this.adminMessageRef.off();
  }
  onChat = (person, me) => {
    if (person.extraInfo === "match_feedback") {
      this.props.navigation.navigate("MatchRating", {
        youInfo: person,
        meInfo: me,
        onRefreshData: this.handleRefresh
      });
      return;
    }
    if (person.extraInfo === "date_feedback") {
      this.props.navigation.navigate("DateRating", {
        youInfo: person,
        meInfo: me,
        onRefreshData: this.handleRefresh
      });
      return;
    }
    if (person.extraInfo === "received_gift") {
      userService.put(
        this.props.userToken.access_token,
        "/gifts/mark_as_read/" + person.gift.id
      );
    }
    fbService.setFriends(me.id, person.id, res => {
      if (res) {
        this.props.navigation.navigate("TodayChatDetail", {
          youInfo: person,
          meInfo: me,
          chatroom: res,
          onRefreshData: this.handleRefresh
        });
      }
    });
  };

  getCorrectMSG(msg) {
    if (msg === null || msg === "") {
      return "";
    }
    if (msg.includes(IMAGEMARK)) {
      return "Image Shared";
    }
    if (msg.length > 30) {
      return msg.substring(0, 30) + "...";
    }
    return msg;
  }

  renderItem = ({ item }) => {
    if (item === "admin") {
      const { adminLastMsg } = this.state;
      return (
        <ListItem
          key={"admin" + adminLastMsg.timestamp}
          title="MatchMde"
          titleStyle={{ fontSize: 17, color: "#17144e", fontWeight: "bold" }}
          subtitle={this.getCorrectMSG(adminLastMsg.content)}
          // leftAvatar={{ source: Images.milahearts }}
          leftAvatar={
            <Image
              source={Images.ic_milahearts}
              style={{ width: 45, height: 45 }}
            />
          }
          bottomDivider
          onPress={() => {
            this.props.navigation.push("AdminChat", {
              onRefreshData: this.handleRefresh
            });
          }}
          containerStyle={{ backgroundColor: "#def4ff", height: 60 }}
        />
      );
    } else if (item === "gift") {
      const { unMatchedGift } = this.state;
      return unMatchedGift.map(gift => (
        <ListItem
          key={"gift" + gift.id}
          title={gift.from.name}
          titleStyle={{ fontSize: 17, color: "#17144e", fontWeight: "bold" }}
          subtitle={"Sent a gift"}
          leftAvatar={{ source: { uri: gift.from.picture } }}
          bottomDivider
          onPress={() => {
            this.setState({ isModal: true, gift: gift });
          }}
          containerStyle={
            !gift.is_read
              ? { backgroundColor: "#f5e3fd", height: 60 }
              : { backgroundColor: "white", height: 60 }
          }
        />
      ));
    } else if (item === "chat") {
      console.log("MessageScreen.js=", "chat");
      return this.state.chatList.map(e => {
        let msg = e.message;

        return (
          <ListItem
            key={"chat" + e.id}
            title={getCorrrectName(e.name)}
            titleStyle={{ fontSize: 17, color: "#17144e", fontWeight: "bold" }}
            subtitle={this.getCorrectMSG(msg)}
            subtitleStyle={{
              color: e.extraInfo === null ? "#17144e" : "#3cb9fc"
            }}
            leftAvatar={{ source: { uri: e.picture } }}
            bottomDivider
            onPress={() => this.onChat(e, this.props.profile)}
            containerStyle={{ backgroundColor: "#fff", height: 60 }}
          />
        );
      });
    } else {
      <View></View>;
    }
  };

  renderMessageHeaderItem = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          backgroundColor: "#f9f9f9"
        }}
      >
        <Image source={Images.Image02} style={{ width: 39, height: 39 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ color: "#17144e", fontSize: 17 }}>M.I.L.A</Text>
          <Text style={{ color: "#91919d", fontSize: 13 }}>
            {"Welcome to MatchMde! Find your messages from \nM.I.L.A here"}
          </Text>
        </View>
      </View>
    );
  };

  likeUnlikePerson(likedProfile, isLiked) {
    if (likedProfile.id) {
      const body = { to: likedProfile.id, status: true };
      userService
        .likeUnlike(this.props.userToken.access_token, body)
        .then(response => {
          const res = response.data;
          this.loadUsers();

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
        })
        .catch(err => {
          console.log("likeUnlike error -> ", err);
        });
    }
  }

  render() {
    let { peoples } = this.state;
    peoples = ["chat", ...peoples];
    if (this.state.dateLastMsg) peoples = ["date", ...peoples];
    if (this.state.unMatchedGift) peoples = ["gift", ...peoples];
    if (this.state.adminLastMsg) peoples = ["admin", ...peoples];

    if (this.props.profile.face_verified) {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={peoples}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            extraData={this.state.extraData}
            onRefresh={this.handleRefresh}
            refreshing={this.state.isRefreshing}
          />
          <Overlay
            isVisible={this.state.isModal}
            width="auto"
            height="auto"
            onBackdropPress={() => this.setState({ isModal: false })}
          >
            <GiftReceiveModal
              image={this.state.gift.giftUrl}
              text={this.state.gift.message}
              senderID={(this.state.gift.from || "").id}
              onCancel={() => this.setState({ isModal: false })}
              onSend={(meInfo, youInfo) => {
                if (youInfo.id) {
                  this.props.navigation.push("OtherProfile", {
                    other: youInfo,
                    onSwiped: isLiked => {
                      this.likeUnlikePerson(youInfo, isLiked);
                    }
                  });
                } else {
                  this.setState({ isModal: false });
                }
              }}
              isLoading={this.state.isLoading}
            />
          </Overlay>
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 28,
              marginLeft: 20,
              marginRight: 20,
              textAlign: "center"
            }}
          >
            {"Verify your photo to access this screen"}
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginLeft: 20,
              marginRight: 20,
              textAlign: "center",
              marginTop: 20
            }}
          >
            {"Go to Profile -> Verify Account -> Verify Photo"}
          </Text>
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    profile: state.user.profile,
    userToken: state.startup.userToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateMatched: data => dispatch(DatingActions.fetchMatchedSuccess(data))
  };
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(MessagesScreen)
);

/*refreshing={this.state.isRefreshing}
onRefresh={()=>{ this.fetchInitialMessages() }}
async fetchInitialMessages(){
		this.setState({isRefreshing:true})
		let peopleResponse;
		try{
			peopleResponse = await userService.listAllMatchers(this.props.userToken.access_token)
			let matches = peopleResponse.data.data.map((v,i)=>v.from)

			let contact = matches.filter(v=>v.id!==this.props.profile.id)

			const contactFetchPromises = contact.map((v)=>fbService.getChatRooms(this.props.profile, v) )
			const myContact = await Promise.all(contactFetchPromises);

			const lastMsgFetchPromise = myContact.map((v)=>v.chatRoom?fbService.getLastMsg(v):{...v, lastMsg:null})

			const improvedContact = await Promise.all(lastMsgFetchPromise);
			this.setState({peoples:improvedContact})
		}catch(err){

		}
		this.setState({isRefreshing:false})
	}*/
let styles = {
  noActivityText: {
    color: "#17144e",
    fontWeight: "bold",
    fontSize: 26,
    textAlign: "center",
    marginTop: 30
  }
};
