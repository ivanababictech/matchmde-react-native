import React, { Component } from 'react'
import { View, Text, Dimensions, Image, TouchableOpacity, Platform, Animated, KeyboardAvoidingView } from 'react-native'
import { withNavigation } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import { Icon, Overlay, Button, Divider } from 'react-native-elements'

import TextInput from './../../Components/Profile/TextInput2'
import { userService } from 'App/Services/UserService'

import { Images } from 'App/Theme'

const width = Dimensions.get('window').width;
const itemWidth = width / 2 - 25;
const itemHeight = itemWidth * 1.25;

class StoreView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isModalEnabled: false,
			isModalResEnabled: false,
			nameText: "",
			emailText: "",
			contactText: "",
			shift: new Animated.Value(0),
			successTxt: 'Success',
			successSubText: 'Our Dating Coach will be in touch with you!',
		}
	}

	onShowModal() {
		this.setState({
			nameText: "",
			emailText: "",
			contactText: "",
			isModalEnabled: true
		})
	}

	onConfirmModal() {

		if (this.state.nameText == "") {
			alert("Please type your name")
			return
		}

		if (this.state.emailText == "") {
			alert("Please type your email")
			return
		}else if(this.state.emailText != ""){
			if(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(this.state.emailText) === false){
				alert('Invalid Email Address');
				return
			}
		}

		if (this.state.contactText == "") {
			alert("Please type your contact")
			return
		}else if(this.state.contactText != ""){
			if (/^(?=.*[0-9])[- +()0-9]+$/.test(this.state.contactText) === false) {
				alert("Invalid phone number")
				return
			}
		}

		let body = {
			name: this.state.nameText,
			phone_number: this.state.contactText,
			email: this.state.emailText
		}

		userService.dateCoach(body)
			.then((res)=>{
				this.setState({ successTxt: 'Success' })
				this.setState({ successSubText: 'Our Dating Coach will be in touch with you!' })
				
				this.setState({ isModalResEnabled: true })
				this.setState({ isModalEnabled: false })
				console.log('date coach succes');
			})
			.catch((error)=>{
				this.setState({ successTxt: 'Failed' })
				this.setState({ successSubText: 'Please try again' })
				this.setState({ isModalResEnabled: true })
				this.setState({ isModalEnabled: false })
				console.log("date coach submit error", error.message)
			})
		
	}

	onCloseModal() {
		this.setState({ isModalEnabled: false })
	}

	onCloseResModal() {
		this.setState({ isModalResEnabled: false })
	}

	handleKeyboardDidShow = () => {
		console.log("keyboardshow")
		Animated.timing(
			this.state.shift,
			{
				toValue: Platform.OS === 'ios' ? -60 : 0,
				duration: 500,
				useNativeDriver: true,
			}
		).start();
	};

	handleKeyboardDidHide = () => {
		console.log("keyboardhide")
		Animated.timing(
			this.state.shift,
			{
				toValue: 0,
				duration: 500,
				useNativeDriver: true,
			}
		).start();
	};

	renderResponseModal(){
		return (
			<View style={{ width: 250 }}>
				<Text style={{textAlign:'center', marginTop:10, color:'#17144e', fontSize:26, fontWeight:'bold'}}>{this.state.successTxt}</Text>
				<Text style={{textAlign:'center', marginTop:10, color:'#17144e', fontSize:14}}>{this.state.successSubText}</Text>
				<Button title="OK" ViewComponent={LinearGradient} titleStyle={{fontFamily: 'ProximaNova-Bold'}}
					linearGradientProps={{
						colors: ['#4a46d6', '#964cc6'],
						start: { x: 0, y: 0 },
						end: { x: 0, y: 1 },
					}}
					buttonStyle={{borderRadius:30}}
					onPress={() => { this.onCloseResModal() }}
					containerStyle={{marginBottom:5, marginTop:24}}
				/>
			</View>
		)
	}

	renderModalContent() {
		const { shift } = this.state;
		if (Platform.OS === "ios") {
			return (
				<Animated.View style={{ transform: [{ translateY: shift }] }}>
					<Text style={styles.title1}>
						{"Date Coach"}
					</Text>
					<Image source={Images.Image02} style={{ width: 130, height: 130, marginTop: 10, alignSelf: 'center' }} resizeMode='contain' />
					<Text style={styles.title2}>
						{"Need a professional helping hand?"}
					</Text>
					<Divider style={{ marginTop: 10, marginBottom: 0, marginLeft: 30, marginRight: 30, backgroundColor: '#3cb9fc' }} />
					<Text style={styles.title2}>
						{"Fill up this form and our Date Coach will be in touch!"}
					</Text>
					<TextInput
						returnKeyType='done'
						style={{ width: 250, height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 3, marginTop: 15 }}
						maxLength={30}
						placeholder={'Your Name'}
						value={this.state.nameText}
						onChangeText={(nameText) => this.setState({ nameText })}
					/>
					<TextInput
						returnKeyType='done'
						style={{ width: 250, height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 3, marginTop: 10 }}
						maxLength={30}
						placeholder={'Your Email'}
						onBlur={() => {
							this.handleKeyboardDidHide()
						}}
						onFocus={() => {
							this.handleKeyboardDidShow()
						}}
						value={this.state.emailText}
						keyboardType="email-address"
						onChangeText={(emailText) => this.setState({ emailText })}
					/>
					<TextInput
						returnKeyType='done'
						style={{ width: 250, height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 3, marginTop: 10 }}
						maxLength={30}
						placeholder={'+65 XXXX XXXX'}
						onBlur={() => {
							this.handleKeyboardDidHide()
						}}
						onFocus={() => {
							this.handleKeyboardDidShow()
						}}
						value={this.state.contactText}
						onChangeText={(contactText) => this.setState({ contactText })}
					/>
					<View>
						<Button title="Confirm"
							ViewComponent={LinearGradient}
							linearGradientProps={{
								colors: ['#4a46d6', '#964cc6'],
								start: { x: 0, y: 0 },
								end: { x: 0, y: 1 },
							}}
							loading={this.state.loading}
							buttonStyle={{ borderRadius: 30 }}
							onPress={() => {
								this.onConfirmModal();
							}}
							titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
							containerStyle={{ marginTop: 25, marginBottom: 0, width: 250, alignSelf: 'center' }} />
					</View>
					<View>
						<Button title="Close"
							ViewComponent={LinearGradient}
							linearGradientProps={{
								colors: ['#fff', '#efefef'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 },
							}}
							loading={this.state.loading}
							buttonStyle={{ borderRadius: 30 }}
							titleStyle={{ color: '#91919d', fontWeight: 'bold' }}
							onPress={() => { this.onCloseModal() }}
							containerStyle={{ marginTop: 10, marginBottom: 10, width: 250, alignSelf: 'center' }} />
					</View>
				</Animated.View>
			)
		} else {
			return (
				<View>
					<Text style={styles.title1}>
						{"Date Coach"}
					</Text>
					<Image source={Images.Image02} style={{ width: 130, height: 130, marginTop: 10, alignSelf: 'center' }} resizeMode='contain' />
					<Text style={styles.title2}>
						{"Need a professional helping hand?"}
					</Text>
					<Divider style={{ marginTop: 10, marginBottom: 0, marginLeft: 30, marginRight: 30, backgroundColor: '#3cb9fc' }} />
					<Text style={styles.title2}>
						{"Fill up this form and our Date Coach will be in touch!"}
					</Text>
					<TextInput
						returnKeyType='done'
						style={{ width: 250, height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 3, marginTop: 15 }}
						maxLength={30}
						placeholder={'Your Name'}
						value={this.state.nameText}
						onChangeText={(nameText) => this.setState({ nameText })}
					/>
					<TextInput
						returnKeyType='done'
						style={{ width: 250, height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 3, marginTop: 10 }}
						maxLength={30}
						placeholder={'Your Email'}
						onBlur={() => {
							this.handleKeyboardDidHide()
						}}
						onFocus={() => {
							this.handleKeyboardDidShow()
						}}
						value={this.state.emailText}
						keyboardType="email-address"
						onChangeText={(emailText) => this.setState({ emailText })}
					/>
					<TextInput
						returnKeyType='done'
						style={{ width: 250, height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 3, marginTop: 10 }}
						maxLength={30}
						placeholder={'Your Contact'}
						onBlur={() => {
							this.handleKeyboardDidHide()
						}}
						onFocus={() => {
							this.handleKeyboardDidShow()
						}}
						value={this.state.contactText}
						onChangeText={(contactText) => this.setState({ contactText })}
					/>
					<View>
						<Button title="Confirm"
							ViewComponent={LinearGradient}
							linearGradientProps={{
								colors: ['#4a46d6', '#964cc6'],
								start: { x: 0, y: 0 },
								end: { x: 0, y: 1 },
							}}
							loading={this.state.loading}
							buttonStyle={{ borderRadius: 30 }}
							onPress={() => {
								this.onConfirmModal();
							}}
							titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
							containerStyle={{ marginTop: 25, marginBottom: 0, width: 250, alignSelf: 'center' }} />
					</View>
					<View>
						<Button title="Close"
							ViewComponent={LinearGradient}
							linearGradientProps={{
								colors: ['#fff', '#efefef'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 },
							}}
							loading={this.state.loading}
							buttonStyle={{ borderRadius: 30 }}
							titleStyle={{ color: '#91919d', fontWeight: 'bold' }}
							onPress={() => { this.onCloseModal() }}
							containerStyle={{ marginTop: 10, marginBottom: 10, width: 250, alignSelf: 'center' }} />
					</View>
				</View>
			)
		}
	}

	render() {

		const { shift } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
			
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5 }}>
					<TouchableOpacity onPress={() => { this.props.navigation.push('Gift') }}>
						<LinearGradient colors={['#4a46d6', '#964cc6']} style={styles.linearGradient}>
							{/* <Icon name='info-with-circle' type='entypo' containerStyle={{position:'absolute', right:2, top:2}} color='silver'/> */}
							<Image source={Images.Gift} style={styles.image} resizeMode='contain' />
							<Text style={styles.label}>
								Gifts
							</Text>
						</LinearGradient>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.onShowModal() }}>
						<LinearGradient colors={['#4a46d6', '#964cc6']} style={styles.linearGradient}>
							{/* <Icon name='info-with-circle' type='entypo' containerStyle={{position:'absolute', right:2, top:2}} color='silver'/> */}
							<Image source={Images.ic_date_coach} style={styles.image} resizeMode='contain' />
							<Text style={styles.label}>
								{"Date \nCoach"}
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 15 }}>
					<TouchableOpacity onPress={() => { this.props.navigation.push('Purchase') }}>
						<LinearGradient colors={['#4a46d6', '#964cc6']} style={styles.linearGradient}>
							{/* <Icon name='info-with-circle' type='entypo' containerStyle={{position:'absolute', right:2, top:2}} color='silver'/> */}
							<Image source={Images.Diamond} style={styles.image} resizeMode='contain' />
							<Text style={styles.label}>
								{"Go \nPremium"}
							</Text>
						</LinearGradient>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { this.props.navigation.push('Boost') }}>
						<LinearGradient colors={['#4a46d6', '#964cc6']} style={styles.linearGradient}>
							{/* <Icon name='info-with-circle' type='entypo' containerStyle={{position:'absolute', right:2, top:2}} color='silver'/> */}
							<Image source={Images.Launch} style={styles.image} resizeMode='contain' />
							<Text style={styles.label}>
								Boost
						  	</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>

				<Overlay isVisible={this.state.isModalEnabled} width='auto' height='auto' borderRadius={14}
					overlayStyle={{ paddingTop: 30, paddingBottom: 30, paddingStart: 30, paddingEnd: 30 }}>
					{this.renderModalContent()}
				</Overlay>

				<Overlay isVisible={this.state.isModalResEnabled} width='auto' height='auto' borderRadius={14}
					overlayStyle={{ paddingTop: 30, paddingBottom: 30, paddingStart: 30, paddingEnd: 30 }}>
					{this.renderResponseModal()}
				</Overlay>
				
			</View>
		)
	}
}

let styles = {
	linearGradient: {
		borderRadius: 5,
		width: itemWidth,
		height: itemHeight,
		alignItems: 'center',
		justifyContent: 'center'
	},
	label: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginTop: 30
	},
	title1: {
		fontSize: 20,
		width: 250,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 0
	},
	title2: {
		fontSize: 15,
		width: 250,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 10
	},
	image: {
		width: 80,
		height: 70
	}
};

export default withNavigation(StoreView)
