import React, {Component} from 'react'
import { View, Dimensions, Image , Text} from 'react-native'

import { Images } from 'App/Theme'
var {height, width} = Dimensions.get('window');

export default class TutorialPage extends Component{
	render(){
		return(
			<View style={styles.wrap}>
				<Text style={styles.title}>
                    {`${this.props.title}`}
				</Text>
				<View style={styles.center}>
					<Image source={this.props.image} style={styles.centerImage1} />
				</View>
				<Text style={styles.subtitle}>
				{ this.props.subtitle }
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
        textAlign: 'center',
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
        width:width*0.7,
		color:'#91919d',
		fontSize:14
	}
};
