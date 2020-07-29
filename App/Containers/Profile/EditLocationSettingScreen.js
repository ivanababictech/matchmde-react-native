import React, { Component } from 'react'
import { View, Text, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'

import { userService } from 'App/Services/UserService'
import { Avatar, Header, Icon, Divider } from 'react-native-elements'

import { fbService } from 'App/Services/FirebaseService'
import { Images } from 'App/Theme'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage';
import {withNavigation} from "react-navigation";

class EditLocationSettingScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settingState: 0
        };
    }

    onClickItem(sState) {

        if (sState === 2 && this.props.profile.is_subscribe === null) {
            alert('Should be premium account')
            return;
        }

        this.setState({
            settingState: sState
        })

        const refreshSetting = this.props.navigation.getParam("onRefreshSetting");
        console.log("refreshData", refreshSetting)
        refreshSetting(sState);

        this.setLocationSettingState(sState);
        
    }

    async componentDidMount() {
        const sState = await this.getLocationSettingState();
        this.setState({
            settingState: sState
        })
    }

    setLocationSettingState = async(sState) => {
        await AsyncStorage.setItem('locationSettingState','' + sState);
    }

    getLocationSettingState = async () => {
        try {
            let locationSettingState = await AsyncStorage.getItem('locationSettingState');
            if (locationSettingState !== null) {
                return Number(locationSettingState);
            }
            return 1;
        } catch (error) {
            return 1;
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header leftComponent={this.header_left} centerComponent={this.header_center}
                    backgroundColor="transparent" />
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.itemStyle} onPress={() => this.onClickItem(1)}>
                        <Image source={Images.ic_location_pin} style={styles.imageStyle} resizeMethod={'contain'} />
                        <Text style={styles.textStyle}>My Current Location</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            {this.state.settingState === 1 &&
                                <Image source={Images.ic_checkmark} style={styles.imageStyle_Right} resizeMethod={'contain'} />
                            }
                        </View>
                    </TouchableOpacity>
                    <Divider style={{ backgroundColor: '#17144e', marginHorizontal: 10 }} />
                    <TouchableOpacity style={styles.itemStyle} onPress={() => this.onClickItem(2)}>
                        <Image source={Images.ic_location_pin} style={styles.imageStyle} resizeMethod={'contain'} />
                        <Text style={styles.textStyle}>Changed Location Manually</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            {this.state.settingState === 2 &&
                                <Image source={Images.ic_checkmark} style={styles.imageStyle_Right} resizeMethod={'contain'} />
                            }
                        </View>
                    </TouchableOpacity>
                    <Divider style={{ backgroundColor: '#17144e', marginHorizontal: 10 }} />
                </View>
            </View>
        )
    }

    header_left = () => {
        return (
            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='ios-arrow-back' color='#17144e' type='ionicon' />
                <Text style={{ marginLeft: 10, color: '#17144e' }}>Back</Text>
            </TouchableOpacity>
        )
    };

    header_center = () => {
        return (
            <Text style={{ color: '#17144e', fontSize: 21, fontWeight: 'bold' }}>Settings</Text>
        )
    };
}

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
        userToken: state.startup.userToken
    }
};

export default withNavigation(connect(mapStateToProps)(EditLocationSettingScreen))

const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        height: 48,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
    },
    imageStyle: {
        width: 20,
        height: 28,
    },
    imageStyle_Right: {
        width: 20,
        height: 28,
    },
    textStyle: {
        marginLeft: 10,
        color: '#17144e',
        fontSize: 17,
        fontFamily: 'ProximaNova-Bold'
    }
});
