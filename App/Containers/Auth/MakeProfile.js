import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { Header, Icon } from "react-native-elements";

import ProfileFirst from "App/Components/Profile/ProfileFirst";
import ProfileSecond from "App/Components/Profile/ProfileSecond";
import ProfileThird from "App/Components/Profile/ProfileThird";
import ProfileFourth from "App/Components/Profile/ProfileFourth";
import ProfileFinish from "../../Components/Profile/ProfileFinish";
import StartupActions from "App/Stores/Startup/Actions";
import { connect } from "react-redux";
import { userDetails, DBServices } from 'App/realm';

let dots = Array.from({ length: 5 }, (v, i) => 0);

class MakeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      dob: "",
      height: "",
      body_type: "",
      job: "",
      education: "",
      gender: "",
      looking_gender: "",
      age_from: "",
      age_to: "",
      profile_image: "",
      email: "",
      pageIndex: 0,
      facebook_id: ""
    };
  }

  componentDidMount() {
    const fb_id = this.props.navigation.getParam("facebookID", null);
    const name = this.props.navigation.getParam("facebookName", null);
    const email = this.props.navigation.getParam("facebookEmail", null);
    this.setState({ facebook_id: fb_id, name, email });
  }

  onBack() {
    if (this.state.pageIndex === 0) {
      this.props.navigation.goBack(null);
      return;
    }

    if (this.state.pageIndex === 3) {
      this.setState({profile_image: "", profile_image_b64: ""});
    }

    this.setState(
      {
        pageIndex: this.state.pageIndex - 1
      },
      () => {
        this.viewpager.scrollBy(-1, true);
      }
    );

    if (this.state.pageIndex === 3) {
      this.props.setPageIndex(0);
    }
  }

  onNext = items => {
    // console.log("items", items)
    if (this.state.pageIndex === 0) {
      const {
        name,
        birthday,
        height,
        body_type,
        job_title,
        education,
        email
      } = items;
      this.setState(
        {
          name,
          birthday,
          height,
          body_type,
          job: job_title,
          education,
          email,
          pageIndex: this.state.pageIndex + 1
        },
        () => {
          console.log(this.state.pageIndex + ": page loaded");
          this.viewpager.scrollBy(1, true);
        }
      );
    } else if (this.state.pageIndex === 1) {
      const { gender, interest_gender, age_from, age_to } = items;
      this.setState(
        {
          gender,
          interest_gender,
          age_from,
          age_to,
          pageIndex: this.state.pageIndex + 1
        },
        () => {
          console.log(this.state.pageIndex + ": page loaded");
          this.viewpager.scrollBy(1, true);
        }
      );

      setTimeout(() => {
        this.props.setCameraStatus(true);
      }, 500);
    } else if (this.state.pageIndex === 2) {
      let { profile_image, profile_image_b64 } = items;
      this.setState(
        {
          profile_image: profile_image,
          profile_image_b64: profile_image_b64,
          pageIndex: this.state.pageIndex + 1
        },
        () => {
          console.log(this.state.pageIndex + ": page loadedaa");
          setTimeout(() => {
            // console.log(this.state.profile_image);
            this.viewpager.scrollBy(1, true);
          }, 1000);
        }
      );
      this.props.setPageIndex(1);
    } else if (this.state.pageIndex === 3) {
      if (items) {
        this.setState({ pageIndex: this.state.pageIndex + 1 }, () => {
          console.log(this.state.pageIndex + ": page loadedaaa");
          this.viewpager.scrollBy(1, true);
        });
      } else {
        setTimeout(() => {
          const phone_number = this.props.navigation.getParam("phoneNumber");
          let profile = { ...this.state, phone_number };
          this.props.navigation.navigate("ChooseQuestion", {
            profile: profile
          });
        }, 200);
      }
    } else if (this.state.pageIndex === 4) {
      let { face_verified } = items;
      if (face_verified) {
        this.setState({ face_verified: face_verified }, () => {
          setTimeout(() => {
            const phone_number = this.props.navigation.getParam("phoneNumber");
            let profile = { ...this.state, phone_number };
            profile.face_verified = face_verified;
            // console.log("new profile", profile);
            this.props.navigation.navigate("ChooseQuestion", {
              profile: profile
            });
          }, 200);
        });
      } else {
        // this.viewpager.scrollBy(-1, true);
        this.setState({ pageIndex: this.state.pageIndex - 1 }, () => {
          console.log(this.state.pageIndex + ": page loaded");
          this.viewpager.scrollBy(-1, true);
        });
      }
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        <Header
          backgroundColor="transparent"
          leftComponent={this.header_left}
          centerComponent={this.renderCenterDots}
        />
        <Swiper
          ref={ref => (this.viewpager = ref)}
          showsPagination={false}
          pagingEnabled={false}
          scrollEnabled={false}
          loop={false}
        >
          <View>
            <ProfileFirst onNext={this.onNext} />
          </View>
          <View>
            <ProfileSecond onNext={this.onNext} />
          </View>
          <View>
            <ProfileThird onNext={this.onNext} />
          </View>
          <View>
            <ProfileFinish
              image={this.state.profile_image ?? ""}
              onNext={this.onNext}
            />
          </View>
          <View>
            <ProfileFourth
              image={this.state.profile_image_b64 ?? ""}
              onNext={this.onNext}
            />
          </View>
        </Swiper>
      </View>
    );
  }

  renderCenterDots = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        {dots.map((v, i) => {
          let backgroundColor =
            i === this.state.pageIndex ? "#3cb9fc" : "#d6d6d6";
          return (
            <View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: backgroundColor,
                marginRight: 5
              }}
            />
          );
        })}
      </View>
    );
  };

  header_left = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.onBack();
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
}

let styles = {
  headerLeftText: {
    color: "#17144e"
  }
};

const mapStateToProps = state => {
  return {
    userToken: state.startup.userToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCameraStatus: data => dispatch(StartupActions.updateCameraState(data)),
    setPageIndex: data => dispatch(StartupActions.updatePageIndex(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MakeProfile);
