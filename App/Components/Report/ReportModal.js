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


class ReportModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chooseReportType: 0,
            reportContent: ""
        }
    }

    onPressSubmit() {

        if (this.state.chooseReportType === 1) {
            this.props.onSubmit("INAPPROPRIATE PHOTOS");
            return;
        } else if(this.state.chooseReportType === 2) {
            this.props.onSubmit("FEELS LIKE SPAM");
            return;
        }

        if (this.state.reportContent === "") {
            alert("Please input Additional Info.");
            return;
        }

        this.props.onSubmit(this.state.reportContent);
    }

    renderChooseOption() {
        if (this.state.chooseReportType === 1) {
            return (
                <View style={styles.optionStyle_con}>
                    <Image source={Images.report_camera} style={styles.imageStyle} />
                    <Text style={styles.textStyle_con}>INAPPROPRIATE PHOTOS</Text>
                </View>
            )
        } else if (this.state.chooseReportType == 2) {
            return (
                <View style={styles.optionStyle_con}>
                    <Image source={Images.report_spam} style={styles.imageStyle} />
                    <Text style={styles.textStyle_con}>FEELS LIKE SPAM</Text>
                </View>
            )
        } else if (this.state.chooseReportType == 3) {
            return (
                <View style={styles.optionStyle_con}>
                    <Image source={Images.report_other} style={styles.imageStyle} />
                    <Text style={styles.textStyle_con}>OTHER</Text>

                    <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '100%', marginTop: 15, padding: 10 }} 
                        value={this.state.reportContent}
                        placeholder="Additional Info (Required)"
                        returnKeyType='done'
                        onChangeText={(reportContent) => this.setState({ reportContent })} />
                </View>
            )
        }

        return null;
    }

    render() {
        return (
            <View style={{ width: Dimensions.get("window").width - 60 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                    <Text style={{ marginTop: 20, color: '#000', fontSize: 24, fontFamily: "ProximaNova-Bold" }}>Report</Text>
                    <Text style={{ marginTop: 10, color: '#91919d', fontSize: 17 }}>{"We won't tell " + getCorrrectName(this.props.user.name)}</Text>
                </View>

                {this.state.chooseReportType == 0 &&
                    <View>
                        <TouchableOpacity style={styles.optionStyle} onPress={() => this.setState({ chooseReportType: 1 })}>
                            <Image source={Images.report_camera} style={styles.imageStyle} />
                            <Text style={styles.textStyle}>INAPPROPRIATE PHOTOS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionStyle} onPress={() => this.setState({ chooseReportType: 2 })}>
                            <Image source={Images.report_spam} style={styles.imageStyle} />
                            <Text style={styles.textStyle}>FEELS LIKE SPAM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.optionStyle, { marginBottom: 20 }]} onPress={() => this.setState({ chooseReportType: 3 })}>
                            <Image source={Images.report_other} style={styles.imageStyle} />
                            <Text style={styles.textStyle}>OTHER</Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    this.renderChooseOption()
                }

                {this.state.chooseReportType != 0 &&
                    <Button title="SUBMIT" titleStyle={{ fontFamily: 'ProximaNova-Bold' }}
                        ViewComponent={LinearGradient}
                        linearGradientProps={{
                            colors: ['#4a46d6', '#964cc6'],
                            start: { x: 0, y: 0 },
                            end: { x: 0, y: 1 },
                        }}
                        buttonStyle={{ borderRadius: 30, marginLeft: 20, marginRight: 20 }}

                        onPress={() => this.onPressSubmit()}
                        containerStyle={{ marginBottom: 5, marginTop: 5 }}
                    />
                }

                <Button title="CANCEL" titleStyle={{ color: '#91919d', fontFamily: 'ProximaNova-Bold' }}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#fff', '#efefef'],
                        start: { x: 0, y: 0 },
                        end: { x: 0, y: 1 },
                    }}
                    buttonStyle={{ borderRadius: 30 }}
                    onPress={this.props.onCancel}
                    containerStyle={{ marginBottom: 5, marginTop: 5, marginLeft: 20, marginRight: 20 }}
                />
            </View>
        )
    }
}

ReportModal.propTypes = {
    user: PropTypes.object,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
};

let styles = {
    errorMsg: {
        color: 'red', fontSize: 15, marginVertical: 5
    },
    optionStyle: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: "row",
    },
    optionStyle_con: {
        marginTop: 0,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    singleLineInput: {
        height: 48,
        flex: 1,
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

export default connect(mapStateToProps)(ReportModal)
