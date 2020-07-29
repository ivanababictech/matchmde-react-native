import React , { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import { Images } from 'App/Theme'

export default class BoostSuccessModal extends Component{
	render(){
		return(
			<View>
				<Image source={Images.Image02} style={{alignSelf:'center'}}/>
				<Text style={styles.text1}>{`Your Boost is Now \nActive!`}</Text>
				<Text style={styles.text2}>Thanks for purchasing Boost</Text>
				<Button title="OK" ViewComponent={LinearGradient} titleStyle={{fontFamily: 'ProximaNova-Bold'}}
					linearGradientProps={{
					colors: ['#4a46d6', '#964cc6'],
					start: { x: 0, y: 0 },
					end: { x: 0, y: 1 },
					}}
					buttonStyle={{borderRadius:30}}
					onPress={()=>this.props.colseOverlay()}
					containerStyle={{marginBottom:5, marginTop:24}}
				/>
			</View>
			)
	}
}

let styles={
	text1:{
		textAlign:'center',
		alignSelf:'center',
		fontSize:26,
		fontWeight:'bold',
		marginTop:28,
		color:'#17144e'
	},
	text2:{
		color:'#91919d',
		fontSize:17,
		alignSelf:'center',
		textAlign:'center',
		marginTop:24
	}
};
