import React, { Component } from "react";
import ImagePicker from "react-native-image-picker";
import { detectFaces } from "face-recognition-react-native";
import { Image, ScrollView, Text, View } from "react-native";
import IIcons from "react-native-vector-icons/FontAwesome";
import { Button, Icon, Overlay } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { Images } from "../../Theme";
import StartupActions from 'App/Stores/Startup/Actions'
import { userDetails, DBServices } from 'App/realm';
import { connect } from "react-redux";

class ProfileFinish extends Component {
    constructor(props) {
        super(props);
        this.user = userDetails.objects('userDetails')[0];
        this.state = {
            user: DBServices.fetchUserDB(),
        }
    }

    handleNext = (param) => {
        this.props.onNext({ param: param });
    };

    onVerity() {
        this.props.onNext(true);
    }

    onSkip() {
        this.props.onNext(false);
    }

    render() {
        return (
            <ScrollView>
                <View style={{ marginLeft: '7%', marginRight: '7%' }}>
                    <View style={{ alignItems: 'center', marginTop: '4%' }}>
                        <Text style={{ marginLeft: 20, fontSize: 24, color: '#17144e', fontFamily: 'ProximaNova-Bold'}}>
                            {"Verify your Profile Picture"}
                        </Text>
                        <Text style={{ color: '#9a9493', marginTop: 15, fontSize: 17 }}>{"Please take a selfie"}</Text>
                    </View>

{this.state.user.image !== "" &&
                    <View style={{ marginTop: 40 }}>
                        <Image source={{ uri: this.props.image }} style={{ width: 350, height: 420, alignSelf: 'center', borderRadius: 10 }} resizeMode='contain' />
                    </View>
}
                    
                    <Button title="I'M READY"
                        ViewComponent={LinearGradient}
                        linearGradientProps={{
                            colors: ['#4a46d6', '#964cc6'],
                            start: { x: 0, y: 0 },
                            end: { x: 0, y: 1 },
                        }}
                        buttonStyle={{ borderRadius: 30 }}
                        titleStyle={{ fontSize: 16, fontFamily: 'ProximaNova-Bold' }}
                        // icon={<Icon name='md-arrow-round-forward' type='ionicon' color='white' containerStyle={{position:'absolute', right:12}}/>}
                        onPress={this.onVerity.bind(this)}
                        containerStyle={{ marginTop: 40 }} />
                    <Button title="VERIFY LATER" titleStyle={{ color: '#91919d', fontFamily: 'ProximaNova-Bold', fontSize: 16 }}
                        ViewComponent={LinearGradient}
                        linearGradientProps={{
                            colors: ['#fff', '#efefef'],
                            start: { x: 0, y: 0 },
                            end: { x: 0, y: 1 },
                        }}
                        buttonStyle={{ borderRadius: 30 }}
                        onPress={this.onSkip.bind(this)}
                        containerStyle={{ marginBottom: 5, marginTop: 20 }}
                    />

                </View>
            </ScrollView>
        )
    }
}


let styles = {
    successMsg: {
        color: '#17144e',
        fontFamily: 'ProximaNova-Bold',
        fontSize: 26,
        textAlign: 'center',
        marginTop: 25
    },
    failedMsg: {
        color: '#17144e',
        fontFamily: 'ProximaNova-Bold',
        fontSize: 26,
        textAlign: 'center',
        marginTop: 25
    },
    failedCont: {
        color: '#91919d',
        fontSize: 17,
        textAlign: 'center',
        marginTop: 25
    },
    failedSubView: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 8,
        borderColor: "#fd2d65",
        alignItems: 'center',
        justifyContent: 'center'
    }
};
const mapStateToProps = state => {
	return {
		pageIndex: state.startup.pageIndex
	}
};

export default connect(mapStateToProps)(ProfileFinish)