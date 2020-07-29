import React, { Component } from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { ListItem } from 'react-native-elements'
import { withNavigation } from 'react-navigation'

import { userService } from 'App/Services/UserService'
import { Images } from 'App/Theme'
import { connect } from 'react-redux'
import { fbService } from 'App/Services/FirebaseService'

const month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class DatesView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			users: [],
			isRefreshing: false,
			isNoActivityShow: false,
			serverTime: false
		};
		fbService.getServerTime().then(snap => {
			this.setState({ serverTime: snap.val().time });
		});
	}

	loadUsers = () => {
		const { users, page } = this.state;
		this.setState({ isRefreshing: true });

		userService.get_request(this.props.userToken.access_token, `/dates?page=${page}`)
			.then(async res => {
				const data = res.data;
				let i = 0;
				let temp_friend = [];
				while (i < data.data.length) {
					const endpoint = data.data[i].from !== this.props.profile.id ? data.data[i].from : data.data[i].to;
					let userProfile = await userService.get_request(this.props.userToken.access_token, '/users/' + endpoint);
					const tDate = new Date(data.data[i].date);
					const combineData = Object.assign({
						'date': tDate.getDate() + " " + month_names_short[tDate.getMonth()],
						'is_accepted': data.data[i].is_accepted,
						'status': data.data[i].status
					}, userProfile.data);
					temp_friend.push(combineData);
					i++
				}
				this.setState({
					users: page === 1 ? temp_friend : [...users, ...temp_friend],
					isRefreshing: false
				});
			})
			.catch(err => {
				console.log("dates error -> ", err);
				this.setState({
					isRefreshing: false
				});
			});
	};

	handleRefresh = () => {
		this.setState({ isRefreshing: true, }, () => { this.loadUsers(); });
	};

	handleLoadMore = () => {
		// this.setState({
		//   page: this.state.page + 1
		// }, () => {
		//   this.loadUsers();
		// });
	};

	componentDidMount() {
		this.loadUsers();
	};

	onChat = (person, me) => {
		fbService.setFriends(me.id, person.id, res => {
			if (res) {
				this.props.navigation.navigate("TodayChatDetail", {
					youInfo: person,
					meInfo: me,
					chatroom: res
				});
			}
		});
	};


	keyExtractor = (item, index) => index.toString();

	renderItem = ({ item }) => {
		console.log("dateView item -> ", item)
		return (
			<ListItem
				title={item.name} titleStyle={{ fontSize: 17, color: '#17144e', fontWeight: 'bold' }}
				// rightTitle={item.date} rightTitleStyle={{ fontSize: 13, color: '#17144e' }}
				subtitle={() => {
					return item.is_accepted ? (
						<View style={{ flexDirection: 'row' }}>
							<Image source={Images.calendar} style={{ marginRight: 10, marginTop: 2 }} />
							<Text style={{ fontSize: 13, paddingTop: 5 }}>{`Confirmed ${item.date}`}</Text>
						</View>
					) : (
							<View style={{ flexDirection: 'row' }}>
								<Image source={Images.Image32} style={{ marginRight: 10, marginTop: 2 }} />
								<Text style={{ fontSize: 13 }}>Pending</Text>
							</View>
						);
				}}
				rightSubtitle={{ fontSize: 13 }}
				leftAvatar={{ source: { uri: item.picture } }}
				onPress={() => { }}
				bottomDivider
			/>
		)
	};

	ListEmptyView = () => {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ textAlign: 'center' }}> Sorry, No Matched People Present... Try Again.</Text>
			</View>

		);
	};

	render() {
		const { users, isRefreshing } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', height: 67, backgroundColor: '#def4ff', paddingLeft: 15 }}>
					<Image source={Images.ic_milahearts} style={{ width: 45, height: 45 }} />
					<Text style={{ color: '#17144e', fontSize: 17, marginLeft: 10 }}>Your Date Status</Text>
				</View>

				{
					users.length == 0 ? (
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
							<Image source={Images.MilaIcon2} style={{ width: 100, height: 100 }} resizeMode='contain' />
							<Text style={{ marginTop: 30, fontSize: 20 }}>Dates</Text>
						</View>
					) : (
							<FlatList
								data={users}
								renderItem={this.renderItem}
								keyExtractor={this.keyExtractor}
								refreshing={isRefreshing}
								onRefresh={this.handleRefresh}
								onEndReached={this.handleLoadMore}
								onEndThreshold={0}
							// ListEmptyComponent={this.ListEmptyView}
							/>
						)
				}


			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
		userToken: state.startup.userToken
	}
};

export default withNavigation(connect(mapStateToProps)(DatesView))
