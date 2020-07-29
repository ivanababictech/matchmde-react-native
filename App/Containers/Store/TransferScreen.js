import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, Linking } from 'react-native'
import { Button, Header, Icon, ListItem } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import { connect } from 'react-redux'
import { userService } from 'App/Services/UserService'
import { thousands_separators } from 'App/Services/HelperServices'

class TransferScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [],
			isRefreshing: false,
			page: 1
		}
	}

	componentDidMount() {
		this.loadData()
	}

	loadData = () => {
		const { history, page } = this.state;
		// this.setState({ isRefreshing: true });

		userService.get_request(this.props.userToken.access_token, `/transfers`)
			.then(res => {
				const data = res.data;
				this.setState({
					history: page === 1 ? data.data : [...history, ...data.data],
					isRefreshing: false
				});
			})
			.catch(err => {
				this.setState({
					isRefreshing: false
				});
			});
	};

	handleRefresh = () => {
		this.setState({ isRefreshing: true, page: 1 }, () => { this.loadData(); });
	};

	handleLoadMore = () => {
		// this.setState({
		//   page: this.state.page + 1
		// }, () => {
		//   this.loadData();
		// });
	};

	gotoWebPage(url) {
		Linking.canOpenURL(url).then(supported => {
		  if (supported) {
			Linking.openURL(url);
		  } else {
			console.log("Don't know how to open URI: " + url);
		  }
		});
	  }

	render() {
		const { history, isRefreshing } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<Header backgroundColor='transparent' leftComponent={this.header_left} centerComponent={this.render_headerCenter} />
				<FlatList style={{ flex: 1 }}
					data={history}
					renderItem={this.renderItem}
					keyExtractor={this.keyExtractor}
					ListHeaderComponent={this.TransferListHeader}
					refreshing={isRefreshing}
					onRefresh={this.handleRefresh}
					onEndReached={this.handleLoadMore}
					onEndThreshold={0}
				/>
				<Button title="REQUEST MATCH $" titleStyle={{ fontWeight: 'bold' }}
					ViewComponent={LinearGradient}
					linearGradientProps={{
						colors: ['#4a46d6', '#964cc6'],
						start: { x: 0, y: 0 },
						end: { x: 0, y: 1 },
					}}
					buttonStyle={{ borderRadius: 30 }}
					onPress={() => { this.props.navigation.push('ContactSelect', { action: 'request' }) }}
					containerStyle={{ marginBottom: 5, width: 300, alignSelf: 'center' }}
				/>
				<Button title="SEND MATCH $" titleStyle={{ fontWeight: 'bold' }}
					ViewComponent={LinearGradient}
					linearGradientProps={{
						colors: ['#4a46d6', '#964cc6'],
						start: { x: 0, y: 0 },
						end: { x: 0, y: 1 },
					}}
					buttonStyle={{ borderRadius: 30 }}
					onPress={() => { this.props.navigation.push('ContactSelect', { action: 'send' }) }}
					containerStyle={{ marginBottom: 5, width: 300, alignSelf: 'center' }}
				/>
				<View style={{alignItems: "center", margin: 10}}>
					<View style={styles.descriptionContainer}>
						<Text style={styles.descriptionText}>
							{"Disclaimer: Users agree not to misuse Match $ for illegal purposes. Please see our "}
							<Text style={styles.descriptionTextUnderLine}
								onPress={() => this.gotoWebPage('https://matchmde.com/terms-of-use/')}>
								{"Terms of Use."}
							</Text>
						</Text>
					</View>
				</View>

			</View>
		)
	}

	TransferListHeader = () => {
		return (
			<LinearGradient style={styles.balanceContainer} colors={['#4a46d6', '#964cc6']}>
				<Text style={styles.balanceLabel}>{`$${thousands_separators(this.props.profile.balance)}`}</Text>
				<Text style={styles.balanceTitle}>Match $ Balance</Text>
			</LinearGradient>
		)
	};

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
			<Text style={{ color: '#17144e', fontSize: 21, fontWeight: 'bold' }}>Transfer</Text>
		);
	};

	keyExtractor = (item, index) => item.id;

	renderItem = ({ item }) => {
		if (item.from.id === this.props.profile.id) {
			return (
				<ListItem
					title={item.to.name} titleStyle={{ fontSize: 17, color: '#17144e', fontWeight: 'bold' }}
					subtitle='Sent' subtitleStyle={{ fontSize: 13, color: '#91919d' }}
					leftAvatar={{ source: { uri: item.to.picture } }}
					rightTitle={`-$${item.amount}`} rightTitleStyle={{ fontSize: 17, color: '#17144e', fontWeight: 'bold' }}
					rightSubtitle={<View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'green' }} />}
					bottomDivider
				/>
			)
		}
		return (
			<ListItem
				title={item.from.name} titleStyle={{ fontSize: 17, color: '#17144e', fontWeight: 'bold' }}
				subtitle='Received' subtitleStyle={{ fontSize: 13, color: '#91919d' }}
				leftAvatar={{ source: { uri: item.to.picture } }}
				rightTitle={`+$${item.amount}`} rightTitleStyle={{ fontSize: 17, color: '#17144e', fontWeight: 'bold' }}
				rightSubtitle={<View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.reated_at === item.updated_at ? 'red' : 'green' }} />}

				bottomDivider
			/>
		)
		/*return(
		  <ListItem
		    title={item.name} titleStyle={{fontSize:17, color:'#17144e', fontWeight:'bold'}}
		    subtitle={item.subtitle} subtitleStyle={{fontSize:13, color:'#91919d'}}
		    leftAvatar={{ source: { uri: item.picture } }}
		    rightTitle={item.gift_history} rightTitleStyle={{ fontSize:17, color:'#17144e', fontWeight:'bold'}}
		    rightSubtitle={<View style={{width:10, height:10, borderRadius:5, backgroundColor:'green'}}/>}
		    bottomDivider
		  />
		)*/
	}
}

