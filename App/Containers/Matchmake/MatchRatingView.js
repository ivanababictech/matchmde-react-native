import React, {Component} from "react";
import {Dimensions, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {ApplicationStyles, Images} from "../../Theme";
import {Avatar, Button, Header, Icon, Overlay} from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import Swiper from 'react-native-swiper'
import Toast from "react-native-root-toast";
import {userService} from "../../Services/UserService";
import {fbService} from "../../Services/FirebaseService";
import {withNavigation} from "react-navigation";
import {connect} from "react-redux";
import Spinner from "react-native-spinkit";


const data = [
    [
        [
            {
                icon: Images.GoodEtiquette,
                text: 'Good\n Etiquette'
            },
            {
                icon: Images.NiceProfile,
                text: 'Nice\n Profile'
            },
            {
                icon: Images.TrueToProfile,
                text: 'True to\n Profile'
            },
            {
                icon: Images.WellMannered,
                text: 'Well\n Mannered'
            },
        ],
        [
            {
                icon: Images.BubblyPersonality,
                text: 'Bubbly\n Personality'
            },
            {
                icon: Images.Intellectual,
                text: 'Intellectual'
            },
            {
                icon: Images.Eloquent,
                text: 'Eloquent'
            },
            {
                icon: Images.GreatSenseHumor,
                text: 'Great Sense\n of Humor'
            },
        ]
    ],
    [
        [
            {
                icon: Images.GreatStyle,
                text: 'Great\n Style'
            },
            {
                icon: Images.Gentlemanly,
                text: 'Gentlemanly'
            },
            {
                icon: Images.Energetic,
                text: 'Energetic'
            },
            {
                icon: Images.Thoughtful,
                text: 'Thoughtful'
            },
        ],
        [
            {
                icon: Images.BetterThanProfile,
                text: 'Better Than\n Profile'
            },
            {
                icon: Images.Confident,
                text: 'Confident'
            },
            {
                icon: Images.GoodListener,
                text: 'Good\n Listener'
            },
            {
                icon: Images.Athletic,
                text: 'Athletic'
            },
        ]
    ]

];
class MatchRatingView extends Component{
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isLoading: false,
            isModalVerifyEnabled: false,
            youInfo: this.props.navigation.getParam("youInfo"),
            meInfo: this.props.navigation.getParam("meInfo"),
            selected: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            isShowConfirmModal: false

        }

    }
    componentWillUnmount() {
        const refreshData = this.props.navigation.getParam("onRefreshData");
        refreshData();
    }
    async onDone() {
        if (this.state.selected < 0){
            Toast.show("Please give a your feedback.", ApplicationStyles.toastOptionSuccess);
        } else {
            this.setState({isShowConfirmModal: true});
            userService.post(this.props.userToken.access_token, '/match_rate', {
                user_to: this.state.youInfo.id,
                good_etiquette: this.state.selected[0],
                nice_profile:  this.state.selected[1],
                true_to_profile: this.state.selected[2],
                well_mannered: this.state.selected[3],
                bubbly_personality: this.state.selected[4],
                intellectual: this.state.selected[5],
                eloquent: this.state.selected[6],
                great_sense_humor: this.state.selected[7],
                great_style: this.state.selected[8],
                gentlemanly: this.state.selected[9],
                energetic: this.state.selected[10],
                thoughtful: this.state.selected[11],
                better_than_profile: this.state.selected[12],
                confident: this.state.selected[13],
                good_listener: this.state.selected[14],
                athletic: this.state.selected[15]
            }).then(e => {
                fbService.setReceivedMatchFeedback(this.state.meInfo.id, this.state.youInfo.id,()=>{{}});
                this.props.navigation.goBack(null);
            }).catch(e => {
                console.log("match rating error -> ",e);
                Toast.show("there is any problem in internet connection. please try again later.", ApplicationStyles.toastOptionError);
            });
            setTimeout(() => {
                this.setState({isShowConfirmModal: false});
            }, 3000)
        }
    }
    renderHeaderLeft = () => {
        return (
            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{flexDirection: 'row'}}>
                <Icon name='ios-arrow-back' color='#324a7e' type='ionicon' />
                <Text style={{fontSize: 17, marginLeft: 6, marginTop: 2, color: '#324a7e'}}>Back</Text>
            </TouchableOpacity>
        )
    };

    renderTitle = () => {
        return (
            <Image source={Images.Image02} style={{alignSelf:'center', height: 62, width: 62}} resizeMode={'cover'}/>
        )
    };
    renderConfirmModal() {
        return (
            <View>
                <Image source={Images.Image02} style={{ width: 130, height: 130, marginTop: 10,alignSelf: 'center' }} resizeMode='contain' />
                <Text style={styles.noActivityText}>{'Thank you for your\n feedback!'}</Text>
                {/*<Button title="I think so too!"*/}
                {/*        titleStyle={{fontSize: 16, fontWeight: 'bold'}}*/}
                {/*        ViewComponent={LinearGradient}*/}
                {/*        linearGradientProps={{*/}
                {/*            colors: ['#4a46d6', '#964cc6'],*/}
                {/*            start: { x: 0, y: 0 },*/}
                {/*            end: { x: 0, y: 1 },*/}
                {/*        }}*/}
                {/*        loading={this.state.loading}*/}
                {/*        buttonStyle={{ borderRadius: 30 }}*/}
                {/*        onPress={() => {*/}
                {/*            this.setState({isShowNoActivityModal: false});*/}
                {/*            this.props.navigation.goBack(null);*/}
                {/*        }}*/}
                {/*        containerStyle={{ marginTop: 25, marginBottom: 10, width: 250, alignSelf: 'center' }} />*/}
                <Spinner style={{marginTop:20, alignSelf: 'center'}} isVisible={true} type='Circle' color='#3cb9fc'/>
            </View>
        )
}
    render() {
        return (
            <View style={styles.rootContainer}>
                <Header backgroundColor='transparent'
                        leftComponent={this.renderHeaderLeft}
                        centerComponent={this.renderTitle} />
                <ScrollView style={styles.scrollContainer} horizontal={false}>
                    <Text style={styles.TopQuestion}>How Was Your Match?</Text>
                    <View style={{ alignSelf: 'center', marginBottom: 38 }}>
                        <Avatar rounded size='xlarge' source={{ uri: this.state.youInfo.picture }} showEditButton={false} />
                    </View>
                    <Swiper style={{height: 320}} dotColor='darkgrey' dotStyle={{ marginTop: 0 }}
                            activeDotColor='#3cb9fc' activeDotStyle={{ marginTop: 0 }} loop={false}>
                        {
                            data.map((page, i) => {
                                return (
                                    <View style={{}}>
                                        {
                                            page.map((row, j) => {
                                                return (
                                                    <View style={styles.itemsStyle}>
                                                        {
                                                            row.map((item, k) => {
                                                                return (
                                                                    <View style={styles.itemStyle}>
                                                                        <TouchableOpacity onPress={()=>{
                                                                            let v = this.state.selected;
                                                                            v[i * 8 + j * 4 + k] = !v[i * 8 + j * 4 + k];
                                                                            this.setState({selected: v});
                                                                        }}>
                                                                            <Image source={item.icon} style={ this.state.selected[i * 8 + j * 4 + k]? styles.itemSelectedImageStyle : styles.itemImageStyle} resizeMode={'contain'}/>
                                                                            <Text style={ this.state.selected[i * 8 + j * 4 + k] ? styles.itemSelectedTextStyle : styles.itemTextStyle}>{item.text}</Text>
                                                                        </TouchableOpacity>
                                                                    </View>);
                                                            })
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                )
                            })
                        }
                    </Swiper>
                    <Button title="Done"
                            ViewComponent={LinearGradient}
                            linearGradientProps={{
                                colors: ['#4a46d6', '#964cc6'],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            }}
                            loading={this.state.loading}
                            buttonStyle={{ borderRadius: 30 }}
                            onPress={() => { this.onDone() }}
                            titleStyle={{ fontSize: 16, fontWeight: 'bold'}}
                            containerStyle={{ marginTop: 10, marginBottom: 10, width: 320, alignSelf: 'center' }} />
                    <Button title="Cancel"
                            ViewComponent={LinearGradient}
                            linearGradientProps={{
                                colors: ['#ffffff', '#efefef'],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            }}
                            loading={this.state.loading}
                            buttonStyle={{ borderRadius: 30 }}
                            onPress={() => { this.props.navigation.goBack(null) }}
                            titleStyle={{ fontSize: 16, fontWeight: 'bold', color: '#91919d'}}
                            containerStyle={{ marginTop: 10, marginBottom: 10, width: 320, alignSelf: 'center' }} />
                </ScrollView>
                <Overlay isVisible={this.state.isShowConfirmModal} width='auto' height='auto' borderRadius={14}
                         overlayStyle={{ padding: 30 }}>
                    {this.renderConfirmModal()}
                </Overlay>
            </View>
        )
    }
}

let styles = {
    rootContainer: {
        flex: 1,
    },
    TopQuestion: {
        marginTop: 26,
        marginBottom: 33,
        alignSelf: 'center',
        color: '#324a7e',
        fontSize: 26,
        fontWeight: 'bold'
    },
    itemsStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    itemStyle: {
        // marginLeft: 18,
        // marginRight: 18,
        marginTop: 20,
        width: Dimensions.get('window').width / 4
    },
    itemImageStyle: {
        alignSelf: 'center',
        height: 58,
        width: 58
    },
    itemTextStyle: {
        textAlign: 'center',
        marginTop: 13,
        color: '#324a7e',
        fontSize: 15,
    },
    itemSelectedImageStyle: {
        alignSelf: 'center',
        height: 58,
        borderWidth: 2,
        borderColor: '#4a46d6',
        borderRadius: 29,
        width: 58
    },
    itemSelectedTextStyle: {
        textAlign: 'center',
        marginTop: 13,
        color: '#4a46d6',
        fontSize: 15,
    },
    noActivityText: {
        color: '#324a7e',
        fontWeight: 'bold',
        fontSize: 26,
        textAlign: 'center',
        marginTop: 30
    }
};

const mapStateToProps = state =>{
    return{
        profile:state.user.profile,
        userToken:state.startup.userToken
    }
};
export default withNavigation(connect(mapStateToProps)(MatchRatingView))
