import React, { Component } from 'react'
import { View, Text, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet} from 'react-native'

import { userService } from 'App/Services/UserService'
import { Avatar, Header, Icon } from 'react-native-elements'

import { fbService } from 'App/Services/FirebaseService'
import { Images } from 'App/Theme'
import { connect } from 'react-redux'
import {ListItem} from 'react-native-elements'

const itemWidth = Dimensions.get('window').width / 2 - 26;
const itemHeight = itemWidth * 1.11;

class ChatListScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			peoples: []
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
			console.log("list all matchers chat list error -> ", err)
		}
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

	renderItem = ({ item }) => {
		return (
            <ListItem
                title={item.name} titleStyle={{fontSize:17, color:'#17144e', fontWeight:'bold'}}
				subtitle={item.name} titleStyle={{fontSize:17, color:'#17144e', fontWeight:'bold'}}
                leftAvatar={{ source: { uri: item.picture } }}
                bottomDivider
                onPress={() => this.onChat(item, this.props.profile)}
                containerStyle={{backgroundColor:'#fff'}}
            />
		)
	};

	keyExtractor = (item, index) => index.toString();

	render() {
		return (
			<View style={{ flex: 1 }}>
                <Header leftComponent={this.header_left} centerComponent={this.header_center}
		            rightComponent={this.header_right} backgroundColor="transparent"/>
				<FlatList
					data={this.state.peoples}
					renderItem={this.renderItem}
					keyExtractor={this.keyExtractor}
					numColumns={1}
				/>
			</View>
		)
    }

    header_left = () => {
		return (
		  <TouchableOpacity
		    onPress={() => {
		      this.props.navigation.goBack(null);
		    }}
		  >
		    <View style={styles.headerLeftText}>
		      <Icon name="ios-arrow-back" type='ionicon' size={25} color={"#000"} />
		    </View>
		  </TouchableOpacity>
		);
	};

	header_center = () => {
		return (
		  <View style={{ flexDirection: "row", marginLeft: 10 }}>
		    <Avatar source={Images.Image02} size={"small"} rounded />
		    <View style={{ width: Dimensions.get("window").width - 130, marginLeft: 10, justifyContent: "center" }} >
		      <Text style={styles.headerCenterText}>Chat List</Text>
		    </View>
		  </View>
		);
	};

	header_right = () => {
		return (
		  <TouchableOpacity>
		    <Text style={styles.headerLeftText} />
		  </TouchableOpacity>
		);
	};
}

const mapStateToProps = (state) => {
	return {
		/*dating:state.dating,*/
		profile: state.user.profile,
		userToken: state.startup.userToken
	}
};

export default connect(mapStateToProps)(ChatListScreen)

const styles = StyleSheet.create({
	itemMiddelView: {
		marginTop: 0,
		flexDirection: 'row',
		width: itemWidth,
		height: 44,
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'center',
		alignItems: 'center'
    },
    headerLeftText: {
		marginLeft: 10,
		fontSize: 16,
	},
	headerCenterText: {
		width: Dimensions.get("window").width - 100,
		fontSize: 18,
		fontWeight: "600",
	}
});
