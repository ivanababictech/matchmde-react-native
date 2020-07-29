import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'

import DatesView from './DatesView'
import TodayMatch from './TodayMatch'
import { connect } from 'react-redux'
import { userService } from 'App/Services/UserService'

class MatchmakeView extends React.Component {
	render() {

		if (this.props.profile.face_verified) {
			return (
				// <ScrollableTabView
				// 	renderTabBar={() => (
				// 		<ScrollableTabBar
				// 			style={styles.scrollStyle}
				// 			tabStyle={styles.tabStyle}
				// 		/>
				// 	)}
				// 	tabBarTextStyle={styles.tabBarTextStyle}
				// 	tabBarInactiveTextColor={'#e6e2e2'} tabBarActiveTextColor={'#17144e'}
				// 	tabBarUnderlineStyle={styles.underlineStyle}
				// 	initialPage={1}>
				// 	<DatesView key={'1'} tabLabel='Dates' /> 
				// 	<TodayMatch key={'2'} tabLabel={"Introductions"} />
				// </ScrollableTabView>
				<TodayMatch />
			)
		} else {
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ fontSize: 28, marginLeft: 20, marginRight: 20, textAlign: 'center' }}>
						{'Verify your photo to access this screen'}
					</Text>
					<Text style={{ fontSize: 14, marginLeft: 20, marginRight: 20, textAlign: 'center', marginTop: 20 }}>
						{'Go to Profile -> Verify Account -> Verify Photo'}
					</Text>
				</View>
			)
		}


	}
}
const mapStateToProps = state => {
	return {
		profile: state.user.profile,
		userToken: state.startup.userToken
	}
};
export default connect(mapStateToProps)(MatchmakeView)
const styles = StyleSheet.create({
	tabStyle: {},
	scrollStyle: {
		backgroundColor: '#f9f9f9',
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
});