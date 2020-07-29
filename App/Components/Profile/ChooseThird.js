import React, { Component } from 'react'
import { TextInput, View, Text, ScrollView, Image, TouchableWithoutFeedback, TouchableOpacity, Picker } from 'react-native'

import { Images } from 'App/Theme'
import { Icon, Button, CheckBox } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import ImagePicker from "react-native-image-picker";

const options = [
	'Being social',
	'Quiet me time',
	'Spending time with others',
	'Spending time alone',
	'Having conversations',
	'Listening',
	'Let others talk',
	'Take actions quickly',
	'Think carefully before acting',
	'Many interests',
	'Having few but deep friendships',
];
export default class ChooseThird extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options: Array.from({ length: 11 }, (v, i) => false),
			options_EI: Array.from({ length: 11 }, (v, i) => false)
		}
	}

	isSelected(index) {
		return this.state.options[index];
	}

	isEISelected(index) {
		return this.state.options_EI[index]
	}

	handleCheck(index) {
		let options = [...this.state.options];
		let options_EI = [...this.state.options_EI];

		if (!options[index] && options_EI[index]) {
			return
		}

		options[index] = !options[index];

		if (index == 4) {
			options_EI[4] = !options_EI[4];
			options_EI[5] = !options_EI[5];
			options_EI[6] = !options_EI[6]
		} else if ( index == 5) {
			options_EI[5] = !options_EI[5];
			options_EI[4] = (options_EI[5] || options_EI[6])
		} else if ( index == 6) {
			options_EI[6] = !options_EI[6];
			options_EI[4] = (options_EI[5] || options_EI[6])
		} else if (index < 4) {
			options_EI[index] = !options_EI[index];
			if (index % 2 == 0) {
				options_EI[index + 1] = !options_EI[index + 1]
			} else {
				options_EI[index - 1] = !options_EI[index - 1]
			}
		} else {
			options_EI[index] = !options_EI[index];
			if (index % 2 == 1) {
				options_EI[index + 1] = !options_EI[index + 1]
			} else {
				options_EI[index - 1] = !options_EI[index - 1]
			}
		}



		this.setState({ options, options_EI })
	}

	handleNext = () => {
		let eplus = 0;
		let iplus = 0;
		this.state.options.forEach((v, i) => {
			if (v) {
				i < 5 ? eplus++ : iplus++;
			}
		});

		if (eplus + iplus < 3) {
			alert('Please pick three or more');
			return
		}
		let estimate1 = eplus > iplus ? "E" : "I";
		this.props.onNext(estimate1);
	};

	render() {
		return (
			<ScrollView>
				<View style={{ marginLeft: '7%', marginRight: '7%' }}>
					<Text style={{ textAlign: 'center', color: '#91919d', fontSize: 17 }}>Question 3</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '4%' }}>
						<Image source={Images.Image02} />
						<Text style={{ marginLeft: 20, fontSize: 20, color: '#17144e', fontFamily: 'ProximaNova-Bold' }}>
							{"What do you enjoy?\nOr what best\ndescribes you?"}
						</Text>
					</View>
				</View>
				<View style={{ alignItems: 'flex-start' }}>
					<Text style={{ color: '#17144e', marginLeft: 10, marginTop: 20, marginBottom: 30, fontSize: 17 }}>Please pick three or more</Text>
					{
						options.map((item, index) => {
							const checked = this.isSelected(index);
							const checked_ei = this.isEISelected(index);
							if (checked_ei && !checked) {
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
					<Button title="Next" titleStyle={{ fontFamily: 'ProximaNova-Bold' }}
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
	disableContainer: {
		borderRadius: 20,
		backgroundColor: 'white',
		borderWidth: 2,
		borderColor: '#B1E3FD',
		padding: Platform.OS === "ios" ? 8 : 0,
	},
};
