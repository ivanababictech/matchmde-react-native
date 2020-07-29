import React, { Component } from 'react'
import { View, Text, Image, FlatList, Dimensions, ImageBackground, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { Icon, Avatar, Button, Header, Overlay } from 'react-native-elements'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker';
import NativeImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient'
import { userService } from 'App/Services/UserService'
import UserActions from 'App/Stores/User/Actions'
import Spinner from 'react-native-spinkit';
import AmazingCropper from "react-native-amazing-cropper";

import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import { DraggableGrid } from 'react-native-draggable-grid';
import DynamicCropper from "react-native-dynamic-cropper";
import RNFetchBlob from "rn-fetch-blob";

const itemWidth = Dimensions.get('window').width / 3 - 20;
const itemHeight = itemWidth * 1.11;

const itemArray = ['one', 'two', 'three', 'four', 'five', 'six'];

const init_data = [
	{ photos: '1', key: 'item1' },
	{ photos: '2', key: 'item2' },
	{ photos: '3', key: 'item3' },
	{ photos: '4', key: 'item4' },
	{ photos: 0, key: 'item5' },
	{ photos: 0, key: 'item6' },
];

class EditPhotoScreen extends Component {
	static navigationOptions = {
		title: 'Photos'
	};

	constructor(props) {
		super(props);
		this.state = {
			photos: [],//Array.from({length: 6}, (v, i) => 0),
			data: init_data,
			selectedOrder: -1,
			loading: false,
			isLoading: false,
			imageUri: "",
			isCrop: false,
			imageWidth: 0,
			imageHeight: 0,
			scrollEnabled: true
		}
	}

	componentWillMount() {
		this.refreshPhotos()
	}

	refreshPhotos() {

		this.setState({ data: [] });

		if (this.props.photos.length < 6) {
			const photos = this.props.photos.concat(Array.from({ length: 6 - this.props.photos.length }, (v, i) => 0));
			// this.setState({ photos: photos })
			let data = [];
			let i = 0;
			photos.map((v, index) => {
				data.push({ photos: v, key: `item${index}` })
			});
			this.setState({ data: data });
			console.log('init data', data)
		} else {
			const photos = [...this.props.photos];
			// this.setState({ photos: photos })
			let data = [];
			photos.map((v, index) => {
				data.push(({ photos: v, key: `item${index}` }))
			});
			this.setState({ data: data })
		}

	}

	refreshProfile() {
		const data = this.state.data;
		if (data[0].photos != 0) {
			let profile = { ...this.props.profile };
			profile.picture = data[0].photos.url;
			console.log("before p -> ", this.props.profile.picture);
			this.props.updateProfilePhotos({ profile: profile });
			console.log("after p -> ", this.props.profile.picture);

			userService.post(this.props.userToken.access_token, '/account/profile', profile)
		}
	}

	updatePhotos() {
		this.setState({
			loading: true
		});

		const data = this.state.data;
		let uPhotos = [];
		let i = 0;

		data.map((v, index) => {
			if (v.photos != 0) {
				const photo = v.photos;
				uPhotos.push({
					id: photo.id,
					order: i,
					thumbnail: photo.thumbnail,
					url: photo.url
				});

				i++
			}
		});

		console.log('updated photos', uPhotos);

		userService.updatePhotos(this.props.userToken.access_token, uPhotos)
			.then(res => {
				console.log('updated photos from server', res);
				const photos = { photos: res.data };
				this.props.updateProfilePhotos(photos);
				this.setState({
					loading: false
				});
				this.refreshPhotos();
				this.refreshProfile()
			}).catch(err => {
				console.log(err);
				this.setState({
					loading: false
				})
			})
	}

	onShowActionSheet(order) {
		this.setState({ selectedOrder: order });
		this.ActionSheet.show()
	}

	openImagePicker(index) {
		if (index == 0) {
			ImagePicker.openCamera({ width: 600, height: 600, cropping: true })
				.then(response => {
					if (Platform.OS === 'ios') {
						DynamicCropper.cropImage(response.path, {}).then(newlyCroppedImagePath => {
							console.log(newlyCroppedImagePath);
							if (newlyCroppedImagePath != null && newlyCroppedImagePath != '') {
								this.setPhotoImage(newlyCroppedImagePath)
							}
						});
					} else {
						this.setPhotoImage(response.path)
					}

				}).catch(err => {
					console.log('PickingCameraErr', err)
				})
		} else if (index == 1) {
			if (Platform.OS === 'ios') {
				NativeImagePicker.launchImageLibrary({ maxHeight: 600, maxWidth: 600 }, (response) => {
					if (response.didCancel) {
						console.log('User cancelled image picker');
					} else if (response.error) {
						console.log('ImagePicker Error: ', response.error);
					} else {
						DynamicCropper.cropImage(response.uri.substring('file:///'.length), {}).then(newlyCroppedImagePath => {
							console.log(newlyCroppedImagePath);
							if (newlyCroppedImagePath != null && newlyCroppedImagePath != '') {
								this.setPhotoImage(newlyCroppedImagePath)
							}
						});
					}
				});
			}
			else {
				ImagePicker.openPicker({ width: 600, height: 600, cropping: false, mediaType: 'photo' })
					.then(response => {
						console.log('response from imagePicker -> ', response);
						this.setPhotoImage(response.path)
					}).catch(err => {
						console.log('PickingGalleryErr', err)
					})
			}
		}
	}

	setPhotoImage(croppedImageUri) {

		this.setState({
			isLoading: true,
			isCrop: false,
		});

		userService.uploadImageToAWS3(croppedImageUri).then(uploadedLocaion => {
			console.log(uploadedLocaion);
			// RNFetchBlob.fs
			// 	.unlink(croppedImageUri)
			// 	.then(() => {
			// 		console.log("File deleted");
			// 	})
			this.postProfileImage(uploadedLocaion)
		}).catch(err => {
			this.setState({
				isLoading: false
			});
			// RNFetchBlob.fs
			// 	.unlink(croppedImageUri)
			// 	.then(() => {
			// 		console.log("File deleted");
			// 	})
			alert('Upload failed, try again.');
			console.log('PickingGalleryErr', err)
		})

	}

	postProfileImage(photoUrl) {

		const body = {
			thumbnail: photoUrl,
			url: photoUrl,
			order: this.state.selectedOrder
		};
		userService.uploadOnePhoto(this.props.userToken.access_token, body)
			.then(res => {
				console.log(res);
				this.setState({
					isLoading: false
				});
				const photos = { photos: res.data };
				this.props.updateProfilePhotos(photos);
				this.refreshPhotos()

			}).catch(err => {
				this.setState({
					isLoading: false
				});
				alert('Upload failed, try again.');
				console.log(err)
			})
	}

	onDeletePhotoItem(index, item) {

		if (this.props.photos.length == 1) {
			alert("You need one image at least, can't delete this image.");
			return
		}

		this.setState({
			isLoading: true
		});
		console.log('delete item', item.photos);
		userService.deletePhotoItem(this.props.userToken.access_token, item.photos.id)
			.then(res => {
				console.log("deleted item from server -> ", res);
				this.setState({
					isLoading: false
				});
				var array = [...this.props.photos]; // make a separate copy of the array
				var index = this.props.photos.indexOf(item.photos);
				console.log("deleted item index from server -> ", index);
				if (index !== -1) {
					const photos = { data: array.filter(v => v.id != item.photos.id) };
					console.log('Ephotos', photos);
					this.props.updateProfilePhotos({ photos: photos });
					this.refreshPhotos();
					this.refreshProfile()
				}
			}).catch(err => {
				this.setState({
					isLoading: false
				});
				alert("Can't delete this picture now, try again later.");
				console.log('Delete error', err)
			})
	}

	renderHeaderLeft = () => {
		return (
			<TouchableOpacity onPress={() => { this.props.navigation.goBack(null) }} style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Icon name='ios-arrow-back' color='#17144e' type='ionicon' />
				<Text style={{ marginLeft: 10, color: '#17144e' }}>Back</Text>
			</TouchableOpacity>
		)
	};

	renderHeaderCenter = () => {
		return (
			<Text style={{ fontSize: 21, color: '#17144e', fontWeight: 'bold' }}>Photos</Text>
		)
	};

	render() {
		console.log("current data list -> ", this.state.data);

		if (this.state.isCrop) {
			return (
				<View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
					<AmazingCropper
						onDone={this.setPhotoImage}
						onCancel={() => this.setState({ isCrop: false })}
						imageUri={this.state.imageUri}
						imageWidth={this.state.imageWidth}
						imageHeight={this.state.imageHeight}
						NOT_SELECTED_AREA_OPACITY={0.3}
						BORDER_WIDTH={20}
					/>
				</View>
			);
		} else {
			return (
				<View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
					<Header leftComponent={this.renderHeaderLeft} backgroundColor='transparent' centerComponent={this.renderHeaderCenter} />
					<ScrollView scrollEnabled={false}>
						<View>
							<DraggableGrid
								data={this.state.data}
								renderItem={this.renderItem}
								numColumns={3}
								// onDragStart={() => { this.setState({ scrollEnabled: false }) }}
								onDragRelease={(data) => { console.log("data", data); this.state.data = data }}
							/>
							<Text style={{ width: '100%', marginTop: 10, marginBottom: 10, textAlign: 'center', color: '#9a9493' }}>
								Hold and drag your photos to arrange the order
							</Text>
							<Button title='SAVE' titleStyle={{ fontWeight: 'bold' }}
								ViewComponent={LinearGradient}
								linearGradientProps={{
									colors: ['#4a46d6', '#964cc6'],
									start: { x: 0, y: 0 },
									end: { x: 0, y: 1 },
								}}
								buttonStyle={{ borderRadius: 30 }}
								loading={this.state.loading}
								onPress={() => this.updatePhotos()}
								containerStyle={{ marginBottom: 15, marginLeft: 20, marginRight: 20 }}
							/>
						</View>
					</ScrollView>

					<Overlay width='auto' height='auto' overlayStyle={{ padding: 30 }} isVisible={this.state.isLoading}
						onBackdropPress={() => this.setState({ isLoading: false })}
						borderRadius={15}>
						<Spinner type='Circle' color='#3cb9fc' />
					</Overlay>

					<ActionSheet
						ref={o => this.ActionSheet = o}
						title={'Which one do you like ?'}
						options={['Pick from Camera', 'Pick from Gallery', 'Cancel']}
						cancelButtonIndex={2}
						destructiveButtonIndex={1}
						onPress={(index) => { this.openImagePicker(index) }}
					/>
				</View>
			)
		}


	}

	renderItem = (item1, index1) => {
		const item = item1;
		const index = index1;
		if (item.photos === 0) {
			return (
				<View key={item.key} style={{ margin: 0 }}>
					<View style={{ margin: 0, backgroundColor: '#efecf0', width: itemWidth, height: itemHeight - 10, borderRadius: 10 }}>
						<Icon name='pluscircle' type='antdesign' color='#b537f2' size={30}
							containerStyle={{ alignSelf: 'flex-end', margin: 5 }}
							onPress={() => { this.onShowActionSheet(index) }} />
						<Avatar size={30} rounded title={`${index + 1}`} containerStyle={styles.badgeStyle} titleStyle={styles.badgeTitleStyle} />
					</View>
				</View>
			)
		} else {
			if (index1 == 0) {
				return (
					<View key={item.key} style={{ margin: 0, borderWidth: 2, borderColor: 'rgb(30,144,255)', borderRadius: 12 }}>
						<ImageBackground style={{ width: itemWidth, height: itemHeight - 10, margin: 0, borderRadius: 10 }} resizeMode='stretch'
						>
							<Image source={{ uri: item.photos.url }} style={{ width: itemWidth, height: itemHeight - 10, borderRadius: 10, position: 'absolute' }} />
							<Icon name='closecircle' type='antdesign' color='#fd2d65' size={30}
								containerStyle={{ alignSelf: 'flex-end', margin: 5 }}
								onPress={() => { this.onDeletePhotoItem(index, item) }} />
							<Avatar size={30} rounded title={`${index + 1}`} containerStyle={styles.badgeStyle} titleStyle={styles.badgeTitleStyle} />
						</ImageBackground>
					</View>
				)
			} else {
				return (
					<View key={item.key} style={{ margin: 0 }}>
						<ImageBackground style={{ width: itemWidth, height: itemHeight - 10, margin: 0, borderRadius: 10 }} resizeMode='stretch'
						>
							<Image source={{ uri: item.photos.url }} style={{ width: itemWidth, height: itemHeight - 10, borderRadius: 10, position: 'absolute' }} />
							<Icon name='closecircle' type='antdesign' color='#fd2d65' size={30}
								containerStyle={{ alignSelf: 'flex-end', margin: 5 }}
								onPress={() => { this.onDeletePhotoItem(index, item) }} />
							<Avatar size={30} rounded title={`${index + 1}`} containerStyle={styles.badgeStyle} titleStyle={styles.badgeTitleStyle} />
						</ImageBackground>
					</View>
				)
			}

		}
	};

	keyExtractor = (item, index) => index.toString()
}
const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
		photos: state.user.photos.data,
		userToken: state.startup.userToken
	}
};

const mapDispatchToProps = dispatch => {
	return {
		updateProfilePhotos: (photo) => dispatch(UserActions.fetchUserSuccess(photo))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPhotoScreen)

const styles = StyleSheet.create({
	badgeStyle: {
		position: 'absolute',
		bottom: 5,
		left: 5,
	},
	badgeTitleStyle: {
		color: '#fff'
	}
});