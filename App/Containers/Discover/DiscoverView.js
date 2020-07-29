import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { withNavigation } from "react-navigation";
import Swiper from "react-native-deck-swiper";
import { Overlay } from "react-native-elements";
import { connect } from "react-redux";

import NewTinderCard from "App/Components/Discover/newTinderCard";
import NoDiscover from "App/Components/Discover/NoDiscover";

import MatchedScreen from "./MatchedScreen";

import DatingActions from "App/Stores/Dating/Actions";

import { userService } from "App/Services/UserService";
import { sendNotification } from "App/Services/HelperServices";
import { fbService } from "App/Services/FirebaseService";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

class DiscoverView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discoverPageNum: 1,
      renderNotDiscover: false,

      matchData: null,
      isMatch: false
    };
  }

  componentDidMount() {
    console.log("discoverPageNum -> ", this.props.dating.discoverPageNum);
    this.setState({ renderNotDiscover: false });
    this.props.fetchDiscover(this.props.dating.discoverPageNum);
  }

  componentWillUnmount() {
    //this.didFocusSubscription.remove()
  }

  gotoProfile(item) {
    this.props.navigation.push("OtherProfile", {
      other: item,
      onSwiped: isLiked => {
        this.likeUnlikePersonFromDetail(item, isLiked);
      }
    });
  }

  renderCard = item => {
    return (
      <NewTinderCard
        item={item}
        onSwiped={isLiked => {
          this.likeUnlikePersonFromDetail(item, isLiked);
        }}
        swipedAllCards={() => this.onSwipedAllCards()}
      />
    );
  };

  renderNoDiscovered() {
    return <NoDiscover />;
  }

  onSwipedAllCards() {
    console.log("discoverPageNum -> ", this.props.dating.discoverPageNum);
    if (this.props.dating.canLoadMoreDiscover) {
      this.props.fetchDiscover(this.props.dating.discoverPageNum + 1);
      // this.setState({discoverPageNum:this.state.discoverPageNum+1})
      this.props.updateDiscoverNumber(this.props.dating.discoverPageNum + 1);
    } else {
      this.setState({ renderNotDiscover: true });
    }
  }

  onChat = (person, me) => {
    fbService.setFriends(me.id, person.id, res => {
      if (res) {
        this.setState({ isMatch: false });
        this.props.navigation.navigate("TodayChatDetail", {
          youInfo: person,
          meInfo: me,
          chatroom: res
        });
      }
    });
  };

  likeUnlikePersonFromDetail(likedProfile, isLiked) {
    if (isLiked) {
      setTimeout(() => {
        this.swiper.swipeRight();
      }, 500);
    } else {
      setTimeout(() => {
        this.swiper.swipeLeft();
      }, 500);
    }
    // this.likeUnlikePerson(likedProfile, isLiked)
  }

  likeUnlikePerson(likedProfile, isLiked) {
    const body = { to: likedProfile.id, status: isLiked };
    userService
      .likeUnlike(this.props.userToken.access_token, body)
      .then(response => {
        const res = response.data;
        if (isLiked) {
          if (res.is_matched) {
            console.log("THIS_CALLED");
            this.setState({ matchData: likedProfile, isMatch: true });

            userService
              .matches(this.props.userToken.access_token)
              .then(response2 => {
                console.log("Verify Match Response", response2);
                const matched = response2.data.data;
                this.props.updateMatched(matched);
              })
              .catch(err2 => {
                console.log("matches discover error -> ", err2);
              });

            fbService.sendMessage(
              "MILA",
              "All",
              "Welcome to the chat... I am sure you both will get along...",
              Math.floor(Date.now()),
              "https://matchmke.s3-ap-southeast-1.amazonaws.com/image2_tutorial%403x.png",
              res.chat_room
            );
            if (
              likedProfile.device_tokens &&
              likedProfile.device_tokens.length > 0
            ) {
              const body = {
                device_token: likedProfile.device_tokens[0].device_token,
                title: "Congratulation!",
                body: "You matched with " + this.props.profile.name,
                os_type: Platform.OS,
                date: Math.floor(Date.now())
              };

              console.log("matched notification body -> ", body);

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
        }
      })
      .catch(err => {
        console.log("send notification discover error -> ", err);
      });
  }

  onSwiped(index, isLiked) {
    //userService.likeUnlike();
    const likedProfile = this.props.dating.discovered[index];
    this.likeUnlikePerson(likedProfile, isLiked);

    // if (this.props.dating.discovered[index + 2] == null) {
    //   this.onSwipedAllCards()
    // }
  }

  render() {
    if (this.state.isMatch) {
      return (
        <Overlay isVisible={this.state.isMatch} fullScreen>
          <MatchedScreen
            closeModal={() => {
              this.setState({ isMatch: false });
            }}
            matchData={this.state.matchData}
            onChat={(person, me) => this.onChat(person, me)}
          />
        </Overlay>
      );
    }
    /*if(this.props.dating.isLoading && this.props.dating.discovered.length==0){
          return(
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
              <Pulse color="#F8F8D9" numPulses={5} diameter={400} speed={5} duration={2500} initialDiameter={200}/>
              <View style={styles.inCircle}>
                <Image source={{ uri: this.props.profile.picture }} style={styles.avatarImage} resizeMode={"cover"}/>
              </View>
            </View>
            )
        }*/
    if (this.state.renderNotDiscover) {
      this.renderNoDiscovered();
    }
    if (
      !this.props.dating.isLoading &&
      this.props.dating.errorMessage == null &&
      this.props.dating.discovered.length > 0 &&
      !this.state.renderNotDiscover
    ) {
      return (
        <Swiper
          ref={swiper => {
            this.swiper = swiper;
          }}
          backgroundColor="transparent"
          cardStyle={{ height: "100%" }}
          containerStyle={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1
          }}
          // onSwiped={() => {}/*this.onSwiped('general')*/ }
          horizontalSwipe={false}
          verticalSwipe={false}
          onSwipedLeft={index => {
            this.onSwiped(index, false);
          }}
          onSwipedRight={index => {
            this.onSwiped(index, true);
          }}
          onSwipedTop={index => {
            this.onSwiped(index, true);
          }}
          onSwipedBottom={index => {
            this.onSwiped(index, false);
          }}
          onTapCard={() => {} /*this.swipeLeft*/}
          cards={this.props.dating.discovered}
          cardIndex={this.props.dating.discoverPagedStartIndex}
          renderCard={this.renderCard}
          onSwipedAll={() => {
            this.onSwipedAllCards();
          }}
          // verticalSwipe={false}
          // horizontalSwipe={false}
          stackSize={2}
          stackSeparation={15}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          overlayLabels={{
            bottom: {
              title: "BLEAH",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }
              }
            },
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: -30
                }
              }
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: 30
                }
              }
            },
            top: {
              title: "SUPER LIKE",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }
              }
            }
          }}
          animateOverlayLabelsOpacity
          stackSeparation={0}
          animateCardOpacity
          swipeBackCard
        ></Swiper>
      );
    }
    return <NoDiscover />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  inCircle: {
    width: Dimensions.get("window").width * 0.4 + 30,
    height: Dimensions.get("window").width * 0.4 + 30,
    borderRadius: 100,
    backgroundColor: "#F8F8D9",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarImage: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.4,
    borderRadius: (Dimensions.get("window").width * 0.4) / 2
  }
});

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
    updateDiscoverNumber: num =>
      dispatch(DatingActions.updateDiscoverNumber(num)),
    updateMatched: data => dispatch(DatingActions.fetchMatchedSuccess(data))
  };
};
export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(DiscoverView)
);