let styles = {
	headerLeftText: {
		color: '#17144e'
	},
	balanceContainer: {
		margin: 14,
		borderRadius: 7,
		alignItems: 'center',
		padding: 28
	},
	balanceLabel: {
		fontSize: 47,
		color: 'white',
		fontWeight: 'bold'
	},
	balanceTitle: {
		fontSize: 17,
		color: 'white',
	},
	descriptionContainer: {
		width: "90%",
		alignItems: "center",
		justifyContent: "center"
	},
	descriptionText: {
		color: "#91919d",
		fontSize: 14,
		textAlign: "center",
	},
	descriptionTextUnderLine: {
		color: "#91919d",
		fontSize: 14,
		textDecorationLine: "underline",
		textAlign: "center"
	},
};
const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
		userToken: state.startup.userToken,
	}
};
export default connect(mapStateToProps)(TransferScreen)
const users = [
	{
		picture: 'https://randomuser.me/api/portraits/women/90.jpg',
		status: 'online',
		name: 'Test Name1',
		subtitle: 'Send you a gift',
		gift_history: '+$100.00'
	},
	{
		picture: 'https://randomuser.me/api/portraits/women/19.jpg',
		status: 'online',
		name: 'Test Name2',
		subtitle: 'Send you a gift',
		gift_history: '-$67.00'
	},
	{
		picture: 'https://randomuser.me/api/portraits/women/59.jpg',
		status: 'online',
		name: 'Test Name3',
		gift_history: '-$34.00'
	},
	{
		picture: 'https://randomuser.me/api/portraits/women/68.jpg',
		status: 'offline',
		name: 'Test Name4',
		gift_history: '-$34.00'
	},
	{
		picture: 'https://randomuser.me/api/portraits/women/79.jpg',
		status: 'offline',
		name: 'Test Name5',
		gift_history: '+$250.00'
	},
];
