import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TextView,
  Platform,
  Alert
} from "react-native";
import {
  Bubble,
  GiftedChat,
  Send,
  InputToolbar,
  MessageImage
} from "react-native-gifted-chat";
import { Header, Icon, Avatar, Button, Overlay } from "react-native-elements";
import Spinner from "react-native-spinkit";
import { Dialogflow_V2 } from "react-native-dialogflow";
import ImagePicker1 from "react-native-image-picker";
import { connect } from "react-redux";
import { fbService } from "App/Services/FirebaseService";
import { getPhotoUrl, sendNotification, NotificationType } from "App/Services/HelperServices";
import { dialogFlowConfig } from "App/Config";
import { Images, Values } from "App/Theme";
import RedirectModal from "../../Components/Common/RedirectModal";
import ValidateModal from "../../Components/Common/ValidateModal";
import LinearGradient from "react-native-linear-gradient";
import ValidateModalView from "../../Components/Messages/validateModalView";
import ValidateConfirmedModal from "../../Components/Messages/ValidateConfirmedModal";
import { userService } from "../../Services/UserService";
import { getCorrrectName } from "App/Services/HelperServices";
import StartupActions from "App/Stores/Startup/Actions";
import AsyncStorage from "@react-native-community/async-storage";
import RNFetchBlob from "rn-fetch-blob";

Dialogflow_V2.setConfiguration(
  dialogFlowConfig.client_email,
  dialogFlowConfig.private_key,
  Dialogflow_V2.LANG_ENGLISH_US,
  dialogFlowConfig.project_id
);

const defaultLimitCount = 15;

const IMAGEMARK = "$I$M$A$G$E$M$A$R$K$";

class ChatRoomScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      imageUri: "",
      isCrop: false,
      isCropped: false,
      imageWidth: 0,
      imageHeight: 0,
      imageUriArray: [],
      imageIndex: "",
      messages: [],
      textArray: [],
      textMessage: "",
      limitCount: defaultLimitCount,
      load: false,
      msg_count: 0,
      isRedirectModal: false,
      userInfo: this.props.navigation.getParam("youInfo"),
      meInfo: this.props.navigation.getParam("meInfo"),
      isConfirmedModal: false,
      isRedirectModal_notAccept: false,
      isLoading: false
    };

    this.chatroom = this.props.navigation.getParam("chatroom");
    console.log("CHAT ROOM:", this.chatroom);
    Dialogflow_V2.setConfiguration(
      dialogFlowConfig.client_email,
      dialogFlowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogFlowConfig.project_id
    );

    this.charRoomRef = fbService.refOn(this.chatroom, this.state.limitCount);
  }

  componentDidMount() {
    this.setCurrentChatuser(this.state.userInfo.name);

    this.openChatRoomListener();
  }

  setCurrentChatuser = async name => {
    await AsyncStorage.setItem("CurrentChatUser", "" + name);
  };

  componentWillUnmount() {
    this.setCurrentChatuser("").then(r => {});
    this.charRoomRef.off();
    const refreshData = this.props.navigation.getParam("onRefreshData");
    if (refreshData) refreshData();
  }

  openChatRoomListener() {
    this.charRoomRef.on("child_added", snapshot => {
      const message = fbService.parse(snapshot);
      if (message && !message.giftUrl && !message.text) {
        return;
      }
      let newMessage;
      if (typeof message == "object") {
        if (message.messageType && message.messageType === "gift") {
          newMessage = Object.assign({ image: message.giftUrl }, message);
          if (message.text && message.text.split(":").length > 0) {
            newMessage.text = message.text.split(":")[0];
          }
        } else if (message.text && message.text.includes(IMAGEMARK)) {
          const img = message.text.replace(IMAGEMARK, "");
          newMessage = Object.assign({ image: img }, message);
          newMessage.text = "";
        } else {
          newMessage = message;
        }

        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, newMessage)
        }));

        this.state.msg_count++;
        if (this.state.msg_count >= defaultLimitCount) {
          this.state.limitCount = this.state.limitCount + defaultLimitCount;
          this.setState({
            load: true
          });
        } else {
          this.setState({
            load: false
          });
        }
        if (message.user._id === this.state.meInfo.id) {
          this.onDialogFlow(message.text);
        }
      } else {
        console.log(false);
      }
      // }
    });
  }

  loadEarlierMessages() {
    console.log("this.charRoomRef", "loading started");
    this.charRoomRef.off();
    this.charRoomRef = fbService.refOn(this.chatroom, this.state.limitCount);
    console.log("this.charRoomRef", this.charRoomRef);
    this.charRoomRef.on("child_added", snapshot => {
      const message = fbService.parse(snapshot);
      let newMessage;
      if (typeof message == "object") {
        if (message && !message.giftUrl && !message.text) {
          return;
        }

        if (message.messageType && message.messageType === "gift") {
          newMessage = Object.assign({ image: message.giftUrl }, message);
          if (message.text && message.text.split(":").length > 0) {
            newMessage.text = message.text.split(":")[0];
          }
        } else if (message.text && message.text.includes(IMAGEMARK)) {
          const img = message.text.replace(IMAGEMARK, "");
          newMessage = Object.assign({ image: img }, message);
          newMessage.text = "";
        } else {
          newMessage = message;
        }
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, newMessage)
        }));
        this.state.msg_count++;
        if (this.state.msg_count >= this.state.limitCount + defaultLimitCount) {
          this.state.limitCount = this.state.limitCount + defaultLimitCount;
          this.setState({
            load: true
          });
        } else {
          this.setState({
            load: false
          });
        }
        if (message.user._id === this.state.meInfo.id) {
          this.onDialogFlow(message.text);
        }
      } else {
        console.log(false);
      }
    });
    /*refOn(
	        message => {
	          this.setState(previousState => ({
	            messages: GiftedChat.append(previousState.messages, message)
	          }));
	        },
	        this.chatroom,
	        this.state.limitCount
	      );*/
  }

  onDialogFlow = text => {
    Dialogflow_V2.requestQuery(
      text,
      result => this.handleGoogleResponse(result),
      error => console.log("dialog flow error -> ", error)
    );
  };

  handleGoogleResponse = result => {
    let textArray = (result.queryResult.fulfillmentMessages || [{text: {text: ""}}])[0].text
      .text
      ? result.queryResult.fulfillmentMessages[0].text.text
      : [];

    if (textArray) {
      this.setState({ textArray: textArray });
    }
  };

  onSend(messages) {
    fbService.sendMessage(
      this.state.meInfo.id,
      this.state.userInfo.id,
      messages,
      Math.floor(Date.now()),
      this.state.meInfo.picture,
      this.chatroom
    );

    try {
      let text = messages[0].text;
      console.log("Sent Message = ", text);
      if (text.includes(IMAGEMARK)) {
        text = "Image Shared.";
      }

      userService.post(
        this.props.userToken.access_token,
        "last_message/" + this.state.userInfo.id,
        {
          message: text
        }
      );

      if (
        this.state.userInfo.device_tokens &&
        this.state.userInfo.device_tokens.length > 0
      ) {
        console.log("Body in ChatRoomScreen.js", body);

        const body = {
          device_token: this.state.userInfo.device_tokens[0].device_token,
          title: this.state.meInfo.name,
          body: text,
          data: {
            type: NotificationType.privateChat,
            chatRoom: this.chatroom,
          },
          os_type: Platform.OS,
          date: Math.floor(Date.now())
        };
        sendNotification(body, res => {
          console.log("Send Notification Data:", res);
        });
      }
    } catch (e) {
      console.log("send notification error -> ", e);
    }
  }

  onClickCusSend(text) {
    if (text.length === 0) {
      return;
    }

    const messages = [{ text: text }];

    this.onSend(messages);
    this.setState({
      textMessage: ""
    });
  }

  onClickImageUpload() {
    // const messages = [{ text: IMAGEMARK + "https://media.gettyimages.com/photos/studio-shot-of-young-beautiful-woman-picture-id898239824?s=612x612" }]
    // this.onSend(messages)
    this.handleCamera();
  }

  handleCamera = () => {
    let options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true,
        path: "images"
      },
      allowsEditing: false,
      maxWidth: 250,
      maxHeight: 325
    };

    ImagePicker1.showImagePicker(
      options,
      response => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          Alert.alert(
            "Alert",
            "Confirm Send?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "OK",
                onPress: () => {
                  this.setState({ isLoading: true });
                  userService
                    .uploadImageToAWS3(response.uri)
                    .then(res => {
                      this.setState({ isLoading: false });
                      RNFetchBlob.fs.unlink(response.uri).then(() => {
                        console.log("File deleted");
                      });
                      const messages = [{ text: IMAGEMARK + res }];
                      this.onSend(messages);
                    })
                    .catch(_ => {
                      this.setState({ isLoading: false });
                      RNFetchBlob.fs.unlink(response.uri).then(() => {
                        console.log("File deleted");
                      });
                    });
                }
              }
            ],
            { cancelable: false }
          );
        }
      },
      function(err) {
        console.log("show Image err: ", err);
      }
    );
  };
  onAccept = async () => {
    let p = this.state.userInfo;
    p.extraInfo = null;
    this.setState({ userInfo: p, isConfirmedModal: true });

    console.log(p);
    let result = await userService.post(
      this.props.userToken.access_token,
      "/dates/" + p.date.id
    );
    console.log(result);
    if (this.state.device_token) {
      const body = {
        device_token: this.state.device_token,
        title: this.props.profile.name,
        body:
          this.props.profile.name + " would like to go on at date with you.",
        os_type: Platform.OS,
        date: Math.floor(Date.now())
      };
      sendNotification(body, res => {
        console.log("Send Notification Data:", res);
      });
    }
  };
  onDate = date => {
    const info = this.state.userInfo;
    info.extraInfo = null;
    this.setState({ userInfo: info });
    // date.to = this.state.youItem.id;
    userService
      .post(this.props.userToken.access_token, "/dates", {
        to: this.state.userInfo.id,
        ...date
      })
      .then(res => {
        this.setState({
          isRedirectModal: true,
          image: 1,
          confirmedTitle: "Nice One!",
          confirmedText: `The invite is on its way to ${this.state.userInfo.name}!`
        });

        fbService.setAskedMatch(
          this.state.meInfo.id,
          this.state.userInfo.id,
          () => {
            {
            }
          }
        );
        if (
          this.state.userInfo.device_tokens &&
          this.state.userInfo.device_tokens.length > 0
        ) {
          const body1 = {
            device_token: this.state.userInfo.device_tokens[0].device_token,
            title: this.state.meInfo.name,
            body:
              this.state.meInfo.name + " would like to go on at date with you.",
            os_type: Platform.OS,
            date: Math.floor(Date.now())
          };
          sendNotification(body1, res => {
            console.log("Send Notification Data:", res);
          });
        }
      })
      .catch(error => {
        console.log("date error =>", error);
      });
  };

  renderNoActivityModal() {
    const successMsg =
      "Psst. I think it’s time to\n take things up a notch\n and ask ‘A/B’ out !";
    return (
      <View>
        <Image
          source={Images.Image02}
          style={{
            width: 130,
            height: 130,
            marginTop: 10,
            alignSelf: "center"
          }}
          resizeMode="contain"
        />
        <Text style={styles.noActivityText}>{successMsg}</Text>
        <Button
          title="I think so too!"
          titleStyle={{ fontSize: 16, fontWeight: "bold" }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#4a46d6", "#964cc6"],
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 }
          }}
          loading={this.state.loading}
          buttonStyle={{ borderRadius: 30 }}
          onPress={() => {
            this.state.userInfo.extraInfo = null;
            this.setState({ userInfo: this.state.userInfo });
          }}
          containerStyle={{
            marginTop: 25,
            marginBottom: 10,
            width: 250,
            alignSelf: "center"
          }}
        />
      </View>
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={this.header_left}
          centerComponent={this.header_center}
          rightComponent={this.header_right}
          backgroundColor="#f9f9f9"
        />
        <GiftedChat
          ref={ref => {
            this.chatroomRef = ref;
          }}
          messages={this.state.messages}
          text={this.state.textMessage}
          onSend={messages => this.onSend(messages)}
          renderChatFooter={() => this.renderFooter(this.state.textArray)}
          loadEarlier={this.state.load}
          bottomOffset={10}
          renderLoading={() => {
            return (
              <Spinner
                style={{ marginTop: 50 }}
                isVisible={false}
                type="Circle"
                color="#3cb9fc"
              />
            );
          }}
          onLoadEarlier={() => {
            this.setState({
              messages: []
              // limitCount: this.state.limitCount + defaultLimitCount
            });
            this.loadEarlierMessages();
          }}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  left: {
                    backgroundColor: "#efefef"
                  },
                  right: {
                    backgroundColor: "#B537F2"
                  }
                }}
              />
            );
          }}
          onInputTextChanged={text => this.setState({ textMessage: text })}
          scrollToBottom={true}
          showUserAvatar={false}
          alwaysShowSend={true}
          renderMessageImage={props => {
            if (
              props.currentMessage.messageType != null &&
              props.currentMessage.messageType === "gift"
            ) {
              return (
                <MessageImage
                  {...props}
                  imageStyle={{
                    borderRadius: 30,
                    paddingHorizontal: 28,
                    resizeMode: "contain",
                    borderWidth: 2,
                    borderColor: "#3cb9fc",
                    width: 60,
                    height: 60
                  }}
                />
              );
            } else {
              return (
                <MessageImage
                  {...props}
                  imageStyle={{
                    borderWidth: 2,
                    borderColor: "#3cb9fc",
                    width: Dimensions.get("window").width - 80,
                    height: Dimensions.get("window").width - 180
                  }}
                />
              );
            }
          }}
          renderInputToolbar={props => {
            if (Platform.OS === "android") {
              return (
                <View style={{ flex: 1 }}>
                  <InputToolbar
                    {...props}
                    placeholder="Write a message..."
                    containerStyle={{
                      paddingTop: 3,
                      marginLeft: 10,
                      marginRight: 60,
                      marginBottom: 2,
                      paddingLeft: 10,
                      borderWidth: 1,
                      borderTopWidth: 1,
                      borderColor: "#3cb9fc",
                      borderRadius: 25,
                      borderTopColor: "#3cb9fc"
                    }}
                  ></InputToolbar>
                  <TouchableOpacity
                    activeOpacity={1.0}
                    style={{
                      flexDirection: "row",
                      end: 10,
                      bottom: 6,
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 90,
                      position: "absolute"
                    }}
                  >
                    <TouchableOpacity
                      style={{ marginRight: 20 }}
                      onPress={() => {
                        this.onClickImageUpload();
                      }}
                    >
                      <Image source={Images.ic_camera} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginRight: 0 }}
                      onPressIn={() => {
                        this.onClickCusSend(props.text);
                      }}
                    >
                      <Text
                        style={{
                          color: "#3cb9fc",
                          fontWeight: "500",
                          fontSize: 17
                        }}
                      >
                        SEND
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              );
            } else {
              return (
                <InputToolbar
                  {...props}
                  placeholder="Write a message..."
                  containerStyle={{
                    paddingTop: 3,
                    marginLeft: 10,
                    marginRight: 60,
                    paddingLeft: 10,
                    borderWidth: 2,
                    borderTopWidth: 2,
                    borderColor: "#3cb9fc",
                    borderRadius: 25,
                    borderTopColor: "#3cb9fc"
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={1.0}
                    style={{
                      flexDirection: "row",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 90
                    }}
                  >
                    <TouchableOpacity
                      style={{ marginRight: 20 }}
                      onPress={() => {
                        this.onClickImageUpload();
                      }}
                    >
                      <Image source={Images.ic_camera} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginRight: -120 }}
                      onPress={() => {
                        this.onClickCusSend(props.text);
                      }}
                    >
                      <Text
                        style={{
                          color: "#3cb9fc",
                          fontWeight: "600",
                          fontSize: 17
                        }}
                      >
                        SEND
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </InputToolbar>
              );
            }
          }}
          renderSend={props => {
            return (
              <View>
                {Platform.OS === "android" ? (
                  <Send
                    {...props}
                    containerStyle={{ marginRight: 6, marginBottom: 3 }}
                  >
                    <Text></Text>
                  </Send>
                ) : (
                  <Send
                    {...props}
                    containerStyle={{ marginRight: 6, marginBottom: 3 }}
                  >
                    {/* <Text></Text> */}
                  </Send>
                )}
              </View>
            );
          }}
          user={{
            _id: this.state.userInfo.id
          }}
        />

        <View style={{ width: "100%", height: 5 }}></View>

        <Overlay
          width="auto"
          height="auto"
          overlayStyle={{ padding: 30 }}
          isVisible={this.state.isLoading}
          borderRadius={15}
        >
          <Spinner type="Circle" color="#3cb9fc" />
        </Overlay>

        <Overlay
          isVisible={this.state.userInfo.extraInfo === "no_activity"}
          width="auto"
          height="auto"
          borderRadius={14}
          overlayStyle={{ padding: 30 }}
        >
          {this.renderNoActivityModal()}
        </Overlay>
        <RedirectModal
          modalVisible={this.state.isRedirectModal}
          title={this.state.confirmedTitle}
          text={this.state.confirmedText}
          image={this.state.image}
          onPress={_ => {
            this.setState({
              isRedirectModal: false
            });
          }}
        />
        <ValidateModal
          modalVisible={this.state.userInfo.extraInfo === "date_time"}
          photo={this.state.userInfo.picture}
          name={this.state.userInfo.name}
          placeName=""
          placeAddress=""
          placeUrl=""
          onCancel={() => {
            let p = this.state.userInfo;
            p.extraInfo = null;
            this.setState({
              image: 0,
              confirmedTitle: "No Pressure!",
              confirmedText:
                "But don’t wait too long, nothing beats an actual meeting to gauge the chemistry",
              isAskDateModal: false,
              isRedirectModal: true,
              userInfo: p
            });
          }}
          onRequest={date => this.onDate(date)}
        />
        <ValidateModalView
          modalVisible={this.state.userInfo.extraInfo === "asking_date"}
          userName={this.state.userInfo.name}
          date={this.state.userInfo.date}
          onCancel={() => {
            let p = this.state.userInfo;
            p.extraInfo = null;
            this.setState({ userInfo: p, isRedirectModal_notAccept: true });
          }}
          onAccept={() => {
            this.onAccept().then(_ => {});
          }}
        />

        <RedirectModal
          modalVisible={this.state.isRedirectModal_notAccept}
          title={"Got It! But Don’t\nWait too Long"}
          text={"nothing beats an actual meeting to gauge the chemistry"}
          image={0}
          onPress={_ => {
            this.setState({
              isRedirectModal_notAccept: false
            });
          }}
        />

        <ValidateConfirmedModal
          modalVisible={this.state.isConfirmedModal}
          photo=" "
          name=" "
          placeAddress={
            ((this.state.userInfo.date || "").hangout || "")
              .formatted_address || ""
          }
          date={(this.state.userInfo.date || "").date || ""}
          onOK={() => {
            this.setState({
              isConfirmedModal: false
            });
          }}
        />
      </View>
    );
  }

  renderFooter = array => {
    if (array.length > 0) {
      return (
        <View style={styles.controlBox}>
          <View style={styles.recommendHeader}>
            <Image style={styles.recommendImage} source={Images.Image02} />
          </View>
          <View>
            <Text style={styles.recommendTitle}>M.I.L.A suggests:</Text>
            <ScrollView horizontal style={{ marginLeft: 5 }}>
              {array.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dialogFlowButton}
                  onPress={() => this.setState({ textMessage: item })}
                >
                  <Text style={styles.dialogFlowText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  header_left = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.goBack(null);
        }}
      >
        <View style={styles.headerLeftText}>
          <Icon type="ionicon" name="ios-arrow-back" size={25} color="black" />
        </View>
      </TouchableOpacity>
    );
  };

  header_center = () => {
    console.log("Other User Info=", this.state.userInfo);
    return (
      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => {
            this.props.navigation.push("OtherUserDetail_2", {
              other: this.state.userInfo,
              onSwiped: null
            });
          }}
        >
          <Avatar
            source={{ uri: this.state.userInfo.picture }}
            size="small"
            rounded
          />
          <View
            style={{
              width: Dimensions.get("window").width - 130,
              marginLeft: 10,
              justifyContent: "center"
            }}
          >
            <Text style={styles.headerCenterText}>
              {getCorrrectName(this.state.userInfo.name)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  header_right = () => {
    return (
      <TouchableOpacity>
        <Text style={styles.headerLeftText} />
      </TouchableOpacity>
    );
  };
}

const mapStateToProps = state => {
  return {
    profile: state.user.profile,
    userToken: state.startup.userToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentChatUser: data =>
      dispatch(StartupActions.updateCurrentChatUser(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomScreen);

let styles = {
  controlBox: {
    // width: Dimensions.get("window").width,
    // borderColor: "#078582",
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
    flexDirection: "row",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#def4ff"
  },
  recommendImage: {
    width: 40,
    height: 40,
    marginLeft: 6,
    marginTop: 6,
    borderRadius: 20
  },
  headerLeftText: {
    marginLeft: 10,
    fontSize: 16
  },
  headerCenterText: {
    width: Dimensions.get("window").width - 100,
    fontSize: 18,
    fontWeight: "600"
  },
  dialogFlowText: {
    color: "#3cb9fc",
    maxWidth: Dimensions.get("window").width - 120
  },
  recommendTitle: {
    color: "#17744e",
    fontFamily: "ProximaNova-Bold",
    fontWeight: "500",
    fontSize: 18,
    marginHorizontal: 10
  },
  dialogFlowButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    margin: 5,
    borderColor: "#3cb9fc",
    borderRadius: 20
  },
  inputToolbar: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 25
  },
  noActivityText: {
    color: "#17144e",
    fontWeight: "bold",
    fontSize: 26,
    textAlign: "center",
    marginTop: 30
  }
};
