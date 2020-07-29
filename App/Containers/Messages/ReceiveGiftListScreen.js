import React, { Component } from 'react'
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { Header, Icon, Overlay } from 'react-native-elements'

import GiftReceiveModal from 'App/Components/Messages/GiftReceiveModal'

import { connect } from 'react-redux'

import { fbService } from 'App/Services/FirebaseService'

class ReceiveGiftListScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			giftLastMsg: [],
			isModal: false,
			key: 0,
			giftID: 0,
			image: '',
			text: '',
			senderID: '',
		};

		this.giftMessageRef = fbService.getGiftMessageRef(this.props.profile.id)
	}

	componentDidMount() {
		this.giftMessageRef.on('child_added', snapshot => {
			let temp = this.state.giftLastMsg;
			temp.push(Object.assign({ key: snapshot.key }, (snapshot.val())));
			this.setState({
				giftLastMsg: temp
			});
		})
	}

	componentWillUnmount() {
		this.giftMessageRef.off()
	}

	setModalData = (key, image, giftID, text, senderID) => {
		this.setState({
			key: key,
			isModal: true,
			giftID: giftID,
			image: image,
			text: text,
			senderID: senderID
		});
	};

	onChat = (youItem, meItem) => {
		if (youItem && meItem) {
			this.setState({ isModal: false, isLoading: false });
			fbService.setFriends(meItem.id, youItem.id, res => {
				if (res) {
					this.props.navigation.navigate("TodayChatDetail", {
						youInfo: youItem,
						meInfo: meItem,
						chatroom: res
					});
				}
			});
		}
	};

	onSenderProfile = (youItem, meItem) => {
		this.props.navigation.push('OtherProfile', { other: youItem, onSwiped: (isLiked) => { this.likeUnlikePerson(youItem, isLiked) } });
	};

	likeUnlikePerson(likedProfile, isLiked) {
		fbService.updateGift(this.props.profile.id, this.state.key, res => {
			if (res) {
				const refreshData = this.props.navigation.getParam("onRefreshData");
				refreshData();
				if (isLiked) {
					this.onChat(likedProfile, this.props.profile)
				} else {
					this.props.navigation.navigate("DiscoverHome")
				}
			} else {
				alert('You cannot connect firebase now, please try later.')
			}
		})

	}

	render() {
		return (
			<View style={styles.rootContainer}>
				<Header leftComponent={this.header_left} centerComponent={this.header_center}
					rightComponent={this.header_right} backgroundColor='transparent' />
				{this.state.giftLastMsg ? (
					<ScrollView>
						{this.state.giftLastMsg.map((item, index) =>
							this.renderGiftItem(
								item.key,
								item.notice,
								item.message,
								item.timestamp,
								item.giftUrl,
								item.giftID,
								item.senderID,
								index
							)
						)}
					</ScrollView>
				) : (
						<View style={styles.notFound}>
							<Icon name='email-search' type='material-community' size={70} color='#0005' />
							<Text style={styles.notFoundText}>Not found Messages</Text>
						</View>
					)
				}
				<Overlay isVisible={this.state.isModal} width='auto' height='auto'
					onBackdropPress={() => this.setState({ isModal: false })}>
					<GiftReceiveModal
						image={this.state.image}
						text={this.state.text}
						senderID={this.state.senderID}
						onCancel={() =>
							this.setState({ isModal: false, isLoading: false })
						}
						onSend={(meInfo, youInfo) => {
							if(youInfo.id){
								this.onSenderProfile(youInfo, meInfo);
							} else {
								this.setState({ isModal: false, isLoading: false })
							}
						}}
						isLoading={this.state.isLoading}
					/>
				</Overlay>
			</View>
		)
	}

	renderGiftItem = (key, title, text, timestamp, giftUrl, giftID, senderID, index) => {
		return (
			<View key={index}>
				<TouchableOpacity style={styles.listItemContainer}
					onPress={() => this.setModalData(key, giftUrl, giftID, text, senderID)}>
					<View style={styles.listLeftBox}>
						<Image source={{ uri: giftUrl }} resizeMode='contain' style={styles.listLeftImage} />
					</View>
					<View style={styles.listCenterBox}>
						<View style={styles.listTopBox}>
							<Text style={styles.listTopLeftText}>{title}</Text>
							<Text style={styles.listTopRightText}>
								{new Date(timestamp).toLocaleDateString("en-US")}
							</Text>
						</View>
						<View style={styles.listBottomBox}>
							<Text style={styles.listBottomText}>{text}</Text>
						</View>
					</View>
				</TouchableOpacity>
				<View style={{ width: "100%", marginLeft: 40, height: 0.5, backgroundColor: "#FFFDDA" }} />
			</View>
		);
	};

	header_left = () => {
		return (
			<TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }}>
				<View style={styles.headerLeftText}>
					<Icon name='ios-arrow-back' type='ionicon' size={25} color='#000' />
				</View>
			</TouchableOpacity>
		);
	};

	header_center = () => {
		return (
			<View>
				<Text style={styles.headerCenterText}>Received Gifts</Text>
			</View>
		);
	};

	header_right = () => {
		return (
			<View>
			</View>
		);
	};
}

const mapStateToProps = state => {
	return {
		profile: state.user.profile,
		userToken: state.startup.userToken
	}
};
let styles = {
	rootContainer: {
		flex: 1,
		backgroundColor: '#f9f9f9'
	},
	headerLeftText: {
		marginLeft: 10,
		fontSize: 16,
	},
	headerCenterText: {
		width: Dimensions.get("window").width - 100,
		fontSize: 18,
		fontWeight: "600",
	},
	notFound: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 150
	},
	notFoundText: {
		color: '#0005',
		fontSize: 18
	},
	listItemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		height: 80
	},
	listLeftBox: {
		width: 80,
		height: "100%",
		alignItems: "center",
		justifyContent: "center"
	},
	listCenterBox: {
		flex: 1,
		height: "100%",
		padding: 5,
		justifyContent: "space-between"
	},
	listTopBox: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	listTopLeftText: {
		color: "#000",
		fontSize: 18,
		fontWeight: "600"
	},
	listLeftImage: {
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 1,
		borderColor: "#FFFDDA"
	},
	listBottomBox: {
		flex: 1,
		paddingVertical: 2
	},
	listBottomText: {
		color: "#000",
		fontSize: 14,
		fontWeight: "500"
	}
};
export default connect(mapStateToProps)(ReceiveGiftListScreen)
