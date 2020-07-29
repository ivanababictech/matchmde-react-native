import React, {Component} from 'react'
import {View, Text, Image} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import StartupActions from 'App/Stores/Startup/Actions'
import { Images } from 'App/Theme'

import {connect} from 'react-redux'

// import { firebase } from '@react-native-firebase/crashlytics';

class SplahScreen extends Component{
	async componentDidMount(){
		this.props.startup()

		// await firebase.crashlytics().setAttributes({ something: 'something' });
		// firebase.crashlytics().log('A woopsie is incoming :(');
		// firebase.crashlytics().recordError(new Error('I did a woopsie'));
	}

	render(){
		return(
			<View>
				
			</View>
			// <LinearGradient style={{alignItems:'center', justifyContent:'center', flex:1}}
			// 	colors={['#4a46d6', '#964cc6']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
			// 	<Image source={Images.Image02} />
			// 	<Image source={Images.LogoWhiteLabel} style={{marginTop:40}}/>
			// </LinearGradient>
			)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		startup:() => dispatch(StartupActions.startup()),
	}
};

export default connect(null,mapDispatchToProps)(SplahScreen);
