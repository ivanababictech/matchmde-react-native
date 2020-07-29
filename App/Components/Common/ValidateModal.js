import React, { Component } from "react";
import { View, Modal, Dimensions, Image, Text, DatePickerIOS, Linking } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Icon } from 'react-native-elements'
import moment from "moment";
import LinearGradient from 'react-native-linear-gradient'
import { Dropdown } from 'react-native-material-dropdown';
import { Images } from 'App/Theme'
import { connect } from 'react-redux'
import { userService } from 'App/Services/UserService'

class ValidateModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			count: "0",
			isSelectDetail: false,
			date: new Date(),
			time: new Date(),
			isDateVisible: false,
			isTimeVisible: false,
			hangouts: [],
			selectedDatePlace: '',
			hangoutsList: [],
			dateDate: {}
		};
	}

	async componentDidMount() {
		this.fetchHangouts()
	}

	fetchHangouts = async () => {
		this.setState({ isRefreshing: true });
		try {
			const response = await userService.accountHangouts(this.props.userToken.access_token);
			let temp = [];
			response.data.data.map((v) => {
				temp.push({value: v.name})
			});
			this.setState({ hangouts: response.data.data, hangoutsList: temp })
		} catch (err) {
			console.log("hangouts -> ",err)
		}
		this.setState({ isRefreshing: false })
	};

	handlePlace = (selectedDatePlace, index, data) => {
		const hang = this.state.hangouts[index];
		hang.id = null;
        this.setState({ selectedDatePlace, dateDate: hang })
    };

	render() {
		return (
			<Modal animationType="fade" transparent={true} visible={this.props.modalVisible} >
				<View style={styles.rootModal}>
					<ScrollView>
						<View style={styles.root}>
							<View style={[styles.modalBox, { paddingBottom: 20 }]}>
								{/* <Image source={{ uri: this.props.photo }} resizeMode='cover' */}
								{/* style={{ width: 100, height: 100, marginTop: -50, borderRadius: 50, borderWidth: 5, borderColor: "#FFFDDA"}}/> */}
								{/* <Text style={styles.nameText}>{this.props.name}</Text> */}
								{!this.state.isSelectDetail ? (
									// <View>
									// 	<Text style={styles.title}>
									// 		{"Would you like to go out on a date with "}
									// 		{this.props.name}
									// 		{"?"}
									// 	</Text>
									// 	<View style={{ flexDirection: "row", marginTop:20 }}>
									// 		  <View style={{flex: 1}}>
									// 		  <Button title='Yes' titleColor='#fff' onPress={() => this.setState({ isSelectDetail: true }) } style={{marginHorizontal: 20}}/>
									// 		  </View>
									// 		  <View style={{flex: 1}}>
									// 		  <Button title='No' titleColor='#fff' onPress={()=>this.props.onCancel()} style={{marginHorizontal: 20}}/>
									// 		  </View>
									// 	</View>
									// </View>
									<View style={{ alignItems: 'center' }}>
										<Image source={Images.heart_eyes} style={{ width: 120, height: 120, marginTop: 30 }} resizeMode='contain' />
										<Text style={styles.titleHeader}>
											{"I Can See Things Are Warming Up for You Two"}
										</Text>
										<Text style={styles.titleContent}>
											{"Why not ask her for a drink or coffee to get to know her better? We can help set it up!"}
										</Text>
										<View style={{ width: '100%' }}>
											<Button title="YES, PLEASE ASK" titleStyle={{ color: '#fff', fontFamily: 'ProximaNova-Bold' }}
												ViewComponent={LinearGradient}
												linearGradientProps={{
													colors: ['#4a46d6', '#964cc6'],
													start: { x: 0, y: 0 },
													end: { x: 0, y: 1 },
												}}
												buttonStyle={{ borderRadius: 30, width: '100%' }}
												onPress={() => this.setState({ isSelectDetail: true })}
												containerStyle={{ marginBottom: 0, marginTop: 30 }}
											/>
											<Button title="I'LL DO IT MYSELF" titleStyle={{ color: '#91919d', fontFamily: 'ProximaNova-Bold' }}
												ViewComponent={LinearGradient}
												linearGradientProps={{
													colors: ['#fff', '#efefef'],
													start: { x: 0, y: 0 },
													end: { x: 0, y: 1 },
												}}
												buttonStyle={{ borderRadius: 30, width: '100%' }}
												onPress={() => this.props.onCancel()}
												containerStyle={{ marginBottom: 0, marginTop: 20 }}
											/>
											<Button title="I'LL WAIT A BIT MORE" titleStyle={{ color: '#91919d', fontFamily: 'ProximaNova-Bold' }}
												ViewComponent={LinearGradient}
												linearGradientProps={{
													colors: ['#fff', '#efefef'],
													start: { x: 0, y: 0 },
													end: { x: 0, y: 1 },
												}}
												buttonStyle={{ borderRadius: 30, width: '100%' }}
												onPress={() => this.props.onCancel()}
												containerStyle={{ marginBottom: 20, marginTop: 20 }}
											/>
										</View>


									</View>
								) : (
										<View style={{ width: "90%", paddingTop: 10 }}>

											<View style={{ flexDirection: 'row', width: '100%', marginBottom: 20, marginTop: 30 }}>
												<Image source={Images.MilaIcon2} style={{ width: 100, height: 100 }} resizeMode='contain' />
												<Text style={styles.lastTitle}>
													{"Let Us Help Set You Up For The Date"}
												</Text>
											</View>

											<Text style={styles.nameText}>Date</Text>
											<View style={[styles.dateContainer, { marginBottom: 30 }]}>
												<View style={styles.dateBox}>
													<Text style={styles.dateText}>
														{moment(this.state.date).format("YYYY-MM-DD")}
													</Text>
													<TouchableOpacity onPress={() => this.setState({ isDateVisible: !this.state.isDateVisible, isTimeVisible: false })}>
														<Image source={Images.calendar} style={{ width: 24, height: 24, marginEnd: 8 }} resizeMode={"contain"} />
													</TouchableOpacity>
												</View>
												{this.state.isDateVisible ? (
													<DatePickerIOS
														style={{ width: "100%" }}
														date={this.state.date}
														mode={"date"}
														minimumDate={new Date()}
														onDateChange={date =>
															this.setState({
																date: date
															})
														}
													/>
												) : null}
											</View>
											<Text style={styles.nameText}>Time</Text>
											<View style={[styles.dateContainer, { marginBottom: 30 }]}>
												<View style={styles.dateBox}>
													<Text style={styles.dateText}>
														{moment(this.state.date).format("hh:mm:A")}
													</Text>
													<TouchableOpacity onPress={() => this.setState({ isTimeVisible: !this.state.isTimeVisible, isDateVisible: false })}>
														<Image source={Images.alarm_clock} style={{ width: 24, height: 24, marginEnd: 8 }} resizeMode='contain' />
													</TouchableOpacity>
												</View>
												{this.state.isTimeVisible ? (
													<DatePickerIOS
														style={{ width: "100%" }}
														date={this.state.date}
														mode={"time"}
														minimumDate={new Date()}
														onDateChange={time =>
															this.setState({
																date: time
															})
														}
													/>
												) : null}
											</View>
											<View style={[styles.placeContainer, { marginBottom: 30 }]}>
												<View style={styles.placeNameBox}>
													<View style={{ width: "80%" }}>


														{
															this.props.placeAddress ? (
																 <View>
																	 <Text style={styles.placeNameText}>{this.props.placeName}</Text>
																	 <Text style={styles.placeAddress}>{this.props.placeAddress}</Text>
																 </View>
															): (
																<Dropdown label='' data={this.state.hangoutsList} containerStyle={styles.dropdownContainer}
																		  labelHeight={6} onChangeText={ this.handlePlace } value={'Select a Date Place'}
																		  itemTextStyle={{ fontWeight: 'bold' }}
																		  style={{ fontWeight: 'bold' }}
																		  rippleInsets={{ bottom: -10, top: 10, left: 0, right: 0 }}
																		  inputContainerStyle={styles.dropdownInput} />
															)
														}
													</View>
													<TouchableOpacity onPress={() => Linking.openURL(this.props.placeUrl)}>
														<View style={styles.mapButton}>
															<Icon type='material-community' name="google-maps" size={30} color='#fff' />
														</View>
													</TouchableOpacity>
												</View>
											</View>
											<Button title="Continue" titleStyle={{ color: '#fff', fontFamily: 'ProximaNova-Bold' }}
												ViewComponent={LinearGradient}
												linearGradientProps={{
													colors: ['#4a46d6', '#964cc6'],
													start: { x: 0, y: 0 },
													end: { x: 0, y: 1 },
												}}
												buttonStyle={{ borderRadius: 30, width: '100%' }}
												onPress={() => this.props.onRequest(this.props.placeAddress ? this.state.date :
												{
													date: moment(this.state.date).format("YYYY-MM-DD HH:mm:ss"),
													venue: this.state.dateDate
												}
												)}
												containerStyle={{ marginBottom: 0 }}
											/>
											<Button title="CANCEL" titleStyle={{ color: '#91919d', fontFamily: 'ProximaNova-Bold' }}
												ViewComponent={LinearGradient}
												linearGradientProps={{
													colors: ['#fff', '#efefef'],
													start: { x: 0, y: 0 },
													end: { x: 0, y: 1 },
												}}
												buttonStyle={{ borderRadius: 30, width: '100%' }}
												onPress={() => this.props.onCancel()}
												containerStyle={{ marginBottom: 20, marginTop: 20 }}
											/>
										</View>
									)}
							</View>
						</View>
					</ScrollView>
				</View>
			</Modal>
		);
	}
}

