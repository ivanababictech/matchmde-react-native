import React, {Component} from 'react'
import {View, Text} from 'react-native'

import PropTypes from 'prop-types';


import LinearGradient from 'react-native-linear-gradient'

export default class CheckableComponent extends Component{
	render(){
		const { checked, label } = this.props;
		if(checked){
			return(
				<LinearGradient colors={['#4a46d6', '#964cc6']} start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }} style={styles.wrapper}>
				  <Text style={styles.selectedText}>
				    {label}
				  </Text>
				</LinearGradient>
			)
		}else{
			return(
				<View style={[styles.wrapper, {backgroundColor:'#efecf0'} ]}>
				  <Text style={styles.normalText}>
				    {label}
				  </Text>
				</View>
			)
		}
	}
}

let styles={
	selectedText:{
		fontSize:16,
		color:'white',
		fontWeight:'bold'
	},
	normalText:{
		fontSize:16,
		color:'#91919d',
		fontWeight:'bold'
	},
	wrapper:{
		borderRadius:22,
		padding:10
	}
};
CheckableComponent.propTypes = {
	label:PropTypes.string,
	checked:PropTypes.bool
};
