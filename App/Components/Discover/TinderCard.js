import React, {Component } from 'react'
import {View, Text, Image, ImageBackground, Dimensions, TouchableOpacity} from 'react-native'
import { Card } from 'react-native-elements'

import { userService } from 'App/Services/UserService'
import { connect } from 'react-redux'

class TinderCard extends Component{

	constructor(props){
		super(props);
		this.state={
			imageIndex:0
		}
	}

	render(){
		const { item }= this.props;
		// const { photos } = this.props.item
		//const photoUri =  photos?photos[this.state.imageIndex].url:null
		if (item == null) {
			return(
				this.props.swipedAllCards(),
				null
			)
		}
		const photoUri = item.picture;
		return(
			<ImageBackground source={{uri:photoUri}} style={styles.cardPhoto} imageStyle={{ borderRadius: 10}}>
				<View style={styles.name_info_container}>
	              	<TouchableOpacity onPress={()=>{ this.props.gotoProfile() }}
	              		style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                		<View>
                  			<Text style={styles.name_style}>
                    			{`${item.name}, ${userService.calcAge(item.birthday)}`}
                  			</Text>
                  			<Text style={styles.school_style}>
                    			{item.education}
                  			</Text>
                		</View>
            			<View>
              				<Text style={styles.name_style} >{" "}</Text>
							<Text style={styles.distance_style}>
								{getDistance( item.latitude, item.longitude,
								  this.props.user.latitude, this.props.user.longitude )} away
							</Text>
            			</View>
          			</TouchableOpacity>
        		</View>
			</ImageBackground>
			)
	}
}

const getDistance = (lat1, lon1, lat2, lon2) => {
    var R = 6371;
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    if (d > 1) return Math.round(d) + "km";
    else if (d <= 1) return Math.round(d * 1000) + "m";
    return d;
  };

let styles={
	cardPhoto: {
		width: Dimensions.get("window").width*0.9,
		height: (Dimensions.get("window").height - 210),
		alignSelf:'center',
		justifyContent: "flex-end",
	},
	name_info_container: {
		padding: 20
	},
	name_style: {
		fontSize: 24,
		fontWeight: "700",
		color: "white",
		marginBottom: 5,
		backgroundColor: "transparent"
	},
	distance_style: {
		fontSize: 18,
		fontWeight: "600",
		color: "white",
		backgroundColor: "transparent"
	},
	school_style: {
		fontSize: 18,
		fontWeight: "400",
		color: "white",
		backgroundColor: "transparent"
	},
};

const mapStateToProps = (state) =>{
	return{
		user:state.user.profile
	}
};
export default connect(mapStateToProps)(TinderCard)
