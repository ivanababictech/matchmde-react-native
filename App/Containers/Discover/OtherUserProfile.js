import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image, ScrollView, Alert } from 'react-native'
import { Header, Icon, Button, Divider, Badge, Overlay } from 'react-native-elements'
import * as i18nIsoCountries from 'i18n-iso-countries'

import { Images } from 'App/Theme'
import { userService } from 'App/Services/UserService'

import Entypo from "react-native-vector-icons/Entypo"

import { connect } from 'react-redux'
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

import Swiper from 'react-native-swiper'
import { getCorrrectName } from 'App/Services/HelperServices'
import ReportModal from 'App/Components/Report/ReportModal'
import ReportSuccessModal from 'App/Components/Report/ReportSuccessModal'

i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));

class OtherUserProfile extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            otherUser: this.props.navigation.getParam('other'),
            pictureUrls: [],
            fullscreenMode: false,
            pageIndex: 0,
            otherUserRate: [],
            isMatched: false,
            isReportModal: false,
            isReportSuccessModal: false,
            isLikeCard: false,
            isPassCard: false,
        };

        if (this.state.otherUser.photos == null || this.state.otherUser.photos.length === 0) {
            this.state.pictureUrls.push(this.state.otherUser.picture)
        } else {
            this.state.otherUser.photos.map((item) => (
                this.state.pictureUrls.push(item.url)
            ))
        }
    }

    componentDidMount() {
        userService.get_request(this.props.userToken.access_token, `/match_rate/${this.state.otherUser.id}`)
            .then(res => {

                this.setState({
                    otherUserRate: res.data
                })

            }).catch(err => {
                console.log("match_rate other user profile error -> ", err)
            });

        const isMatched = this.props.navigation.getParam("isMatched")
        console.log("isMatched -> ", isMatched);

        if (isMatched != null) {
            this.setState({ isMatched: false });
        } else {
            console.log("matches result -> soon")
            userService.get_request(this.props.userToken.access_token, `/matches/${this.state.otherUser.id}`)
            .then(res => {
                console.log("matches result -> ",!res.data.result)
                this.setState({ isMatched: !res.data.result })
            });
        }
        
    }

    onPressLike(isLike) {
        const onSwiped = this.props.navigation.getParam("onSwiped", null);
        if (onSwiped) {
            if (isLike) {
                this.setState({
                    isLikeCard: true
                })
            } else {
                this.setState({
                    isPassCard: true
                })
            }
            onSwiped(isLike);
            setTimeout(() => {
                this.props.navigation.goBack();
            },800);
        } else {
            this.likeThisPerson(isLike)
        }
    }

    gotoBoost() {
        this.props.navigation.navigate('Boost')
    }

    likeThisPerson(isLike) {

    }

    kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
    }

    renderCenterDots = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {
                    this.state.pictureUrls.map((v, i) => {
                        let backgroundColor = (i === this.state.pageIndex ? '#3cb9fc' : '#d6d6d6');
                        return (
                            <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: backgroundColor, marginRight: 5 }} />
                        )
                    })
                }
            </View>
        )
    };

    onPressReport() {
        this.setState({
            isReportModal: true
        })
    }

    onReportUser(val) {
        this.setState({
            isReportModal: false
        })

        const body = { reason: val };

        userService.post(this.props.userToken.access_token, `/users/report/${this.state.otherUser.id}`, body)
            .then(res => {
                this.setState({ isReportSuccessModal: true })
            }).catch(err => {
                alert("Report user failed, please try later.");
                console.log('report user err', err.response.data);
            })
    }

    render() {
        const { otherUser } = this.state;
        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}>
                <Header leftComponent={this.render_left} rightComponent={this.render_right} backgroundColor='white' />
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    horizontal={false}
                    scrollEnabled={!this.state.fullscreenMode}
                    showsVerticalScrollIndicator={false}>
                    <View>
                        <Swiper ref={(ref) => this.viewpager = ref} dotColor='darkgrey' dotStyle={{ marginBottom: !this.state.fullscreenMode ? height * 0.6 - 50 : height - 50 }}
                            activeDotColor='#3cb9fc' activeDotStyle={{ marginBottom: !this.state.fullscreenMode ? height * 0.6 - 50 : height - 50 }}
                            style={!this.state.fullscreenMode ? { height: height * 0.6 } : { height: height }}
                            autoplay={false} loop={false}>
                            {
                                this.state.pictureUrls.map((item, index) => (
                                    <TouchableOpacity
                                        activeOpacity={1.0}
                                        onPress={() => {
                                            // this.scrollView.scrollTo(0);

                                            // this.setState({ fullscreenMode: !this.state.fullscreenMode })
                                        }}
                                    >
                                        <Image source={{ uri: item }} style={[!this.state.fullscreenMode ? { height: height * 0.6 } : { height: height }]} />
                                    </TouchableOpacity>
                                ))
                            }
                        </Swiper>

                        {
                            this.state.isLikeCard ? (
                                <View style={{ position: 'absolute' }}>
                                    <Image source={Images.ic_likepic} style={{ width: 120, height: 60, marginTop: 30, marginLeft: 10, transform: [{ rotate: '-30deg' }] }} />
                                </View>
                            ) : null
                        }
                        {
                            this.state.isPassCard ? (
                                <View style={{ position: 'absolute', width: '100%', alignItems: 'flex-end' }}>
                                    <Image source={Images.ic_passpic} style={{ width: 120, height: 51, marginTop: 30, marginRight: 10, transform: [{ rotate: '30deg' }] }} />
                                </View>
                            ) : null
                        }

                        {/* <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', marginTop: 10, width: '100%' }}>
                            {
                                this.renderCenterDots()
                            }
                        </View> */}

                        <View style={this.state.isMatched ? styles.matchedActionStyle : styles.unMatchedActionStyle}>
                            <TouchableOpacity style={this.state.isMatched ? styles.mediumCircle : { display: 'none' }} onPress={() => { this.gotoBoost() }}>
                                <Image source={Images.Image11} style={styles.icon1} />
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.isMatched ? styles.largeCircle : { display: 'none' }} onPress={() => { this.onPressLike(false) }}>
                                <Image source={Images.Image12} style={styles.icon2} />
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.isMatched ? styles.largeCircle : { display: 'none' }} onPress={() => { this.onPressLike(true) }}>
                                <Image source={Images.Image13} style={styles.icon3} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.mediumCircle} onPress={() => { this.props.navigation.push('Gift', { to: otherUser }) }}>
                                <Image source={Images.Image14} style={styles.icon1} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 10, paddingLeft: 15 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.name, { maxHeight: 30 }]}>{getCorrrectName(otherUser.name)}</Text>
                                {otherUser.is_share_age && <Text style={styles.age}>,{userService.calcAge(otherUser.birthday)}</Text>}
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Entypo name={'dots-three-horizontal'} size={24} color={'black'} style={{ marginRight: 20, marginTop: 8 }}
                                        onPress={() => this.onPressReport()}
                                    />
                                </View>
                            </View>
                            {/* <Text style={{ color: '#91919d', marginTop: 10 }}>{otherUser.country}</Text> */}
                            <View style={{}}>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                            {otherUser.subscribe_end_date != null ? <Image source={Images.ic_vip_pass} style={{ marginRight: 12, width: 40, height: 40 }} /> : null}
                            {otherUser.face_verified ? <Image source={Images.ic_face} style={{ marginRight: 12, width: 40, height: 40 }} /> : null}
                            {otherUser.facebook_verified ? <Image source={Images.ic_facebook} style={{ marginRight: 10 }} /> : null}
                            {otherUser.instagram_verified ? <Image source={Images.ic_instagram} style={{ marginRight: 10 }} /> : null}
                            {otherUser.linkedin_verified ? <Image source={Images.ic_linkedin} style={{ marginRight: 10 }} /> : null}
                        </View>

                        <Divider style={{ marginTop: 18, marginBottom: 18, marginLeft: 18, marginRight: 18 }} />


                        <Swiper autoplay={false} loop={false} showsPagination={false} style={{ height: 110 }}>
                            <View style={styles.swiperInsideView}>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Image17} />
                                    <Badge value={this.state.otherUserRate.good_etiquette} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{"Good \nEtiquette"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Image15} />
                                    <Badge value={this.state.otherUserRate.nice_profile} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{"Nice \nProfile"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Image18} />
                                    <Badge value={this.state.otherUserRate.true_to_profile} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{"True to \nProfile"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Image16} />
                                    <Badge value={this.state.otherUserRate.well_mannered} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{"Well \nMannered"}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.swiperInsideView}>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.BubblyPersonality} />
                                    <Badge value={this.state.otherUserRate.bubbly_personality} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Bubbly\n Personality'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Intellectual} />
                                    <Badge value={this.state.otherUserRate.intellectual} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Intellectual'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Eloquent} />
                                    <Badge value={this.state.otherUserRate.eloquent} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Eloquent'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.GreatSenseHumor} />
                                    <Badge value={this.state.otherUserRate.great_sense_humor} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Great Sense\n of Humor'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.swiperInsideView}>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.GreatStyle} />
                                    <Badge value={this.state.otherUserRate.great_style} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Great\n Style'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Gentlemanly} />
                                    <Badge value={this.state.otherUserRate.gentlemanly} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Gentlemanly'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Energetic} />
                                    <Badge value={this.state.otherUserRate.energetic} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Energetic'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Thoughtful} />
                                    <Badge value={this.state.otherUserRate.thoughtful} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Thoughtful'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.swiperInsideView}>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.BetterThanProfile} />
                                    <Badge value={this.state.otherUserRate.better_than_profile} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Better Than\n Profile'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Confident} />
                                    <Badge value={this.state.otherUserRate.confident} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Confident'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.GoodListener} />
                                    <Badge value={this.state.otherUserRate.good_listener} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>{'Good\n Listener'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }}>
                                    <Image source={Images.Athletic} style={{ marginTop: 10 }} />
                                    <Badge value={this.state.otherUserRate.athletic} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 20 }}>{'Athletic'}</Text>
                                </TouchableOpacity>
                            </View>
                        </Swiper>

                        <Divider style={{ marginTop: 18, marginBottom: 18, marginLeft: 18, marginRight: 18 }} />

                        <View style={{ marginLeft: 15 }}>
                            <View style={styles.twoColumnRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.3 }}>
                                    <Icon type='material-community' name='map-marker' color='#3cb9fc' containerStyle={{ marginRight: 11, marginLeft: 0 }} />
                                    {otherUser.is_share_location && <Text style={{ width: '80%' }}>{`${otherUser.city}, ${otherUser.country}`}</Text>}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Icon name='location-arrow' type='font-awesome' color='#3cb9fc' containerStyle={{ marginRight: 12, marginLeft: 4 }} />
                                    <Text>
                                        {getDistance(otherUser.latitude, otherUser.longitude,
                                            this.props.user.latitude, this.props.user.longitude)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.twoColumnRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.3 }}>
                                    <Image source={Images.Image20} style={{ marginLeft: 2, marginRight: 15 }} />
                                    <Text>{otherUser.body_type}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Image source={Images.Image19} style={{ marginLeft: 5, marginRight: 15 }} />
                                    <Text>{`${otherUser.height}cm`}</Text>
                                </View>
                            </View>
                            <View style={styles.twoColumnRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.3 }}>
                                    <Image source={Images.Image21} style={{ marginLeft: 3, marginRight: 15 }} />
                                    <Text>{}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Image source={Images.Image22} style={{ marginLeft: 3, marginRight: 13 }} />
                                    <Text>{otherUser.has_children ? "Yes" : "No"}</Text>
                                </View>
                            </View>
                            <View style={styles.twoColumnRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.3 }}>
                                    <Icon name='briefcase' type='font-awesome' size={17} color='#3cb9fc' containerStyle={{ marginLeft: 2, marginRight: 16 }} />
                                    <Text style={{ width: '80%' }}>{otherUser.job}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Icon name='smoking-rooms' color='#3cb9fc' containerStyle={{ marginRight: 14 }} />
                                    <Text>{otherUser.smoking}</Text>
                                </View>
                            </View>
                            <View style={styles.twoColumnRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.3 }}>
                                    <Image source={Images.Image23} style={{ marginLeft: 3, marginRight: 16 }} />
                                    <Text>{otherUser.religion}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Icon name='ios-beer' type='ionicon' color='#3cb9fc' containerStyle={{ marginLeft: 4, marginRight: 16 }} />
                                    <Text>{otherUser.drinking}</Text>
                                </View>
                            </View>
                        </View>

                        <Divider style={{ marginTop: 18, marginBottom: 18, marginLeft: 18, marginRight: 18 }} />

                        <View style={{}}>
                            <View style={styles.CategoryBox}>
                                <Image source={Images.Image24} style={{ marginRight: 10 }} />
                                {/* <Text>{`${otherUser.income_from}-${otherUser.income_to}/Year`}</Text> */}
                                <Text>${this.kFormatter(Number(otherUser.income_from))} P.A.</Text>
                            </View>
                            <View style={styles.CategoryBox}>
                                <Image source={Images.Image25} style={{ marginRight: 10 }} />
                                <Text>{otherUser.hobby}</Text>
                            </View>
                            <View style={styles.CategoryBox}>
                                <Image source={Images.Image26} style={{ marginRight: 10 }} />
                                <Text>{otherUser.about_me}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>


                <Overlay isVisible={this.state.isReportModal}
                    width='auto' height='auto' borderRadius={14}
                    overlayStyle={{ padding: 10 }}>
                    <ReportModal user={otherUser}
                        onCancel={() => this.setState({ isReportModal: false })}
                        onSubmit={(val) => { this.onReportUser(val) }} />
                </Overlay>

                <Overlay isVisible={this.state.isReportSuccessModal}
                    width='auto' height='auto' borderRadius={14}
                    overlayStyle={{ padding: 10 }}>
                    <ReportSuccessModal user={otherUser}
                        onOk={() => this.setState({ isReportSuccessModal: false })} />
                </Overlay>


            </View>
        )
    }

    render_left = () => (
        <TouchableOpacity onPress={() => { this.props.navigation.goBack(null) }} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='ios-arrow-back' type='ionicon' color='#17144e' size={21} />
            <Text style={{ marginLeft: 10, color: '#17144e' }}>Back</Text>
        </TouchableOpacity>
    );
    render_right = () => (
        <TouchableOpacity onPress={() => { this.props.navigation.push('Filter') }} style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <Icon name='filter' type='material-community' color='#6147d1' /> */}
        </TouchableOpacity>
    )
}

const styles = {
    photoGallery: {
        width: width,
        height: width * 0.7
    },
    mediumCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    unMatchedActionStyle: {
        flexDirection: 'row',
        marginTop: -42,
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
        alignSelf: 'flex-end', marginRight: 40
    },
    matchedActionStyle: {
        flexDirection: 'row',
        marginTop: -42,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    largeCircle: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: 'white',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    icon1: { width: 28, height: 28 },
    icon2: { width: 26, height: 26 },
    icon3: { width: 35, height: 31 },
    name: { fontSize: 26, color: '#17144e', fontFamily: 'ProximaNova-Bold', marginTop: 3 },
    age: { fontSize: 24, color: '#17144e' },
    twoColumnRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5
    },
    CategoryBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginVertical: 10
    },
    swiperInsideView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 5
    }
};


const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    if (d > 1) return Math.round(d) + "km";
    else if (d <= 1) return Math.round(d * 1000) + "m";
    return d;
};

const mapStateToProps = (state) => {
    return {
        dating: state.dating,
        user: state.user.profile,
        userToken: state.startup.userToken
    }
};
export default connect(mapStateToProps)(OtherUserProfile)
