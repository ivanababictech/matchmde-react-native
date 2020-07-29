import React, {Component} from 'react'
import { View, Dimensions, Image , Text} from 'react-native'

import { Images } from 'App/Theme'

const screenWidth = Dimensions.get('window').width;


export default class IntroSecond extends Component{
	render(){
		return(
			<View style={styles.wrap}>
				<Image source={Images.MilaIcon2} style={styles.topImg}/>
				<Text style={styles.title}>
				{
					"Hello! I am M.I.L.A \nYour Matchmade Intelligent Love Assistant!"
				}
				</Text>
				<Text style={styles.subtitle1}>
				{
					"I'll be your guide in a new way to finding \nyour perfect soulmate, powered by our \nsmart A.I. technology"
				}
				</Text>

				<Text style={styles.subtitle1}>
				{
					"Say goodbye to mindless swiping."
				}
				</Text>
			</View>
			)
	}
}
let styles={
	wrap:{
		flex:1,
		justifyContent:'space-evenly'
	},
	topImg:{
		alignSelf:'center',
		width:screenWidth*0.4,
		height:screenWidth*0.4
	},
	title:{
		color:'#17144e',
		fontSize:24,
		textAlign:'center',
		alignSelf:'center',
		fontFamily: 'ProximaNova-Bold'
	},
	subtitle1:{
		color:'#91919d',
		fontSize:17,
		alignSelf:'center',
		textAlign:'center'
	},
};
