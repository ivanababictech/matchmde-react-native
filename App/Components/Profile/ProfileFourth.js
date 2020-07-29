import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    ActivityIndicator,
    Linking,
    Image,
    Text,
    Alert
} from 'react-native';
import { RNCamera } from "react-native-camera";
import LinearGradient from "react-native-linear-gradient";
import { Button } from "react-native-elements";
import { Icon, Overlay } from 'react-native-elements'
import { userService } from "../../Services/UserService";
import RNFetchBlob from "rn-fetch-blob";
const fs = RNFetchBlob.fs;
const RNFS = require('react-native-fs');

import { Images } from 'App/Theme'
import { withNavigation } from 'react-navigation'
import IIcons from "react-native-vector-icons/FontAwesome";
import StartupActions from 'App/Stores/Startup/Actions'
import { connect } from "react-redux";
import { DBServices, userDetails } from 'App/realm';

class ProfileFourth extends React.Component {
    static navigationOptions = { title: null, };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            counter: 0,
            flash: 'off',
            zoom: 0,
            autoFocus: 'on',
            autoFocusPoint: {
                normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
                drawRectPosition: {
                    x: Dimensions.get('window').width * 0.5 - 32,
                    y: Dimensions.get('window').height * 0.5 - 32,
                },
            },
            depth: 0,
            type: 'front',
            whiteBalance: 'auto',
            ratio: '16:9',
            canDetectFaces: false,
            faces: [],
            isVisibleModal_success: false,
            isVisibleModal_failed: false
        }
    }

    toggleFacing() {
        this.setState({
            type: this.state.type === 'back' ? 'front' : 'back',
        });
    }

    toggleFlash() {
        this.setState({
            flash: this.state.flash === 'off' ? 'on' : 'off',
        });
    }

    async onContinueVerify(continueVerify) {

        const options = { fixOrientation: true, forceUpOrientation: true, quality: 0.1 };
        const data = await this.camera.takePictureAsync(options);

        if (this.camera) {
            this.setState({
                isLoading: true
            });

            let response = await RNFS.readFile(data.uri, 'base64');
            console.log(response);

            const imageUrl = this.props.navigation.getParam("image");
            let imagePath = null;

            console.log('imageUrl ->', imageUrl);

            RNFetchBlob.config({
                fileCache: true
            })
                .fetch("GET", imageUrl)
                // the image is now dowloaded to device's storage
                .then(resp => {
                    // the image path you can use it directly with Image component
                    imagePath = resp.path();
                    console.log('imagePath', imagePath);
                    return resp.readFile("base64");
                })
                .then(async (base64Data) => {
                    // here's base64 encoded image
                    console.log('target image', base64Data);
                    // remove the file from storage

                    const body = { target_image: base64Data, source_image: response };

                    console.log(body);
                    let results = {};
                    try {
                        results = await userService.post('', 'auth/face_verify', body);
                        console.log(results);
                    } catch (e) {
                        console.log(e);
                        results = { FaceMatches: [] }
                        // this.props.navigation.goBack(null);
                        // continueVerify(false)

                        this.setState({
                            isLoading: false,
                            isVisibleModal_failed: true
                        })

                        return;
                    }


                    if (results.data.length) {
                        this.props.navigation.goBack(null);
                        continueVerify(true)
                    } else {
                        // this.props.navigation.goBack(null);
                        // continueVerify(false)
                        this.setState({
                            isLoading: false,
                            isVisibleModal_failed: true
                        })
                    }

                    return fs.unlink(imagePath);
                });
        }
    }

    takePicture = async function () {

        const isContinueVerify = this.props.navigation.getParam("isContinueVerify");
        console.log("continueVerify", isContinueVerify);
        if (isContinueVerify != null) {
            const continueVerify = this.props.navigation.getParam("continueVerify");
            await this.onContinueVerify(continueVerify);
            return
        }
        const options = { fixOrientation: true, forceUpOrientation: true, quality: 0.1 };
        const data = await this.camera.takePictureAsync(options);
        if (this.camera) {
            this.setState({
                isLoading: true
            });
            this.user = userDetails.objects('userDetails')[0];
            let response = await RNFS.readFile(data.uri, 'base64');
            let response2 = await RNFS.readFile(this.user.image, 'base64');
            console.log(response, response2);

            const body = { target_image: response2, source_image: response };

            console.log(body);
            let results = {};
            try {
                results = await userService.post('', 'auth/face_verify', body);
                console.log(results);
            } catch (e) {
                console.log(e);
                if (this.state.counter < 2) {
                    // alert('Face Verification is failed! Please try again.');
                    this.setState({
                        isLoading: false,
                        counter: this.state.counter + 1,
                        isVisibleModal_failed: true
                    });
                } else {

                    // Alert.alert(
                    //     'Alert',
                    //     'Please try again later.',
                    //     [
                    //         {
                    //             text: 'OK', onPress: () => {
                    //                 this.state.isLoading = false;
                    //                 this.props.onNext({ face_verified: false });
                    //             }
                    //         },
                    //     ],
                    //     { cancelable: false },
                    // );
                    this.setState({
                        isLoading: false,
                        isVisibleModal_failed: true
                    })
                }
                return;
            }


            if (results.data.length) {
                this.setState({
                    isVisibleModal_success: true
                })

            } else {
                if (this.state.counter < 2) {
                    this.setState({
                        isLoading: false,
                        counter: this.state.counter + 1,
                        isVisibleModal_failed: true
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        isVisibleModal_failed: true
                    })
                }
            }
        }
    };

    toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

    onCloseModal() {
        this.setState({ isVisibleModal_success: false });
        this.props.onNext({ face_verified: true });
    }

    render() {
        return <RNCamera
            ref={ref => {
                this.camera = ref;
            }}
            style={styles.container}
            type={this.state.type}
            flashMode={this.state.flash}
            captureAudio={false}
            autoFocus={this.state.autoFocus}
            autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
            whiteBalance={this.state.whiteBalance}
            ratio={this.state.ratio}
            focusDepth={this.state.depth}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', bottom: 8, width: Dimensions.get('window').width }}>
                <Button
                    icon={
                        <Icon
                            name='rotate-left'
                            type='FontAwesome'
                            color='#fff'
                            style={{ height: 70 }}
                            size={40}
                        />
                    }
                    buttonStyle={{ borderRadius: 30, backgroundColor: 'transparent' }}
                    isDisabled={this.state.isLoading}
                    onPress={this.toggleFacing.bind(this)}
                    containerStyle={{ alignItems: 'center', justifyContent: 'center', height: 100, marginRight: 'auto' }}
                />
                <Button
                    icon={
                        <Icon
                            name='camera-alt'
                            type='FontAwesome5'
                            color='#fff'
                            style={{ height: 70 }}
                            size={50}
                        />
                    }
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#4a46d6', '#964cc6'],
                        start: { x: 0, y: 0 },
                        end: { x: 0, y: 1 },
                    }}
                    buttonStyle={{ borderRadius: 30 }}
                    isDisabled={this.state.isLoading}
                    onPress={this.takePicture.bind(this)}
                    containerStyle={{ alignItems: 'center', justifyContent: 'center', height: 100 }}
                />
                <Button
                    icon={
                        <Icon
                            name='flash'
                            type='entypo'
                            color='#fff'
                            style={{ height: 70 }}
                            size={40}
                        />
                    }
                    buttonStyle={{ borderRadius: 30, backgroundColor: 'transparent' }}
                    onPress={this.toggleFlash.bind(this)}
                    isDisabled={this.state.isLoading}
                    containerStyle={{ alignItems: 'center', justifyContent: 'center', height: 100, marginLeft: 'auto' }}
                />
            </View>
            <Overlay isVisible={this.state.isVisibleModal_success} width='auto' height='auto' borderRadius={14}
                overlayStyle={{ padding: 30 }}>
                {this.renderSuccessModalContent(this.state.counter >= 2)}
            </Overlay>
            <Overlay isVisible={this.state.isVisibleModal_failed} width='auto' height='auto' borderRadius={14}
                overlayStyle={{ padding: 30 }}>
                {this.renderFailedModalContent()}
            </Overlay>
        </RNCamera>;
    }

    renderSuccessModalContent() {
        const successMsg = "Yay! You Are a Real\nHuman!";
        return (
            <View>
                <Image source={Images.Image02} style={{ width: 130, height: 130, marginTop: 10, alignSelf: 'center' }} resizeMode='contain' />
                <Text style={styles.successMsg}>{successMsg}</Text>
                <Button title="PHEW!" titleStyle={{ fontFamily: 'ProximaNova-Bold' }}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#4a46d6', '#964cc6'],
                        start: { x: 0, y: 0 },
                        end: { x: 0, y: 1 },
                    }}
                    loading={this.state.loading}
                    buttonStyle={{ borderRadius: 30 }}
                    onPress={() => { this.onCloseModal() }}
                    containerStyle={{ marginTop: 25, marginBottom: 10, width: 250, alignSelf: 'center' }} />
            </View>
        )
    }

    renderFailedModalContent(isLast) {
        const failedMsg = "Face Not Recognized";
        const failedContent = "Please try again.";
        const failedLater = "Please try again later.";
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={{ width: 130, height: 50, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={styles.failedSubView}>
                        <IIcons name={'close'} size={50} color={"#fd2d65"} />
                    </View>
                </View>
                <Text style={styles.failedMsg}>{failedMsg}</Text>
                <Text style={styles.failedCont}>{isLast ? failedLater : failedContent}</Text>
                <Button title="TRY AGAIN"
                    ViewComponent={LinearGradient} titleStyle={{ fontFamily: 'ProximaNova-Bold' }}
                    linearGradientProps={{
                        colors: ['#4a46d6', '#964cc6'],
                        start: { x: 0, y: 0 },
                        end: { x: 0, y: 1 },
                    }}
                    buttonStyle={{ borderRadius: 30 }}
                    onPress={() => {
                        this.setState({ isVisibleModal_failed: false, isVisibleModal_success: false }, () => {
                            if (isLast) {
                                this.props.onNext({ face_verified: false });
                            }
                        });
                    }}
                    containerStyle={{ marginTop: 25, width: 250, alignSelf: 'center' }} />
                {isLast ? null : <Button title="CANCEL" titleStyle={styles.failedCont}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#ffffff', '#efefef'],
                        start: { x: 0, y: 0 },
                        end: { x: 0, y: 1 },
                    }}
                    buttonStyle={{ borderRadius: 30 }}
                    onPress={() => {
                        this.setState({ isVisibleModal_failed: false, isVisibleModal_success: false }, () => {

                            const isContinueVerify = this.props.navigation.getParam("isContinueVerify");
                            if (isContinueVerify != null) {
                                const continueVerify = this.props.navigation.getParam("continueVerify");
                                this.props.navigation.goBack(null);
                                continueVerify(false)
                            } else {
                                this.props.onNext({ face_verified: false });
                            }

                        });

                    }}
                    containerStyle={{ marginTop: 15, width: 250, alignSelf: 'center' }} />}
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        cameraStatus: state.startup.cameraStatus
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setCameraStatus: data => dispatch(StartupActions.updateCameraState(data)),
    };
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ProfileFourth))

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        height: '100%',
        justifyContent: 'flex-end'
    },
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
        fontFamily: 'ProximaNova-Bold',
        color: '#91919d',
        fontSize: 17,
        textAlign: 'center',
        marginTop: 25
    }
});
