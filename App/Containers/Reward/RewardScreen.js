import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native'
import { Header, Icon, Overlay, Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { userService } from 'App/Services/UserService'
import { connect } from 'react-redux'

import { Images } from 'App/Theme'

const itemWidth = Dimensions.get('window').width / 2 - 20;
const itemHeight = itemWidth * 1.11;

const data = [
	{ optionName: 'Hourly Visits', value: 40 },
	{ optionName: 'Daily Visits', value: 70 },
	{ optionName: 'Daily Swipes', value: 0 },
	{ optionName: 'Verify Social Accounts', value: 0 },
	{ optionName: 'Complete 100% of Profile', value: 0 },
	{ optionName: 'Refer a Friend', value: 100 },
	{ optionName: 'Send 3 Gifts', value: 100 },
	{ optionName: 'Earn 3 Badges', value: 100 },
	{ optionName: 'Most Popular Top 5', value: 100 },
	{ optionName: 'Most Popular Top 7', value: 100 },
];
class RewardScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			data: [],
			me: [],
			desModal: false,
			selItem: {}
		}
	}

	componentDidMount() {
		this.loadRewards();
	}

	loadRewards = () => {
		this.setState({ loading: false });
		userService.get_request(this.props.userToken.access_token, '/account/rewards')
			.then(res => {
				let temp1 = res.data.rewards;
				temp1.forEach((value, index)=>{
					if([4,5,6,7].indexOf(value.id) == -1){
						delete temp1[index];
					}
				});
				let temp = temp1.filter(x => x !== undefined);
				
				temp.map((v) => {
					let fl = 0
					res.data.me.map((item) => {
						if(item.reward.id == v.id) {
							fl = v.percent
						}
					})
					v.percent = fl
				})
				
				this.setState({ data: temp, me: res.data.me, loading: false })
			}).catch(err => {
				this.setState({ loading: false })
			})
	};

	handleRefresh = () => {
		this.setState({ loading: true, }, () => { this.loadRewards(); });
	};

	renderItem = ({ item }) => {
		const cItem = item
		return (
			<LinearGradient colors={['#4a46d6', '#964cc6']} style={styles.linearGradient}>
				<TouchableOpacity onPress={() => { this.setState({ desModal: true, selItem: cItem }) }} style={{ position: 'absolute', right: 8, top: 8 }}>
					<Icon name='info-with-circle' type='entypo' color='silver' />
				</TouchableOpacity>
				<Image source={{ uri: cItem.icon }} style={styles.image} resizeMode='contain' />
				<Text style={styles.label}>
					{cItem.title}
				</Text>
				{
					cItem.value == 0 ? null : (<Text style={styles.label2}>{`${cItem.percent}%`}</Text>)
				}
			</LinearGradient>
		)
	};

	keyExtractor = (item, index) => index.toString();

	render() {
		const { data, loading, selItem, me } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<Header leftComponent={this.renderHeaderLeft} backgroundColor='transparent' centerComponent={this.renderHeaderCenter} />
				<FlatList
					data={data}
					renderItem={this.renderItem}
					keyExtractor={this.keyExtractor}
					numColumns={2}
					refreshing={loading}
					onRefresh={this.handleRefresh}
				/>
				{
					!this.state.desModal ? null : (
						<Overlay isVisible={this.state.desModal} width='80%' height='auto'
							overlayStyle={{ padding: 0 }} borderRadius={14}>
							<LinearGradient colors={['#4a46d6', '#964cc6']} style={styles.linearGradientOverlay}>
								<Image source={{ uri: selItem.icon }} style={[styles.image, { marginTop: 20 }]} resizeMode='contain' />
								<Text style={styles.label_over}>
									{selItem.title}
								</Text>
								{
									selItem.value == 0 ? null : (<Text style={styles.label2}>{`${selItem.percent}%`}</Text>)
								}
								{
									selItem.comment == null ? null : (<Text style={styles.label2_over}>{selItem.comment}</Text>)
								}
								<Button title="OK"
									ViewComponent={LinearGradient} titleStyle={{ color: '#91919d', fontWeight: 'bold' }}
									linearGradientProps={{
										colors: ['#fff', '#efefef'],
										start: { x: 0, y: 0 },
										end: { x: 0, y: 1 },
									}}
									buttonStyle={{ borderRadius: 30 }}
									onPress={() => { this.setState({ desModal: false }) }}
									containerStyle={{ marginBottom: 15, width: '78%', marginTop: 35 }}
								/>
							</LinearGradient>
						</Overlay>
					)
				}

			</View>
		)
	}

	renderHeaderLeft = () => {
		return (
			<TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}>
				<Image source={Images.LineMenu} />
			</TouchableOpacity>
		)
	};

	renderHeaderCenter = () => {
		return (
			<Text style={{ fontSize: 21, color: '#17144e', fontWeight: 'bold' }}>Rewards</Text>
		)
	}
}

let styles = {
	linearGradient: {
		borderRadius: 5,
		width: itemWidth,
		height: itemHeight,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 10
	},
	linearGradientOverlay: {
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 0
	},
	label: {
		fontSize: 15,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginTop: 10
	},
	label2: {
		fontSize: 22,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginTop: 5
	},
	label_over: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginTop: 20
	},
	label2_over: {
		fontSize: 15,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginTop: 15,
		marginLeft: 20,
		marginRight: 20,
	},
	image: {
		width: 80,
		height: 70
	}
};
const mapStateToProps = (state) => {
	return {
		userToken: state.startup.userToken
	}
};

export default connect(mapStateToProps)(RewardScreen)
