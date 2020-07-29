import React, { Component } from 'react'
import { View, Text, ScrollView, Image, Dimensions } from 'react-native'
//import RNFS from 'react-native-fs'

import { Images } from 'App/Theme'
import { Icon, Button, Overlay } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import ImagePicker from 'react-native-image-crop-picker';
import ImagePicker1 from "react-native-image-picker";
import { DBServices, userDetails } from 'App/realm'
import IIcons from "react-native-vector-icons/FontAwesome"

import DynamicCropper from "react-native-dynamic-cropper";
import ActionSheet from 'react-native-actionsheet'

const RNFS = require('react-native-fs');

const { width, height } = Dimensions.get('window');

export default class ProfileThird extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profile_image: null,
			profile_image_b64: null,
			isShowingCrop: false,
			imageWidth: 0,
			imageHeight: 0,
			isVisibleModal_success: false,
			isVisibleModal_failed: false
		};
		this.user = userDetails.objects('userDetails');
	}

	openImagePicker(index) {
		if (index == 0) {
			ImagePicker.openCamera({ width: 600, height: 600, cropping: true })
				.then(response => {
					// console.log("response for image", response);
					// userDetails.write(() => {
					// 	this.user.image = JSON.stringify(response)
					// });

					// console.log("suerdeada", this.user)
					this.continuePhoto(response.path)

				}).catch(err => {
					console.log('PickingCameraErr', err)
				})
		} else if (index == 1) {
			if (Platform.OS == 'ios') {
				ImagePicker1.launchImageLibrary({ maxHeight: 600, maxWidth: 600 }, (response) => {
					if (response.didCancel) {
						console.log('User cancelled image picker');
					} else if (response.error) {
						console.log('ImagePicker Error: ', response.error);
					} else {
						// userDetails.write(() => {
						// 	this.user.image = JSON.stringify(response)
						// });
	
						// console.log("suerdeada", this.user)
						this.continuePhoto(response.uri.substring('file:///'.length));
					}
				});
			}
			else {
				ImagePicker.openPicker({ width: 600, height: 600, cropping: true })
					.then(response => {
						console.log('response from imagePicker -> ', response)
	
						// console.log("suerdeada", this.user)
						this.continuePhoto(response.path)
					}).catch(err => {
						console.log('PickingGalleryErr', err)
					})
			}
		}
	}

	continuePhoto(path) {

		console.log("continuePhoto -> ", path)
		if (Platform.OS === "ios") {
			DynamicCropper.cropImage(path, {}).then(async newlyCroppedImagePath => {
				console.log(newlyCroppedImagePath);
				if (newlyCroppedImagePath != null && newlyCroppedImagePath != '') {
					// this.setPhotoImage(newlyCroppedImagePath)

					let response = await RNFS.readFile(newlyCroppedImagePath, 'base64');
					// console.log(response);
					// DBServices.saveUserInfo(JSON.stringify(response));

					this.setState({
						// profile_image: { uri: newlyCroppedImagePath },
						profile_image: newlyCroppedImagePath,
						profile_image_b64: "data:image/jpeg;base64," + response,
						isShowingCrop: true,
						isVisibleModal_success: false
					});
				}
			});
		} else {
			this.setState({
				//profile_image: { uri: response.uri },
				profile_image: path,
				profile_image_b64: path,
				isShowingCrop: true,
				isVisibleModal_success: false
			});
		}

		// const url = "file://" + newlyCroppedImagePath;
		// console.log("url", url);
		// detectFaces(url).then(result => {
		// 	if (result.faces) {
		// 		this.setState({
		// 			//profile_image: { uri: response.uri },
		// 			profile_image: url,
		// 			isShowingCrop: true,
		// 			isVisibleModal_success: true
		// 		});
		// 	} else {
		// 		console.log("results", result);
		// 		this.setState({ isVisibleModal_failed: true })
		// 	}
		// }, error => {
		// 	console.log("error", error);
		// 	this.setState({ isVisibleModal_failed: true })
		// });
	}

	handleCamera = () => {
		this.ActionSheet.show()
	};

	handleCamera1 = () => {
		let options = {
			title: "Select Image",
			storageOptions: {
				skipBackup: true,
				path: "images"
			},
			allowsEditing: false,
			maxWidth: 325,
			maxHeight: 325
		};

		ImagePicker1.showImagePicker(
			options,
			response => {
				console.log("Response = ", response);

				if (response.didCancel) {
					console.log("User cancelled image picker");
				} else if (response.error) {
					console.log("ImagePicker Error: ", response.error);
				} else if (response.customButton) {
					console.log("User tapped custom button: ", response.customButton);
				} else {

					this.setState({
						//profile_image: { uri: response.uri },
						profile_image: response.uri,
						profile_image_b64: "data:image/jpeg;base64," + response.data,
						imageWidth: response.width,
						imageHeight: response.height,
						isShowingCrop: true,
						isVisibleModal_success: false
					});

					// detectFaces(response.uri).then(result => {
					// 	if (result.faces) {
					// 		this.setState({
					// 			//profile_image: { uri: response.uri },
					// 			profile_image: response.uri,
					// 			profile_image_b64: "data:image/jpeg;base64," + response.data,
					// 			imageWidth: response.width,
					// 			imageHeight: response.height,
					// 			isShowingCrop: true,
					// 			isVisibleModal_success: true
					// 		});
					// 	} else {
					// 		this.setState({ isVisibleModal_failed: true })
					// 	}
					// }, _ => {
					// 	this.setState({ isVisibleModal_failed: true })
					// });

				}
			},
			function (err) {
				console.log("err: ", err);
			}
		);
	};

	onClearImage() {
		this.setState({ profile_image: null })
	}

	handleNext = () => {
		if (this.state.profile_image == null) {
			alert('Please select your photo');
			return
		}
		userDetails.write(() => {
			userDetails.delete(this.user);
		});
		DBServices.saveUserInfo({image: this.state.profile_image})
		this.props.onNext(this.state);
	};

	onCloseModal() {
		this.setState({ isVisibleModal_failed: false, isVisibleModal_success: false })
	}

	renderFailedModalContent() {
		const failedMsg = "Face Not Recognized";
		const failedContent = "Please try again.";
		return (
			<View style={{ alignItems: 'center' }}>
				<View style={{ width: 130, height: 130, alignItems: 'center', justifyContent: 'flex-end' }}>
					<View style={styles.failedSubView}>
						<IIcons name={'close'} size={50} color={"#fd2d65"} />
					</View>
				</View>
				<Text style={styles.failedMsg}>{failedMsg}</Text>
				<Text style={styles.failedCont}>{failedContent}</Text>
				<Button title="TRY AGAIN"
					ViewComponent={LinearGradient} titleStyle={{ fontFamily: 'ProximaNova-Bold' }}
					linearGradientProps={{
						colors: ['#4a46d6', '#964cc6'],
						start: { x: 0, y: 0 },
						end: { x: 0, y: 1 },
					}}
					buttonStyle={{ borderRadius: 30 }}
					onPress={() => {
						this.setState({ isVisibleModal_failed: false, isVisibleModal_success: false });
						setTimeout(() => {
							this.handleCamera();
						}, 500);
					}}
					containerStyle={{ marginTop: 25, width: 250, alignSelf: 'center' }} />
				<Button title="CANCEL" titleStyle={{ fontFamily: 'ProximaNova-Bold' }}
					ViewComponent={LinearGradient}
					titleStyle={{ color: "#91919d" }}
					linearGradientProps={{
						colors: ['#ffffff', '#efefef'],
						start: { x: 0, y: 0 },
						end: { x: 0, y: 1 },
					}}
					buttonStyle={{ borderRadius: 30 }}
					onPress={() => {
						this.setState({ isVisibleModal_failed: false, isVisibleModal_success: false });
					}}
					containerStyle={{ marginTop: 15, width: 250, alignSelf: 'center' }} />
			</View>
		)
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

	render() {
		return (
			<ScrollView>
				<View style={{ marginLeft: '7%', marginRight: '7%' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '4%' }}>
						<Image source={Images.Image02} />
						<Text style={{ marginLeft: 20, fontSize: 25, color: '#17144e', fontFamily: 'ProximaNova-Bold' }}>
							{"Add Your Profile \nPicture"}
						</Text>
					</View>
					{
						this.state.profile_image == null ?
							(
								<Button title="BROWSE" titleStyle={{ color: '#91919d', fontFamily: 'ProximaNova-Bold' }}
									ViewComponent={LinearGradient}
									linearGradientProps={{
										colors: ['#ffffff', '#efefef'],
										start: { x: 0, y: 0 },
										end: { x: 0, y: 1 },
									}}
									icon={<Icon name='ios-camera' type='ionicon' color='grey' containerStyle={{ marginRight: 10 }} />}
									buttonStyle={{ borderRadius: 30 }}
									onPress={this.handleCamera}
									containerStyle={{ marginBottom: 5, marginTop: 30 }} />
							) : (
								<View style={{ marginTop: 40 }}>
									<Image source={{ uri: this.state.profile_image_b64 }} style={{ width: width - 50, height: 420, alignSelf: 'center' }} resizeMode='contain' />
									{/* <Image source={this.state.profile_image} style={{ width: 350, height: 420, alignSelf: 'center' }} resizeMode='cover' /> */}
									<Icon name='md-close-circle' type='ionicon' color='red' containerStyle={{ position: 'absolute', right: 4, top: 12, margin: 0 }}
										onPress={() => { this.onClearImage() }} />
								</View>
							)
					}
					<Button title="FINISH"
						ViewComponent={LinearGradient}
						linearGradientProps={{
							colors: ['#4a46d6', '#964cc6'],
							start: { x: 0, y: 0 },
							end: { x: 0, y: 1 },
						}}
						buttonStyle={{ borderRadius: 30 }}
						icon={<Icon name='md-arrow-round-forward' type='ionicon' color='white' containerStyle={{ position: 'absolute', right: 12 }} />}
						onPress={this.handleNext}
						titleStyle={{ fontSize: 16, fontFamily: 'ProximaNova-Bold' }}
						containerStyle={{ marginBottom: 5, marginTop: 30 }} />

					<Overlay isVisible={this.state.isVisibleModal_failed} width='auto' height='auto' borderRadius={14}
						overlayStyle={{ padding: 30 }}>
						{this.renderFailedModalContent()}
					</Overlay>

					<Overlay isVisible={this.state.isVisibleModal_success} width='auto' height='auto' borderRadius={14}
						overlayStyle={{ padding: 30 }}>
						{this.renderSuccessModalContent()}
					</Overlay>
				</View>
				<ActionSheet
					ref={o => this.ActionSheet = o}
					title={'Which one do you like ?'}
					options={['Pick from Camera', 'Pick from Gallery', 'Cancel']}
					cancelButtonIndex={2}
					destructiveButtonIndex={1}
					onPress={(index) => { this.openImagePicker(index) }}
				/>
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
