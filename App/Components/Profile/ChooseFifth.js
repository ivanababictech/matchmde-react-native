import React, {Component} from 'react'
import {TextInput, View, Text, ScrollView, Image, TouchableWithoutFeedback, TouchableOpacity, Picker} from 'react-native'

import {Images} from 'App/Theme'
import { Icon, Button, CheckBox } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import ImagePicker from "react-native-image-picker";

let questions = [
	'TELLS ME HOW MUCH I AM APPRECIATED',
	'DOES THINGS/CHORES TO SURPRISE ME',
	'BUYS ME GIFTS',
	'TOUCHES AND HUGS ME',
	'SPENDS QUALITY TIME WITH ME'
];

export default class ChooseFourth extends Component{
	constructor(props){
		super(props);
		this.state={
			options:Array.from({length: 5}, (v, i) => false ),
			answer:'',
			selectedIndex:-1
		}
	}

	isSelected(index){
		return this.state.options[index];
	}

	handleCheck(index){
		this.setState({ selectedIndex:index, answer:questions[index] })
	}

	handleNext = () =>{
		this.props.onNext(this.state.answer);
	};

	render(){
		let checked = true;
		return(
			<ScrollView>
				<View style={{marginLeft:'7%', marginRight:'7%'}}>
					<Text style={{textAlign:'center', color:'#91919d',fontSize:17}}>Question 5</Text>
					<View style={{flexDirection:'row', alignItems:'center', marginTop:'4%'}}>
						<Image source={Images.Image02} />
						<Text style={{marginLeft:20, fontSize:25, color:'#17144e', fontWeight:'bold'}}>
							{"When do you feel \nmost loved?"}
						</Text>
					</View>
				</View>
				<View style={{alignItems:'flex-start', marginTop:20}}>
				<View style={{width: '100%', marginTop:15, marginBottom:20, flexDirection: 'row'}}>
					<Text style={{color:'#17144e', fontSize:17, marginLeft:'3%', width: '50%'}}>When my partner…</Text>
					<Text style={{color:'gray', fontStyle: 'italic', fontSize:17, marginRight:'-13%', width: '50%', textAlign: 'right'}}>Select one only</Text>
				</View>
					{
						questions.map((v,index)=>{
							const checked = (this.state.selectedIndex===index);
							return(
							<CheckBox checked={ checked } key = {index }
								title={v} onPress={()=>{ this.handleCheck(index) }}
								textStyle={checked?styles.checkedLabelStyle:styles.uncheckedLabelStyle} checkedIcon={null} uncheckedIcon={null}
								containerStyle={checked?styles.checkedContainer:styles.uncheckedContainer}/>
							)
						})
					}
					<Button title="DONE!" titleStyle={{fontFamily: 'ProximaNova-Bold'}}
		                ViewComponent={LinearGradient}
		                linearGradientProps={{
		                  colors: ['#4a46d6', '#964cc6'],
		                  start: { x: 0, y: 0 },
		                  end: { x: 0, y: 1 },
		                }}
		                buttonStyle={{borderRadius:30}}
						icon={<Icon name='md-arrow-round-forward' type='ionicon' color='white' containerStyle={{position:'absolute', right:12}}/>}
		                onPress={this.handleNext}
		                containerStyle={{marginBottom:5, marginTop:30, width:320, alignSelf:'center'}}/>
				</View>
			</ScrollView>
			)
	}
}
let styles={
	checkedLabelStyle:{
		textTransform: 'uppercase',
		color:'white',
		marginLeft:-12
	},
	uncheckedLabelStyle:{
		textTransform: 'uppercase',
		color:'#3cb9fc',
		marginLeft:-12
	},
	checkedContainer:{
		borderRadius:20,
		backgroundColor:'#3cb9fc',
		borderWidth:2,
		borderColor:'#3cb9fc',
		padding: Platform.OS === "ios" ? 8 : 0,
	},
	uncheckedContainer:{
		borderRadius:20,
		borderColor:'#3cb9fc',
		borderWidth:2,
		padding: Platform.OS === "ios" ? 8 : 0,
	}
};
