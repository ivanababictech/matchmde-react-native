import React, { Component } from "react";
import { View, Modal, Dimensions, Image, Text } from "react-native";

import { Button } from 'react-native-elements';
import { Images } from 'App/Theme';
import LinearGradient from 'react-native-linear-gradient'

export default class RedirectModal extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Modal animationType="fade" transparent={true} visible={this.props.modalVisible}>
				<View style={styles.rootModal}>
					<View style={styles.root}>
						<View style={styles.modalBox}>
							<Image source={this.props.image == 0 ? Images.Image02: Images.good} resizeMode={"contain"} style={{ width: 120, height: 120, marginTop: 50 }} />
							<Text style={styles.header}>{this.props.title}</Text>
							<Text style={styles.title}>{this.props.text}</Text>
							<View style={{ width: '100%', marginTop: 30, marginBottom: 20, paddingLeft: 40, paddingRight: 40 }}>
								<Button title="OK" titleStyle={{ color: '#fff' }} titleStyle={{fontFamily: 'ProximaNova-Bold'}}
									ViewComponent={LinearGradient}
									linearGradientProps={{
										colors: ['#4a46d6', '#964cc6'],
										start: { x: 0, y: 0 },
										end: { x: 0, y: 1 },
									}}
									buttonStyle={{ borderRadius: 30, width: '100%' }}
									onPress={() => this.props.onPress(true)}
									containerStyle={{ marginBottom: 24}}
								/>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		);
	}
}

let styles = {
	rootModal: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		backgroundColor: "#0005",
		alignItems: "center",
		justifyContent: "center"
	},
	root: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		alignItems: "center",
		justifyContent: "center"
	},
	modalBox: {
		width: Dimensions.get("window").width * 0.9,
		backgroundColor: "#fff",
		borderRadius: 14,
		alignItems: "center"
	},
	header: {
		fontSize: 26,
		fontWeight: "600",
		color: "#000",
		marginTop: 20,
		marginHorizontal: 30,
		textAlign: 'center'
	},
	title: {
		fontSize: 17,
		fontWeight: "200",
		color: "gray",
		marginTop: 20,
		marginHorizontal: 40,
		textAlign: 'center'
	}
};
