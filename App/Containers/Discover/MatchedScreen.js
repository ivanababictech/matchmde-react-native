import React, { Component } from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import { connect } from 'react-redux'

import { Images } from 'App/Theme'
import { fbService } from 'App/Services/FirebaseService'


const width = Dimensions.get('window').width;
const bigImageWidth = width * 0.6;
const smallImageWidth = bigImageWidth / 3;

class MatchedScreen extends Component {

	// onChat = (person, me) => {
	// 	fbService.setFriends(me.id, person.id, res => {
	// 		if (res) {
	// 			this.props.navigation.navigate("TodayChatDetail", {
	// 				youInfo: person,
	// 				meInfo: me,
	// 				chatroom: res
	// 			});
	// 		}
	// 	});
	// }

	render() {
		return (
			<View style={{ flex: 1, justifyContent: 'space-between' }}>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Image source={Images.MatchLabel} />
				</View>

				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<View>
						<View style={styles.bigImageWrapper}>
							<Image source={{ uri: this.props.matchData.picture }} style={styles.bigImageStyle} resizeMode='cover' />
						</View>
						<View style={styles.myImageWrapper}>
							<Image source={{ uri: this.props.profile.picture }} style={styles.myImageStyle} resizeMode='cover' />
						</View>
						<View style={styles.myHeartWrapper}>
							<View style= {{backgroundColor: '#3cb9fc', borderRadius: Dimensions.get('window').width * 0.1, padding: 10}}>
								<Image source={Images.heart} style={styles.myImageStyle_Heart} resizeMode='contain' />
							</View>
						</View>
					</View>
				</View>

				<View style={{ flex: 1, justifyContent: 'space-around', width: '86%', alignSelf: 'center', marginTop: 20 }}>
					<View style={{ flexDirection: 'row', backgroundColor: '#def4ff', borderRadius: 10, padding: 10 }}>
						<Image source={Images.Image02} style={{ width: 39, height: 39 }} />
						<Text style={{ marginLeft: 10, fontSize: 17, flex: 1, color: '#17144e' }}>I think you two will really get on. Good luck!</Text>
					</View>
					<View>
						<Button title='SEND A MESSAGE'
							ViewComponent={LinearGradient}
							linearGradientProps={{
								colors: ['#4a46d6', '#964cc6'],
								start: { x: 0, y: 0 },
								end: { x: 0, y: 1 },
							}}
							buttonStyle={{ borderRadius: 30 }}
							icon={<Icon name='md-arrow-round-forward' type='ionicon' color='white' containerStyle={{ position: 'absolute', right: 12 }} />}
							onPress={() => this.props.onChat(this.props.matchData, this.props.profile)}
							containerStyle={{ marginBottom: 15 }}
							titleStyle={{fontWeight: 'bold'}}
						/>
						<Button title='NOT NOW' titleStyle={{ color: '#91919d', fontWeight: 'bold' }}
							ViewComponent={LinearGradient}
							linearGradientProps={{
								colors: ['#ffffff', '#efefef'], 
								start: { x: 0, y: 0 },
								end: { x: 0, y: 1 },
							}}
							buttonStyle={{ borderRadius: 25 }}
							onPress={() => { this.props.closeModal() }} />
					</View>
				</View>
			</View>
		)
	}
}

let styles = {
	bigImageStyle: {
		width: bigImageWidth,
		height: bigImageWidth,
	},
	bigImageWrapper: {
		borderWidth: 10,
		borderColor: '#3cb9fc',
		borderRadius: bigImageWidth / 2 + 10,
		overflow: 'hidden'
	},
	myImageStyle: {
		width: smallImageWidth,
		height: smallImageWidth,
	},
	myImageStyle_Heart: {
		width: Dimensions.get('window').width * 0.1,
		height: Dimensions.get('window').width * 0.1,
	},
	myImageWrapper: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		overflow: 'hidden',
		borderWidth: 6,
		borderColor: 'white',
		borderRadius: smallImageWidth / 2 + 6,
	},
	myHeartWrapper: {
		position: 'absolute',
		width: bigImageWidth,
		bottom: -26,
		overflow: 'hidden',
		alignItems: 'center',
		borderWidth: 0,
		borderRadius: smallImageWidth / 2 + 6,
	}
};

const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
	}
};
export default connect(mapStateToProps)(MatchedScreen);
