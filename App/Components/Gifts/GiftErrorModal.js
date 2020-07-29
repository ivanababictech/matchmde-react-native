import React, {Component} from 'react'
import {View, Text, Image} from 'react-native'
import {Overlay, Button} from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { Images } from 'App/Theme'

export default class GiftErrorModal extends Component{
	render(){
		return(
			<Overlay isVisible = {this.props.isVisible} borderRadius={14} width='auto' height='auto'
				overlayStyle={this.props.style} onBackdropPress={this.props.onBackdropPress}>
				<View style={{alignItems:'center'}}>
					<Image source={Images.MilaIcon2} style={{width:156, height:156}} resizeMode='contain'/>
					<Text style={{textAlign:'center', marginTop:26, color:'#17144e', fontSize:26, fontWeight:'bold'}}>{'Choose Someone to \nSend a Gift!'}</Text>
		            <Button title="DISCOVER" titleStyle={{fontFamily: 'ProximaNova-Bold'}}
		                ViewComponent={LinearGradient} 
		                linearGradientProps={{
		                  colors: ['#4a46d6', '#964cc6'],
		                  start: { x: 0, y: 0 },
		                  end: { x: 0, y: 1 },
		                }} 
		                buttonStyle={{borderRadius:30}}                
		                onPress={this.props.onPressDiscover} 
		                containerStyle={{marginBottom:5, width:'78%', marginTop:35}}
		            />
				</View>
			</Overlay>
			)
	}
}