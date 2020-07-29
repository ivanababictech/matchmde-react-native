import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Header } from 'react-native-elements'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'

import { Images } from 'App/Theme'
import PeopleList from './PeopleList'
import MatchesPeoples from './MatchesPeoples'
import { connect } from 'react-redux'
import DatesView from 'App/Containers/Matchmake/DatesView'

class ConnectionScreen extends Component {
	render() {
		if (this.props.profile.face_verified) {
			return (
				<View style={{ flex: 1 }}>
					<Header leftComponent={this.renderHeaderLeft} backgroundColor='transparent' centerComponent={this.renderHeaderCenter} />
					<ScrollableTabView
						renderTabBar={() => (
							<ScrollableTabBar
								style={styles.scrollStyle}
								tabStyle={styles.tabStyle}
							/>
						)}
						tabBarTextStyle={styles.tabBarTextStyle}
						tabBarInactiveTextColor={'#e6e2e2'} tabBarActiveTextColor={'#17144e'}
						tabBarUnderlineStyle={styles.underlineStyle}
						initialPage={0}>
						<PeopleList key={'1'} tabLabel="Likes You" />
						<MatchesPeoples key={'2'} tabLabel='Matches' navigation={this.props.navigation} />
						<DatesView key={'3'} tabLabel='Dates' /> 
					</ScrollableTabView>
				</View>
			)
		} else {
			return (
				<View style={{ flex: 1 }}>
					<Header leftComponent={this.renderHeaderLeft} backgroundColor='transparent' centerComponent={this.renderHeaderCenter} />
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ fontSize: 28, marginLeft: 20, marginRight: 20, textAlign: 'center' }}>
							{'Verify your photo to access this screen'}
						</Text>
						<Text style={{ fontSize: 14, marginLeft: 20, marginRight: 20, textAlign: 'center', marginTop: 20 }}>
							{'Go to Profile -> Verify Account -> Verify Photo'}
						</Text>
					</View>
				</View>
			)
		}

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
			<Text style={{ fontSize: 21, color: '#17144e', fontWeight: 'bold' }}>Connections</Text>
		)
	}
}
const mapStateToProps = state => {
	return {
		profile: state.user.profile,
		userToken: state.startup.userToken
	}
};
export default connect(mapStateToProps)(ConnectionScreen)
let styles = {
	tabStyle: {},
	scrollStyle: {
		backgroundColor: 'white',
	},
	tabBarTextStyle: {
		fontSize: 17,
		fontFamily: 'ProximaNova-Bold'
	},
	underlineStyle: {
		height: 6,
		backgroundColor: '#3cb9fc',
		borderRadius: 3,
		width: 38,
	},
};
