import React, {Component} from 'react'
import { View, Text, Image} from 'react-native'
import {Button} from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import { Images } from 'App/Theme'

export default class GiftSendSuccessModal extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return(
			<View>
				<Image source={Images.MilaIcon2} style={styles.topImage} resizeMode='contain' />
				<Text style={styles.alert}>{'Thank you!\nYour Gift Has Been \nSent!'}</Text>
				<Button title="BACK"
	                ViewComponent={LinearGradient}
	                linearGradientProps={{
	                  colors: ['#4a46d6', '#964cc6'],
	                  start: { x: 0, y: 0 },
	                  end: { x: 0, y: 1 },
	                }}
	                buttonStyle={{borderRadius:30}}
	                onPress={this.props.onBack}
	                containerStyle={{marginBottom:5, marginTop:35}}
	            />
			</View>
			)
	}
}

let styles={
	topImage:{
		width:156, height:156, alignSelf:'center'
	},
	alert:{
		fontSize:26, color:'#17144e', fontWeight:'bold', textAlign:'center'
	}
};
