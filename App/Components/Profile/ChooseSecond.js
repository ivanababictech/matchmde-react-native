import React, { Component } from 'react'
import { TextInput, View, Text, ScrollView, Image, TouchableWithoutFeedback, TouchableOpacity, Picker } from 'react-native'

import { Images } from 'App/Theme'
import { Icon, Button, CheckBox } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import ImagePicker from "react-native-image-picker";

const options = [
	'Use my head', 'Using my heart',
	'Based on logic', 'Based on values',
	'Understanding things and ideas', 'Understanding people & emotions',
	'Treating everybody equal', 'Empathizing with people and situations',
];

export default class ChooseSecond extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options: Array.from({ length: 8 }, (v, i) => false),
			options_TF: Array.from({ length: 8 }, (v, i) => false)
		}
	}

	isSelected(index) {
		return this.state.options[index];
	}

	isTFSelected(index) {
		return this.state.options_TF[index]
	}

	handleCheck(index) {
		let options = [...this.state.options];
		let options_TF = [...this.state.options_TF];
		if (!options[index] && options_TF[index]) {
			return
		}
		options[index] = !options[index];
		options_TF[index] = !options_TF[index];
		if (index % 2 == 0) {
			options_TF[index + 1] = !options_TF[index + 1]
		} else {
			options_TF[index - 1] = !options_TF[index - 1]
		}
		this.setState({ options, options_TF })
	}

	handleNext = () => {
		let tplus = 0;
		let fplus = 0;
		this.state.options.forEach((v, i) => {
			if (v) {
				i % 2 == 0 ? tplus++ : fplus++;
			}
		});
		if (tplus + fplus < 3) {
			alert('Please pick three or more');
			return
		}
		let estimate1 = tplus > fplus ? "T" : "F";
		this.props.onNext(estimate1);
	};

	render() {
		let checked = true;
		return (
			<ScrollView>
				<View style={{ marginLeft: '7%', marginRight: '7%' }}>
					<Text style={{ textAlign: 'center', color: '#91919d', fontSize: 17 }}>Question 2</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '4%' }}>
						<Image source={Images.Image02} />
						<Text style={{ marginLeft: 20, fontSize: 20, color: '#17144e', fontFamily: 'ProximaNova-Bold' }}>
							{"How do you make\nyour decisions? "}
						</Text>
					</View>
				</View>
				<View>
					<Text style={{ color: '#17144e', fontSize: 17, marginLeft: 10, marginTop: 20, marginBottom: 25 }}>Please pick three or more: </Text>
					<View style={{ alignItems: 'flex-start' }}>
						{
							options.map((item, index) => {
								const checked = this.isSelected(index);
								const checked_TF = this.isTFSelected(index);
								if (checked_TF && !checked) {
									return (
										<CheckBox checked={false} key={index}
											title={item} onPress={() => { this.handleCheck(index) }}
											textStyle={styles.disableLabelStyle} checkedIcon={null} uncheckedIcon={null}
											containerStyle={styles.disableContainer} />
									)
								} else {
									return (
										<CheckBox checked={checked} key={index}
											title={item} onPress={() => { this.handleCheck(index) }}
											textStyle={checked ? styles.checkedLabelStyle : styles.uncheckedLabelStyle} checkedIcon={null} uncheckedIcon={null}
											containerStyle={checked ? styles.checkedContainer : styles.uncheckedContainer} />
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
						buttonStyle={{ borderRadius: 30 }}
						icon={<Icon name='md-arrow-round-forward' type='ionicon' color='white' containerStyle={{ position: 'absolute', right: 12 }} />}
						onPress={this.handleNext}
						containerStyle={{ marginBottom: 25, marginTop: 30, width: 320, alignSelf: 'center' }} />
				</View>
			</ScrollView>
		)
	}
}
let styles = {
	checkedLabelStyle: {
		textTransform: 'uppercase',
		color: 'white',
		marginLeft: -12
	},
	uncheckedLabelStyle: {
		textTransform: 'uppercase',
		color: '#3cb9fc',
		marginLeft: -12
	},
	checkedContainer: {
		borderRadius: 20,
		backgroundColor: '#3cb9fc',
		borderWidth: 2,
		borderColor: '#3cb9fc',
		padding: Platform.OS === "ios" ? 8 : 0,
	},
	uncheckedContainer: {
		borderRadius: 20,
		borderColor: '#3cb9fc',
		borderWidth: 2,
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
