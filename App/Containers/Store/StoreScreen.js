import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'

import StoreView from './StoreView'
import MatchPayView from './MatchPayView'
import ActivityView from './ActivityView'
import { NavigationEvents } from 'react-navigation'

import StartupActions from 'App/Stores/Startup/Actions'
import { connect } from "react-redux";

class StoreScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			initialPage: 1
		}
	}


	componentDidMount() {
		this.setState({
			initialPage: 1
		})
	}

	render() {
		return (
				<ScrollableTabView
					renderTabBar={() => (
						<ScrollableTabBar
							style={styles.scrollStyle}
							tabStyle={styles.tabStyle}
						/>
					)}
					onChangeTab={this.onChangeTab}
					tabBarTextStyle={styles.tabBarTextStyle}
					tabBarInactiveTextColor={'#e6e2e2'} tabBarActiveTextColor={'#17144e'}
					tabBarUnderlineStyle={styles.underlineStyle}
					page={this.props.startup.storeTab}
					initialPage={1}>
					<MatchPayView key={'1'} tabLabel='Match $' />
					<StoreView key={'2'} tabLabel='Store' />
					<ActivityView key={'3'} tabLabel="Activity" />

				</ScrollableTabView>


		)
	}

	onChangeTab = ({ i }) => {
		if (i == 0) {
			this.props.headerRight((<Text>Right</Text>))
		} else {
			return this.props.headerRight(null)
		}
		// this.state.initialPage = i
		this.props.setStoreTab(i)
	}
}

const mapStateToPros = (state)=>{
	return {
		startup: state.startup
	};
};

const mapDispatchToProps = dispatch => {
  return {
    setStoreTab: data => dispatch(StartupActions.updateStoreTab(data)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(StoreScreen)

const styles = StyleSheet.create({
	tabStyle: {},
	scrollStyle: {
		backgroundColor: 'white',
		// justifyContent: 'center',
	},
	tabBarTextStyle: {
		fontSize: 17,
		fontFamily: 'ProximaNova-Bold'
	},
	underlineStyle: {
		height: 6,
		backgroundColor: '#3cb9fc',
		borderRadius: 3,
		width: 40,
	},
});
