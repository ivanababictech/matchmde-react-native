import React, {Component} from 'react'
import { View, Dimensions, Image , Text} from 'react-native'

import { Images } from 'App/Theme'
var {height, width} = Dimensions.get('window');

export default class IntroFirst extends Component{
	render(){
		return(
			<View style={styles.wrap}>
				<Text style={styles.title}>
				The A.I. MatchMaker
				</Text>
				<View style={styles.center}>
					<Image source={Images.Pre_login_Pic} style={styles.centerImage1} />
					<Image source={Images.Image02} style={styles.centerImage2} />
				</View>
				<Text style={styles.subtitle}>
				{ "For meaningful connections \nand finding your soulmate" }
				</Text>
			</View>
			)
	}
}

let styles={
	wrap:{
		flex:1,
		justifyContent:'space-evenly',
	},
	title:{
		alignSelf:'center',
		fontSize:31,
		fontWeight:'bold',
		color:'#17144e'
	},
	center:{
		width:width*0.7,
		height:width*0.7,
		alignSelf:'center'
	},
	centerImage1:{
		width:width*0.7,
		height:width*0.7,
		borderRadius: width*0.35
	},
	centerImage2:{
		position:'absolute',
		right:0,
		bottom:0
	},
	subtitle:{
		alignSelf:'center',
		textAlign:'center',
		color:'#91919d',
		fontSize:17
	}
};
