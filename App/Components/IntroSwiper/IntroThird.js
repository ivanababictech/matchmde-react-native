import React, {Component} from 'react'
import { View, Dimensions, Image , Text} from 'react-native'

import { Images } from 'App/Theme'
var {height, width} = Dimensions.get('window');

export default class IntroThird extends Component{
	render(){
		return(
			<View style={{flex:1,justifyContent:'center'}}>
				<View style={styles.itemWrap}>
					<Image source={Images.Image04}/>
					<Text style={styles.itemText}>
						Real life matchmaking experience built into M.I.L.A. to find quality matches
					</Text>
				</View>

				<View style={styles.itemWrap}>
					<Image source={Images.Image05}/>
					<Text style={styles.itemText}>
						Date coaching to support you through your love journey and even setting up dates!
					</Text>
				</View>

				<View style={styles.itemWrap}>
					<Image source={Images.Image06}/>
					<Text style={styles.itemText}>
						Data and feedback to help M.I.L.A get smarter in matching, building deeper connections and keeping the flame going
					</Text>
				</View>
			</View>
			)
	}
}

let styles={
	itemWrap:{
		flexDirection:'row', paddingLeft:25,
		marginVertical:20
	},
	itemText:{
		flex:1,
		color:'#91919d',
		fontSize:17,
		marginLeft:20,
		marginRight:25
	}

};
