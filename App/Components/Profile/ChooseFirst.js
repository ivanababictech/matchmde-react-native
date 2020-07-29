import React, {Component} from 'react'
import {TextInput, View, Text, ScrollView, Image, Platform} from 'react-native'

import {Images} from 'App/Theme'
import { Icon, Button, CheckBox } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import ImagePicker from "react-native-image-picker";

const options=[
	'Using my five senses',
	'using my “sixth sense”',
	'Pay attention to the details',
	'Exploring possibilities ',
	'Focus on what is present',
	'Like things abstract ',
	'likes practical things',
	'like theories',
	'Being observant and factual',
	'Being creative and imaginative',
	'Doing things systematically ',
	'Trying out new ideas',
];

export default class ChooseFirst extends Component{
	constructor(props){
		super(props);
		this.state={
			options:Array.from({length: 12}, (v, i) => false ),
			options_SN: Array.from({length: 12}, (v, i) => false)
		}
	}

	isSelected(index){
		return this.state.options[index];
	}

	isSNSelected(index) {
		return this.state.options_SN[index]
	}

	handleCheck(index){
		let options = [...this.state.options];
		let options_SN = [...this.state.options_SN];

		if(!options[index] && options_SN[index]) {
			return
		}

		options[index]=!options[index];
		options_SN[index]=!options_SN[index];
		if (index % 2 == 0) {
			options_SN[index + 1] = !options_SN[index + 1]
		} else {
			options_SN[index - 1] = !options_SN[index - 1]
		}
		this.setState({options, options_SN})
	}

	handleNext = () =>{
		let splus=0;
		let nplus=0;
		this.state.options.forEach((v,i)=>{
			if(v){
				i<6?splus++:nplus++;
			}
		});
		if(splus+nplus<3){
			alert('Please pick three or more');
			return;
		}
		let estimate1 = splus>nplus?"S":"N";
		this.props.onNext(estimate1);
	};

	render(){
		return(
			<ScrollView>
				<View style={{marginLeft:'7%', marginRight:'7%'}}>
					<Text style={{textAlign:'center', color:'#91919d',fontSize:17}}>Question 1</Text>
					<View style={{flexDirection:'row', alignItems:'center', marginTop:'4%'}}>
						<Image source={Images.Image02} />
						<Text style={{marginLeft:20, fontSize:20, color:'#17144e', fontWeight:'bold'}}>
							{'How do you see\nthe World?'}
						</Text>
					</View>
				</View>
				<View style={{alignItems:'flex-start', marginLeft:'3%'}}>
				<Text style={{color:'#17144e', marginTop:15, marginBottom:20, fontSize:17}}>Please pick three or more</Text>
				{
					options.map((item, index)=>{
						const checked = this.isSelected(index);
						const checked_sn = this.isSNSelected(index);
						if (checked_sn && !checked) {
							return(
							<CheckBox checked={ false } key={index}
								title={item} onPress={()=>{ this.handleCheck(index) }}
								textStyle={styles.disableLabelStyle} checkedIcon={null} uncheckedIcon={null}
								containerStyle={styles.disableContainer}/>
							)
						} else {
							return(
							<CheckBox checked={ checked } key={index}
								title={item} onPress={()=>{ this.handleCheck(index) }}
								textStyle={checked?styles.checkedLabelStyle:styles.uncheckedLabelStyle} checkedIcon={null} uncheckedIcon={null}
								containerStyle={checked?styles.checkedContainer:styles.uncheckedContainer}/>
							)
						}

					})
				}
				</View>
				<Button title="Next" titleStyle={{fontFamily: 'ProximaNova-Bold'}}
		                ViewComponent={LinearGradient}
		                linearGradientProps={{
		                  colors: ['#4a46d6', '#964cc6'],
		                  start: { x: 0, y: 0 },
		                  end: { x: 0, y: 1 },
		                }}
		                iconRight
		                icon={<Icon name='md-arrow-round-forward' type='ionicon' color='white' containerStyle={{position:'absolute', right:12}}/>}
		                buttonStyle={{borderRadius:30}}
		                onPress={this.handleNext}
		                containerStyle={{marginBottom:25, marginTop:30, width:320, alignSelf:'center'}}/>
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
		marginLeft:0
	},
	uncheckedContainer:{
		borderRadius:20,
		borderColor:'#3cb9fc',
		borderWidth:2,
		padding: Platform.OS === "ios" ? 8 : 0,
		marginLeft:0
	},
	disableLabelStyle:{
		textTransform: 'uppercase',
		color:'#B1E3FD',
		marginLeft:-12
	},
	disableContainer:{
		borderRadius:20,
		backgroundColor:'white',
		borderWidth:2,
		borderColor:'#B1E3FD',
		padding: Platform.OS === "ios" ? 8 : 0,
		marginLeft:0
	},
};
