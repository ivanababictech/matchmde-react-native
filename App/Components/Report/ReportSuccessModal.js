import React, { Component } from 'react'
import { View, Text, Image, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import { userService } from 'App/Services/UserService'
import { connect } from 'react-redux'

import PropTypes from 'prop-types';
import TextInput2 from './../Profile/TextInput2'
import { getCorrrectName } from 'App/Services/HelperServices'
import { Images } from 'App/Theme'


class ReportSuccessModal extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ width: Dimensions.get("window").width - 60 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                    <Text style={{ marginTop: 20, color: '#000', fontSize: 24, fontFamily: "ProximaNova-Bold" }}>Reported</Text>
                    <Image source={{ uri: this.props.user.picture }} style={[styles.avatarImage]} resizeMode={"cover"} />
                    <Text style={{ marginTop: 40, color: '#91919d', fontSize: 17 }}>{"Thank you for your feedback."}</Text>
                    <Text style={{ marginTop: 10, color: '#91919d', fontSize: 17 }}>{"We'll take it from here."}</Text>
                </View>

                <Button title="OK" titleStyle={{ fontFamily: 'ProximaNova-Bold' }}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#4a46d6', '#964cc6'],
                        start: { x: 0, y: 0 },
                        end: { x: 0, y: 1 },
                    }}
                    buttonStyle={{ borderRadius: 30, marginLeft: 20, marginRight: 20 }}
                    onPress={() => this.props.onOk()}
                    containerStyle={{ marginBottom: 5, marginTop: 5 }}
                />
            </View>
        )
    }
}

ReportSuccessModal.propTypes = {
    user: PropTypes.object,
    onOk: PropTypes.func,
};

let styles = {
    avatarImage: {
		width: Dimensions.get("window").width * 0.6,
		height: Dimensions.get("window").width * 0.6,
        borderRadius: (Dimensions.get("window").width * 0.6) / 2,
        marginTop: 20
	},
    imageStyle: { width: 40, height: 40 },
    textStyle: { marginLeft: 20, color: '#91919d', fontSize: 18, fontFamily: "ProximaNova-Bold", alignSelf: 'center' },
    textStyle_con: { color: '#91919d', fontSize: 18, fontFamily: "ProximaNova-Bold", alignSelf: 'center', marginTop: 10 }
};
const mapStateToProps = (state) => {
    return {
        userToken: state.startup.userToken
    }
};

export default connect(mapStateToProps)(ReportSuccessModal)
