import React, {Component} from 'react'
import {View, TextInput} from 'react-native'

export default class TextInput2 extends Component{
	constructor(props){
		super(props);
		this.state={
			isFocus:false
		}
	}

	// onFocus = (e) =>{
	// 	this.setState({isFocus:true})
	// }

	// onBlur = (e) =>{
	// 	this.setState({isFocus:false})
	// }
	render(){
		const {style, ...rest } = this.props;
		return(
			<TextInput
				{ ...rest}
				onFocus = {this.props.onFocus }
				onBlur = { this.props.onBlur }
				style={this.state.isFocus ? [style, focusedStyle] : style}
			/>
			)
	}
}

const focusedStyle={
	borderColor:'#3cb9fc'
};
