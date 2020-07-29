import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Button, Header, Icon, ListItem, Overlay } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import { thousands_separators } from 'App/Services/HelperServices'
import { Images } from 'App/Theme'
import { userService } from 'App/Services/UserService'
import { withNavigation } from 'react-navigation'

import UserActions from 'App/Stores/User/Actions'

import BoostSuccessModal from 'App/Components/Boost/BoostSuccessModal'

class BoostScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			isSuccess: false,
			fromDiscover: this.props.navigation.getParam("fromDiscover")
		}
	}

	onBoost() {
		this.setState({ loading: true });
		userService.post(this.props.userToken.access_token, '/purchase/boost/1', null)
			.then(res => {
				console.log(res);
				if (res.data.result) {
					this.setState({ loading: false, isSuccess: false });
					alert("Boost currently active. Please wait for Boost to end to purchase again.")
				}
				else {
					this.setState({ loading: false, isSuccess: true }, () => {
						this.updateMyBalance(res.data)
					})
				}
			}).catch(err => {
				console.log('BoostErrResponse', err);
				this.setState({ loading: false, isSuccess: false });
				alert("Insufficient Match $")
			})
	}

	updateMyBalance(res) {
		let profile = { ...this.props.profile };
		profile.balance = res.balance;
		profile.is_boosted = true;
		profile.boosted_end_date = res.boosted_end_date;
		this.props.updateProfilePhotos({ profile: profile })
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
				<Header backgroundColor='transparent' leftComponent={this.header_left} centerComponent={this.render_headerCenter}
					rightComponent={this.render_HeaderRight} />
				<ScrollView>
					<Image source={Images.RocketBoost} style={{ width: 127, height: 127, marginVertical: 25, alignSelf: 'center' }} resizeMode='contain' />
					<Text style={styles.label1}>Stand Out From the Crowd</Text>
					<Text style={styles.label2}>{'Be seen in your vicinity and get more \nMatches!'}</Text>
					<View style={styles.boostCardWrap}>
						<Image source={Images.RocketBoost} style={{ width: 68, height: 68 }} resizeMode='contain' />
						<Text style={styles.label3}>1 Boost</Text>
						<Text style={styles.label4}>500 Match $</Text>
					</View>
					<Button title="CONTINUE" titleStyle={{ fontWeight: 'bold' }}
						ViewComponent={LinearGradient}
						linearGradientProps={{
							colors: ['#4a46d6', '#964cc6'],
							start: { x: 0, y: 0 },
							end: { x: 0, y: 1 },
						}}
						loading={this.state.loading}
						buttonStyle={{ borderRadius: 30 }}
						onPress={() => { this.onBoost() }}
						containerStyle={{ marginBottom: 5, width: 300, alignSelf: 'center' }}
					/>
				</ScrollView>
				<Overlay isVisible={this.state.isSuccess} width='auto' height='auto' borderRadius={14}
					overlayStyle={{ padding: 30 }}>
					<BoostSuccessModal colseOverlay={() => {
						if (this.state.fromDiscover != null) {
							this.props.navigation.goBack(null);
						}
						this.setState({ isSuccess: false })
					}} />
				</Overlay>
			</View>
		)
	}

	header_left = () => {
		return (
			<TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Icon name='ios-arrow-back' type='ionicon' containerStyle={{ marginRight: 4 }} color='#17144e' />
				<Text style={styles.headerLeftText}>Back</Text>
			</TouchableOpacity>
		);
	};

	render_headerCenter = () => {
		return (
			<Text style={{ color: '#17144e', fontSize: 21, fontWeight: 'bold' }}>Boost</Text>
		);
	};

	render_HeaderRight = () => {
		return (
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Image source={Images.DollarCoinStack} style={{ width: 20, height: 21 }} resizeMode='contain' />
				<Text>{thousands_separators(this.props.profile.balance)}</Text>
			</View>
		)
	}
}

const mapStateToProps = state => {
	return {
		userToken: state.startup.userToken,
		profile: state.user.profile
	}
};

const mapDispatchToProps = dispatch => {
	return {
		updateProfilePhotos: (photo) => dispatch(UserActions.fetchUserSuccess(photo))
	}
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(BoostScreen))

let styles = {
	label1: {
		fontSize: 24,
		color: '#17144e',
		alignSelf: 'center'
	},
	label2: {
		marginTop: 15,
		fontSize: 17,
		color: '#91919d',
		alignSelf: 'center',
		textAlign: 'center'
	},
	boostCardWrap: {
		width: 195,
		height: 215,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		borderRadius: 8,
		marginTop: 45,
		marginBottom: 30,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	label3: {
		color: '#17144e',
		fontSize: 17,
		marginTop: 15
	},
	label4: {
		fontSize: 23,
		fontWeight: 'bold',
		color: '#17144e',
	}
};
