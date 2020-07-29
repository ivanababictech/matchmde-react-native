import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { Button, Header, Icon, ListItem } from 'react-native-elements'
import { connect } from 'react-redux'

import { userService } from 'App/Services/UserService'
import { Images } from 'App/Theme'

class SelectContact extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: false,
			matched: [],
			page: 1,
			action: this.props.navigation.getParam('action', 'send')
		}
	}

	componentDidMount() {
		this.loadUsers();
	}

	loadUsers = async () => {
		this.setState({ isRefreshing: true });

		let peopleResponse;
		try {
			peopleResponse = await userService.listAllMatchers(this.props.userToken.access_token);
			let matchedRaw = peopleResponse.data.data.map((v) => v.from);
			matchedRaw = [...matchedRaw, ...peopleResponse.data.data.map((v) => v.to)];
			const matched = matchedRaw.filter(v => v.id !== this.props.profile.id);
			this.setState({ matched: matched })
		} catch (err) {
		}

		this.setState({ isRefreshing: false });
	};

	handleRefresh = () => {
		this.loadUsers();
	};

	handleLoadMore = () => {
		// this.setState({
		//   page: this.state.page + 1
		// }, () => {
		//   this.loadUsers();
		// });
	};

	render() {
		const { matched, isRefreshing } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<Header backgroundColor='transparent' leftComponent={this.header_left} centerComponent={this.render_headerCenter} />
				{
					matched.length == 0 ? (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
							<Image source={Images.MilaIcon2} style={{ width: 100, height: 100 }} resizeMode='contain' />
							<Text style={{ marginTop: 30, fontSize: 20 }}>Like more profiles to get a Match!</Text>
						</View>
					) : (
							<FlatList style={{ flex: 1 }}
								data={matched}
								renderItem={this.renderItem}
								keyExtractor={this.keyExtractor}
								refreshing={isRefreshing}
								onRefresh={this.handleRefresh}
								onEndReached={this.handleLoadMore}
								onEndThreshold={0}
							/>
						)
				}

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
			<Text style={{ color: '#17144e', fontSize: 21, fontWeight: 'bold' }}>Select Contact</Text>
		);
	};

	keyExtractor = (item, index) => index.id;

	renderItem = ({ item }) => {
		const from = item;
		return (
			<ListItem
				title={from.name} titleStyle={{ fontSize: 17, color: '#17144e', fontWeight: 'bold' }}
				subtitle='' subtitleStyle={{ fontSize: 13, color: '#91919d' }}
				leftAvatar={{ source: { uri: from.picture } }}
				bottomDivider chevron
				onPress={() => { this.props.navigation.push('TransferConfirm', { from, action: this.state.action }) }}
			/>
		)
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
	}
};
const mapStateToProps = (state) => {
	return {
		dating: state.dating,
		userToken: state.startup.userToken,
		profile: state.user.profile,
	}
};

export default connect(mapStateToProps)(SelectContact)
