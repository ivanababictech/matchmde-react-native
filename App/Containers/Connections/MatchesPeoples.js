import React, { Component } from 'react'
import { View, Text, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'

import { userService } from 'App/Services/UserService'

import { fbService } from 'App/Services/FirebaseService'
import { Images } from 'App/Theme'
import { connect } from 'react-redux'

const itemWidth = Dimensions.get('window').width / 2 - 26;
const itemHeight = itemWidth * 1.11;

class MatchesPeoples extends Component {
	constructor(props) {
		super(props);
		this.state = {
			peoples: [],
			isRefreshing: false
		}
	} 

	async componentDidMount() {
		let peopleResponse;
		try {
			peopleResponse = await userService.listAllMatchers(this.props.userToken.access_token);
			let matchedRaw = peopleResponse.data.data.map((v) => v.from);
			matchedRaw = [...matchedRaw, ...peopleResponse.data.data.map((v) => v.to)];
			const matched = matchedRaw.filter(v => v.id !== this.props.profile.id);
			this.setState({ peoples: matched })
		} catch (err) {
			console.log("list All matchers error -> ", err)
		}
	}

	onChat = (person, me) => {
		fbService.setFriends(me.id, person.id, res => {
			if (res) {
				this.props.navigation.navigate("ChatDetail", {
					youInfo: person,
					meInfo: me,
					chatroom: res
				});
			}
		});
	};

	renderItem = ({ item }) => {
		return (
			<View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', flex: 1, marginTop: 20, marginBottom: 0 }}>
				<TouchableOpacity
					onPress={() => this.onChat(item, this.props.profile)}
					style={{ alignItems: 'center' }}>
					<Image source={{ uri: item.picture }} style={{ width: itemWidth, height: itemHeight, borderRadius: 5 }} />
					<View style={styels.itemMiddelView}>
						<Text style={{ fontSize: 17, color: '#17144e', fontWeight: 'bold' }}>{`${this.getCorrectName(item.name)}`}</Text>
						{item.is_share_age && <Text style={{ fontSize: 17, color: '#17144e' }}>{`, ${userService.calcAge(item.birthday)}`}</Text>}
					</View>
					<Text style={{ marginTop: 0, fontSize: 17, color: '#91919d', textAlign: 'center' }}>{this.getCorrectName(item.job)}</Text>
				</TouchableOpacity>
			</View>
		)
	};

	handleRefresh = () => {
		this.componentDidMount()
	};

	doValidate() {
		fbService.getLastMessage()
	}

	getCorrectName(name) {
		return name.substring(0, 10);
	  }

	keyExtractor = (item, index) => index.toString();

	render() {
		return (
			<View style={{ flex: 1, marginStart: 18 }}>
				{
					this.state.peoples.length == 0 ? (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
							<Image source={Images.MilaIcon2} style={{ width: 100, height: 100 }} resizeMode='contain' />
							<Text style={{ marginTop: 30, fontSize: 20 }}>Like more profiles to get a Match!</Text>
						</View>
					) : (
							<FlatList
								data={this.state.peoples}
								renderItem={this.renderItem}
								keyExtractor={this.keyExtractor}
								onRefresh={this.handleRefresh}
								refreshing={this.state.isRefreshing}
								numColumns={2}
							/>
						)
				}

			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		/*dating:state.dating,*/
		profile: state.user.profile,
		userToken: state.startup.userToken
	}
};

export default connect(mapStateToProps)(MatchesPeoples)

const styels = StyleSheet.create({
	itemMiddelView: {
		marginTop: 0,
		flexDirection: 'row',
		width: itemWidth,
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
