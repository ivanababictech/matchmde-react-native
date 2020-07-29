import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, FlatList } from 'react-native'
import { Header, Icon, Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import MapView, { Marker } from 'react-native-maps';
import { getPhotoUrl } from 'App/Services/HelperServices'
import ValidateModalView from 'App/Components/Messages/validateModalView';
import moment from "moment";
import { withNavigation } from 'react-navigation'

import { Images } from 'App/Theme'
import FIcons from "react-native-vector-icons/FontAwesome"
import { gray } from 'ansi-colors';
import { userService } from '../../Services/UserService';
import { connect } from 'react-redux'

let screenWidth = Dimensions.get('window').width;
let spotImageHeight = screenWidth * 0.76;
let mapHeight = Dimensions.get('window').width;

class DateSpotDetailScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false,
			place: this.props.navigation.getParam('place'),
			isLike: false,
			users: [],
		}
	}

	componentDidMount() {
		this.getPlaceInfo()
	}

	getPlaceInfo() {

		userService.get_request(this.props.userToken.access_token, '/hangouts/rate/' + this.state.place.id)
			.then(res => {
				this.setState({
					isLike: res.data.like_me,
					users: res.data.users
				});
			}).catch(err => {
				console.log('getplaceinfo error -> ', err)
			})
	}

	likePlace() {
		userService.post(this.props.userToken.access_token, '/hangouts/rate/' + this.state.place.id)
			.then(res => {
				this.setState({
					isLike: !this.state.isLike
				})
			}).catch(err => {
				console.log('getplaceinfo error -> ', err)
			})
	}

	onAddDateSpot = () => {
		// this.setState({ isModalVisible: true });

		console.log("DateSpotDetail placeid -> ", this.state.place.place_id);

		this.props.navigation.navigate("DateList", {
			placeId: this.state.place.place_id,
			placeName: this.state.place.name,
			placeAddress: this.state.place.formatted_address,
			placeUrl: this.state.place.url,
			placeIcon: this.state.place.icon,
			placePhotos: this.state.place.photos,
			phoneNumber: this.state.place.international_phone_number,
			coordinate: {
				latitude: this.state.place.latitude,
				longitude: this.state.place.longitude
			}
		});
	};

	onAccept = () => {

	};

	render() {
		const { place } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
				<Header leftComponent={this.renderHeaderLeft} backgroundColor='transparent' centerComponent={this.renderHeaderCenter} />
				<ScrollView>
					<Image source={{ uri: getPhotoUrl(place.photos) }} style={{ width: screenWidth, height: spotImageHeight }} resizeMode='cover' />
					{
						!this.state.isLike ? (
							<TouchableOpacity style={styles.starCircle} onPress={() => this.likePlace()}>
								<Image source={Images.TinyStarBlue} />
							</TouchableOpacity>
						) : (
							<TouchableOpacity style={styles.starCircle_like} onPress={() => this.likePlace()}>
								<Image source={Images.TinyStarBlue} style={{tintColor: 'white'}}/>
							</TouchableOpacity>
						)

					}

					<Text style={styles.spotTitle}>{place.name}</Text>
					<Text style={styles.spotAddress}>{place.formatted_address}</Text>
					{/*<Text style={styles.spotSite}>www.marinabaysands.com</Text>*/}
					<MapView
						initialRegion={{
							latitude: Number(place.latitude),
							longitude: Number(place.longitude),
							latitudeDelta: 0.0008,
							longitudeDelta: 0.0008,
						}}
						style={styles.spotMap}>
						<Marker
							coordinate={{ latitude: Number(place.latitude), longitude: Number(place.longitude) }}
							title={place.name}
							description={place.formatted_address}
						>
							<FIcons name={'map-marker'} size={30} color='#E94335' />
						</Marker>
					</MapView>
					<Text style={{marginLeft:15, color:'#17144e', fontSize:17, marginBottom: 10}}>Members Who Like it Here</Text>
					<FlatList
					    data={this.state.users}
					    horizontal={true}
					    renderItem={this.renderMembers}
					    keyExtractor={(item, index) => index.toString() }/>
					<Button title="ASK MATCH FOR A DATE" titleStyle={{ fontWeight: 'bold' }}
						ViewComponent={LinearGradient}
						linearGradientProps={{
							colors: ['#4a46d6', '#964cc6'],
							start: { x: 0, y: 0 },
							end: { x: 0, y: 1 },
						}}
						buttonStyle={{ borderRadius: 30, marginTop: 20 }}
						onPress={this.onAddDateSpot}
						containerStyle={{ marginBottom: 5, width: 320, alignSelf: 'center' }}
					/>
				</ScrollView>
				<ValidateModalView
					modalVisible={this.state.isModalVisible}
					photo={this.state.userPhoto}
					name={this.state.userName}
					placeName={place.name}
					placeAddress={place.formatted_address}
					placeUrl={place.placeUrl}
					date={moment(Math.floor(Date.now())).format("YYYY-MM-DD HH:mm:ss")}
					onCancel={() => { this.setState({ isModalVisible: false }); }}
					onAccept={() => { this.onAccept(); }}
				/>
			</View>
		)
	}

	renderMembers = ({ item }) => {
		if(item){
			return (
				<TouchableOpacity 
					onPress={()=>{ this.props.navigation.push('OtherUserDetail_3', {other:item, isMatched: true, onSwiped:(isLiked)=>{ this.likeUnlikePerson(item, isLiked) } }); }}
				>
					<Image source={{ uri: (item || '').picture || '' }} style={{ width: 52, height: 52, borderRadius: 26, margin: 10 }} resizeMode='stretch' />
				</TouchableOpacity>
			)
		} else return null;

	};

	renderHeaderLeft = () => {
		return (
			<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { this.props.navigation.goBack(null) }}>
				<Icon name='ios-arrow-back' type='ionicon' color='#17144e' />
				<Text style={{ marginLeft: 10 }}>Back</Text>
			</TouchableOpacity>
		)
	};

	renderHeaderCenter = () => {
		return (
			<Text style={{ fontSize: 21, color: '#17144e', fontWeight: 'bold' }}>Date Spots</Text>
		)
	}
}

const mapStateToProps = state => {
	return {
		userToken: state.startup.userToken,
		profile: state.user.profile
	}
};

export default withNavigation(connect(mapStateToProps)(DateSpotDetailScreen))

let styles = {
	starCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-end',
		marginEnd: 10,
		marginTop: -40,
		shadowOpacity: 0.25,
		shadowRadius: 5,
		shadowColor: gray,
		shadowOffset: { height: 0, width: 0 }
	},
	starCircle_like: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#3cb9fc',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-end',
		marginEnd: 10,
		marginTop: -40,
		shadowOpacity: 0.25,
		shadowRadius: 5,
		shadowColor: gray,
		shadowOffset: { height: 0, width: 0 }
	},
	spotTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 10,
		marginLeft: 10,
		color: '#17144e'
	},
	spotAddress: {
		color: '#91919d',
		fontSize: 17,
		marginTop: 10,
		marginLeft: 10,
	},
	spotSite: {
		color: '#3cb9fc',
		fontSize: 17,
		marginLeft: 10,
	},
	spotMap: {
		width: screenWidth,
		height: screenWidth * 0.21,
		marginTop: 20,
		marginBottom: 20
	},

};
