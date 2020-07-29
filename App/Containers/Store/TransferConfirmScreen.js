import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, TextInput, Keyboard } from 'react-native'
import { Button, Header, Icon, ListItem, Avatar, Overlay } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'

import * as i18nIsoCountries from 'i18n-iso-countries'
i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));
import { thousands_separators } from 'App/Services/HelperServices'

import { userService } from 'App/Services/UserService'
import { Images } from 'App/Theme'
import UserActions from 'App/Stores/User/Actions'

class TransferConfirmScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0,//'',
			otherUser: this.props.navigation.getParam('from'),
			action: this.props.navigation.getParam('action', 'send'),
			loading: false,
			isVisibleSucces: false
		}
	}

	onConfirm() {
		const amount = Number(this.state.value);
		this.setState({ loading: true });
		if (this.state.action == 'send') {
			if (amount == 0 || amount > this.props.profile.balance) {
				alert('Please input correct amount');
				return;
			}
			const body = { to: this.state.otherUser.id, amount: this.state.value };
			userService.post(this.props.userToken.access_token, '/transfers', body)
				.then(res => {
					this.setState({ loading: false, isVisibleSucces: true });
					let profile = { ...this.props.profile };
					profile.balance = res.data.balance;
					this.props.updateProfilePhotos({ profile: profile })
				}).catch(err => {
					this.setState({ loading: false })
				})
		} else {
			if (amount == 0) {
				alert('Please input correct amount');
				return;
			}
			const body = { to: this.state.otherUser.id, amount: this.state.value };
			userService.post(this.props.userToken.access_token, '/transfer_requests', body)
				.then(res => {
					this.setState({ loading: false, isVisibleSucces: true })
				}).catch(err => {
					this.setState({ loading: false })
				})
		}
	}

	back() {
		this.setState({ isVisibleSucces: false });
		setTimeout(() => this.props.navigation.pop(2), 400)
	}

	getFormattedString(num) {
		var nf = new Intl.NumberFormat();
		return nf.format(num)
	}

	render() {
		return (
			<TouchableOpacity style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }} activeOpacity={1.0}>
				<Header backgroundColor='transparent' leftComponent={this.header_left} centerComponent={this.render_headerCenter} />
				<Avatar rounded source={{ uri: this.state.otherUser.picture, }}
					size='xlarge' containerStyle={{ alignSelf: 'center', marginTop: 20 }} />
				<Text style={[styles.nameLabel, { marginLeft: 20, marginRight: 20 }]}>{this.state.otherUser.name}</Text>
				<View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
					<Icon name='ios-pin' type='ionicon' color='#91919d' />
					<Text style={styles.locationLabel}>{`${this.state.otherUser.city}, ${this.state.otherUser.country}`}</Text>
				</View>
				<TextInput
					returnKeyType='done'
					style={styles.valueInput}
					onChangeText={(text) => this.setState({ value: text })}
					value={this.state.value}
					keyboardType='numeric'
				/>
				<Text style={styles.balanceLabel}>
					{
						this.state.action == 'send' ? (
							`Match $ Balance: ${this.getFormattedString(Number(this.props.profile.balance) - Number(this.state.value))}`
						) : (
								`Match $ Balance: ${this.getFormattedString(Number(this.props.profile.balance) + Number(this.state.value))}`
							)
					}
				</Text>
				<View style={{ flex: 1, alignSelf: 'center', justifyContent: 'flex-end' }}>
					<Button title="CONFIRM" titleStyle={{ fontWeight: 'bold' }}
						ViewComponent={LinearGradient}
						linearGradientProps={{
							colors: ['#4a46d6', '#964cc6'],
							start: { x: 0, y: 0 },
							end: { x: 0, y: 1 },
						}}
						loading={this.state.loading}
						buttonStyle={{ borderRadius: 30 }}
						onPress={() => { this.onConfirm()/*this.props.navigation.pop(2)*/ }}
						containerStyle={{ marginBottom: 15, width: 300, alignSelf: 'center' }} />
					<Button title="CANCEL" titleStyle={{ color: '#91919d', fontWeight: 'bold' }}
						ViewComponent={LinearGradient}
						linearGradientProps={{
							colors: ['white', '#efefef'],
							start: { x: 0, y: 0 },
							end: { x: 0, y: 1 },
						}}
						buttonStyle={{ borderRadius: 30 }}
						onPress={() => { this.props.navigation.pop(2) }}
						containerStyle={{ marginBottom: 10, width: 300, alignSelf: 'center' }} />
				</View>
				<Overlay isVisible={this.state.isVisibleSucces} width='auto' height='auto' borderRadius={14}
					overlayStyle={{ padding: 30 }}>
					{this.renderSuccessModalContent()}
				</Overlay>
			</TouchableOpacity>
		)
	}

	renderSuccessModalContent() {
		const successMsg = (this.state.action == 'send') ? `You Sent Match $${thousands_separators(this.state.value)} \nto ${this.state.otherUser.name}` : `You Requested Match $${thousands_separators(this.state.value)} \nto ${this.state.otherUser.name}`;
		return (
			<View>
				<Image source={Images.Image02} style={{ width: 156, height: 156, alignSelf: 'center' }} resizeMode='contain' />
				<Text style={styles.successMsg}>{successMsg}</Text>
				<Button title="BACK TO ACCOUNT" titleStyle={{ fontWeight: 'bold' }}
					ViewComponent={LinearGradient}
					linearGradientProps={{
						colors: ['#4a46d6', '#964cc6'],
						start: { x: 0, y: 0 },
						end: { x: 0, y: 1 },
					}}
					loading={this.state.loading}
					buttonStyle={{ borderRadius: 30 }}
					onPress={() => { this.back() }}
					containerStyle={{ marginTop: 25, width: 250, alignSelf: 'center' }} />
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
			<Text style={{ color: '#17144e', fontSize: 21, fontWeight: 'bold' }}>Confirmation</Text>
		);
	}
}

let styles = {
	headerLeftText: {
		color: '#17144e'
	},
	nameLabel: {
		alignSelf: 'center',
		color: '#17144e',
		fontSize: 26,
		fontWeight: 'bold',
		marginTop: 15,
		textAlign: 'center'
	},
	locationLabel: {
		marginLeft: 10,
		alignSelf: 'center',
		color: '#91919d'
	},
	valueInput: {
		borderColor: '#3cb9fc', borderWidth: 1, alignSelf: 'center', alignItems: 'center', width: '30%', height: 40, marginTop: 25,
		textAlign: 'center'
	},
	balanceLabel: {
		alignSelf: 'center',
		color: '#91919d',
		fontSize: 17,
		marginTop: 10
	},
	successMsg: {
		color: '#17144e',
		fontWeight: 'bold',
		fontSize: 26,
		textAlign: 'center',
		marginTop: 35
	}
};

const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
		userToken: state.startup.userToken
	}
};

const mapDispatchToProps = dispatch => {
	return {
		updateProfilePhotos: (photo) => dispatch(UserActions.fetchUserSuccess(photo))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferConfirmScreen)
