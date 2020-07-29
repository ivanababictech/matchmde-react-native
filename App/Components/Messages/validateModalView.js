import React, { Component } from "react";
import {View, Modal, Dimensions, Image, Text, Linking, ScrollView, TouchableOpacity } from "react-native";
import { Button, Icon } from 'react-native-elements';
import { Images } from "App/Theme";
import LinearGradient from 'react-native-linear-gradient'

import moment from "moment";


export default class ValidateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      count: "0",
      isSelectDetail: false,
      date: (this.props.date + "").replace(" ", "T"),
      time: this.props.date,
      isDateVisible: false,
      isTimeVisible: false
    };
  }

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
											{"Ooh…\n"+this.props.userName+" Would Like to Ask You For a Date :)"}
										</Text>
										<View style={{ width: '100%' }}>
											<Button title="ACCEPT" titleStyle={{ color: '#fff',fontFamily: 'ProximaNova-Bold' }}
												ViewComponent={LinearGradient}
												linearGradientProps={{
													colors: ['#4a46d6', '#964cc6'],
													start: { x: 0, y: 0 },
													end: { x: 0, y: 1 },
												}}
												buttonStyle={{ borderRadius: 30, width: '100%' }}
												onPress={() => this.props.onAccept()}
												containerStyle={{ marginBottom: 0, marginTop: 30 }}
											/>
											<Button title="HMM NOT JUST YET" titleStyle={{ color: '#91919d', fontFamily: 'ProximaNova-Bold' }}
												ViewComponent={LinearGradient}
												linearGradientProps={{
													colors: ['#fff', '#efefef'],
													start: { x: 0, y: 0 },
													end: { x: 0, y: 1 },
												}}
												buttonStyle={{ borderRadius: 30, width: '100%' }}
												onPress={()=>this.props.onCancel()}
												containerStyle={{ marginBottom: 20, marginTop: 20 }}
											/>
										</View>


									</View>

              {/* <Image source={{ uri: this.props.photo }} resizeMode={"cover"}
                style={{ width: 100, height: 100, marginTop: -50,marginBottom:30, borderRadius: 50, borderWidth: 5, borderColor: "#FFFDDA"}}/>
              <Text style={styles.alertText}>{this.props.name} would like to go on at date with you.</Text>
                <View style={{ width: "90%",paddingTop:30 }}>
                  <Text style={styles.nameText}>Date</Text>
                  <View style={styles.dateContainer}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateText}>
                        {moment(this.props.date.replace(" ", "T")).format("YYYY-MM-DD")}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.nameText,{marginTop:30}]}>Time</Text>
                  <View style={styles.dateContainer}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateText}>
                      {moment(this.props.date.replace(" ", "T")).format("hh:mm:A")}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.placeContainer,{marginTop:30}]}>
                    <View style={styles.placeNameBox}>
                      <View style={{width: "80%"}}>
                        <Text style={styles.placeNameText}>{this.props.placeName}</Text>
                        <Text style={styles.placeAddress}>{this.props.placeAddress}</Text>
                      </View>
                      <TouchableOpacity onPress={()=>Linking.openURL(this.props.placeUrl)}>
                        <View style={styles.mapButton}>
                            <Icon type='material-community' name='google-maps' size={30} color='#fff' />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", marginTop:10, marginBottom:0 }}>
                    <View style={{flex: 1, margin: 20}}>
                    <Button title={"Yes"} titleColor={"#fff"}
                      onPress={() => this.props.onAccept()}/>
                    </View>
                    <View style={{flex: 1, margin: 20}}>
                    <Button title={"No"} titleColor={"#fff"} onPress={()=>this.props.onCancel()}/>
                    </View>
                  </View>
                </View>               */}
            </View>
          </View>
          </ScrollView>
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
  nameText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000"
  },
  alertText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginHorizontal: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 20,
    marginHorizontal: 20,
    textAlign: "center"
  },
  image: {
    width: 70,
    height: 70,
    marginTop: 10
  },
  amount: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginTop: 10
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginTop: 10
  },
  controlBox: {
    width: "100%",
    marginVertical: 10,
    marginHorizontal: 20
  },
  textContainer: {
    borderRadius: 5,
    backgroundColor: "#FFFEEA",
    justifyContent: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  phoneInput: {
    fontSize: 18,
    fontWeight: "600",
    height: 150
  },
  recommendHeader: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  recommendImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  recommendTitle: {
    color: "#078582",
    fontWeight: "800",
    fontSize: 18,
    marginHorizontal: 15
  },
  recommendBody: {
    color: "#078582",
    fontSize: 16,
    width: Dimensions.get("window").width - 70
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
  placeContainer: {
    width: "100%"
  },
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
  }
};
