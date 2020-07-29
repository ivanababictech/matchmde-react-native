import React, { Component } from "react";
import { View, Modal, Dimensions, Image, Text } from 'react-native';

import { Button } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import LinearGradient from 'react-native-linear-gradient'
import moment from "moment";
import { Images } from 'App/Theme'

export default class ValidateConfirmedModal extends Component {
	render() {
		return (
			<Modal animationType="fade" transparent={true} visible={this.props.modalVisible}>
				<View style={styles.rootModal}>
					<ScrollView>
						<View style={styles.root}>
							<View style={styles.modalBox}>

								<View style={{ alignItems: 'center' }}>
									<Image source={Images.Image02} style={{ width: 120, height: 120, marginTop: 30 }} resizeMode='contain' />
									<Text style={styles.titleHeader}>
										{"Enjoy Your Date!"}
									</Text>
									<Text style={styles.titleContent}>
										{"Look forward to hearing about it!"}
									</Text>
									<View>
										<View style={{ flexDirection: 'row', width: '80%', marginTop: 30 }}>
											<Image source={Images.calendar} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
											<Text style={styles.Content}>
												{moment(this.props.date.replace(" ", "T")).toDate().toDateString()}
											</Text>
										</View>
										<View style={{ flexDirection: 'row', width: '80%', marginTop: 10 }}>
											<Image source={Images.alarm_clock} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
											<Text style={styles.Content}>
												{moment(this.props.date.replace(" ", "T")).format("hh:mm A")}
											</Text>
										</View>
										<View style={{ flexDirection: 'row', width: '80%', marginTop: 10 }}>
											<Image source={Images.Group_68} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
											<Text style={styles.Content}>
												{this.props.placeAddress}
											</Text>
										</View>
									</View>

									<View style={{ width: '100%' }}>
										<Button title="OK" titleStyle={{ color: '#fff', fontFamily: 'ProximaNova-Bold' }}
											ViewComponent={LinearGradient}
											linearGradientProps={{
												colors: ['#4a46d6', '#964cc6'],
												start: { x: 0, y: 0 },
												end: { x: 0, y: 1 },
											}}
											buttonStyle={{ borderRadius: 30, width: '100%' }}
											onPress={() => { this.props.onOK() }}
											containerStyle={{ marginBottom: 20, marginTop: 30 }}
										/>
									</View>


								</View>

								{/* <Image source={{ uri: this.props.photo }} resizeMode={"cover"}
			              		style={{ width: 100, height: 100, marginTop: -50,marginBottom:30, borderRadius: 50, borderWidth: 5, borderColor: "#FFFDDA"}}/>
			              <Text style={styles.alertText}>Congratulation on your date with {this.props.name}.</Text>
			                <View style={{ width: "90%", marginBottom:20 }}>
			                  <Button title='OK' titleColor='#fff' onPress={() => { this.props.onOK() }} containerStyle={{marginTop:30}}/>
			                </View>               */}
							</View>
						</View>
					</ScrollView>
				</View>
			</Modal>
		)
	}
}

const styles = {
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
		backgroundColor: "#FFF",
		borderRadius: 14,
		alignItems: "center"
	},
	titleHeader: {
		fontSize: 26,
		fontWeight: "600",
		color: "#000",
		marginTop: 20,
		marginLeft: 30,
		marginRight: 30,
		marginHorizontal: 20,
		textAlign: "center"
	},
	titleContent: {
		fontSize: 17,
		fontWeight: "300",
		color: "gray",
		marginTop: 20,
		marginLeft: 30,
		marginRight: 30,
		marginHorizontal: 20,
		textAlign: "center"
	},
	Content: {
		fontSize: 17,
		fontWeight: "300",
		color: "#000",
		marginLeft: 10,
		alignSelf: 'center',
		flex: 1
	},
	alertText: {
		fontSize: 20,
		fontWeight: "600",
		color: "#000",
		marginHorizontal: 20,
		textAlign: 'center'
	}
};