const mapStateToPros = state => {
	return {
		userToken: state.startup.userToken
	}
};

export default connect(mapStateToPros)(ValidateModal)

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
	nameText: {
		fontSize: 20,
		fontWeight: "600",
		color: "#000",
		marginBottom: 5
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		color: "#000",
		marginTop: 20,
		marginHorizontal: 20,
		textAlign: "center"
	},
	lastTitle: {
		fontSize: 26,
		fontWeight: "600",
		color: "#000",
		marginLeft: 20,
		marginRight: 10,
		marginHorizontal: 20,
		flex: 1
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
	image: {
		width: 70,
		height: 70,
		marginTop: 10
	},
	dateContainer: {
		width: "100%",
		borderRadius: 5,
		backgroundColor: "white",
		shadowColor: "#000",
		alignItems: "center",
		justifyContent: "space-between",
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3
	},
	dateText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#000",
		marginHorizontal: 10
	},
	dateBox: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		height: 40,
		width: "100%"
	},
	placeContainer: { width: "100%" },
	placeNameBox: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	placeNameText: {
		fontSize: 20,
		fontWeight: "600",
		color: "#000",
		marginHorizontal: 5
	},
	placeAddress: {
		fontSize: 14,
		fontWeight: "600",
		color: "#000",
		marginHorizontal: 5
	},
	mapButton: {
		width: 50,
		height: 50,
		margin: 5,
		backgroundColor: "#1D3B7B",
		borderRadius: 25,
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
		alignItems: 'center',
		justifyContent: 'center'
	},
	dropdownContainer: {
        height: 40,
        paddingLeft: 0,
        marginTop: 6,
        borderWidth: 1,
		borderColor: '#e6e2e2',
		borderRadius: 5,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3
	},
	dropdownInput: {
        borderBottomWidth: 0, marginBottom: 0, paddingLeft: 10, marginRight: 3
    },
};
