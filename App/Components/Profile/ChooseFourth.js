import React, {Component} from 'react'
import {TextInput, View, Text, ScrollView, Image, TouchableWithoutFeedback, TouchableOpacity, Picker} from 'react-native'

import {Images} from 'App/Theme'
import { Icon, Button, CheckBox } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import ImagePicker from "react-native-image-picker";

const options=[
	'Organized',
	'relaxed',
	'Plan in advance',
	'Go with the flow',
	'Keep to the plan',
	'Adapt Quickly',
	'In control of their life ',
	'let life happen',
	'Finalize decisions',
	'Find out more information',
];

export default class ChooseFourth extends Component{
	constructor(props){
		super(props);
		this.state={
			options:Array.from({length: 10}, (v, i) => false ),
			options_JP: Array.from({length: 10}, (v, i) => false)
		}
	}

	isSelected(index){
		return this.state.options[index];
	}

	isJPSelected(index) {
		return this.state.options_JP[index]
	}

	handleCheck(index){
		let options = [...this.state.options];
		let options_JP = [...this.state.options_JP];
		if (!options[index] && options_JP[index]) {
			return
		}
		options[index]=!options[index];
		options_JP[index] = !options_JP[index];
		if (index % 2 == 0) {
			options_JP[index + 1] = !options_JP[index + 1]
		} else {
			options_JP[index - 1] = !options_JP[index - 1]
		}
		this.setState({options, options_JP})
	}

	handleNext = () =>{
		let jplus=0;
		let pplus=0;
		this.state.options.forEach((v,i)=>{
			if(v){
				i%2==0?jplus++:pplus++;
			}
		});

		if(jplus+pplus<3){
			alert('Please pick three or more');
			return
		}
		let estimate1 = jplus>pplus?"J":"P";
		this.props.onNext(estimate1);
	};

	render(){
		let checked = true;
		return(
			<ScrollView>
				<View style={{marginLeft:'7%', marginRight:'7%'}}>
					<Text style={{textAlign:'center', color:'#91919d',}}>Question 4</Text>
					<View style={{flexDirection:'row', alignItems:'center', marginTop:'4%'}}>
						<Image source={Images.Image02} />
						<Text style={{marginLeft:20, fontSize:20, color:'#17144e', fontWeight:'bold'}}>
							{"How much do you\nlike to plan ahead?"}
						</Text>
					</View>
				</View>
				<View style={{alignItems:'flex-start', marginTop:20}}>
				<Text style={{color:'#17144e', marginTop:15, marginBottom:20, fontSize:17, marginLeft:'3%'}}>Please pick three or more</Text>
					{
						options.map((item, index)=>{
							const checked = this.isSelected(index);
							const checked_JP = this.isJPSelected(index);

							if (checked_JP && !checked) {
								return(
								<CheckBox checked={ false } key = { index }
									title={item} onPress={()=>{ this.handleCheck(index) }}
									textStyle={styles.disableLabelStyle} checkedIcon={null} uncheckedIcon={null}
									containerStyle={styles.disableContainer}/>
								)
							} else {
								return(
								<CheckBox checked={ checked } key = { index }
									title={item} onPress={()=>{ this.handleCheck(index) }}
									textStyle={checked?styles.checkedLabelStyle:styles.uncheckedLabelStyle} checkedIcon={null} uncheckedIcon={null}
									containerStyle={checked?styles.checkedContainer:styles.uncheckedContainer}/>
								)
							}


						})
					}
					<Button title="Next" titleStyle={{fontFamily: 'ProximaNova-Bold'}}
		                ViewComponent={LinearGradient}
		                linearGradientProps={{
		                  colors: ['#4a46d6', '#964cc6'],
		                  start: { x: 0, y: 0 },
		                  end: { x: 0, y: 1 },
		                }}
		                buttonStyle={{borderRadius:30}}
						icon={<Icon name='md-arrow-round-forward' type='ionicon' color='white' containerStyle={{position:'absolute', right:12}}/>}
		                onPress={this.handleNext}
		                containerStyle={{marginBottom:25, marginTop:30, width:320, alignSelf:'center'}}/>
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
	},
};
