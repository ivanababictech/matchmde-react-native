import React, { Component } from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Button, Icon } from 'react-native-elements'
import Spinner from 'react-native-spinkit';
import { withNavigation } from 'react-navigation'

import { connect } from 'react-redux'
import FIcon from 'react-native-vector-icons/Feather'
import Images from '../../Theme/Images';


class NoDiscover extends Component {
	render() {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<View style={{ height: '58%', marginBottom: 10 }}>
					<View style={styles.inCircle}>
						<Image source={Images.nodiscover_back} style={{ flex: 1 }} resizeMode={"contain"} />
						<Image source={{ uri: this.props.profile.picture }} style={[styles.avatarImage, { position: 'absolute' }]} resizeMode={"cover"} />
					</View>
				</View>

				<Text style={{ color: '#91919d', fontSize: 17, marginBottom: 12 }}>Looks like no one around your location.</Text>
				<Spinner isVisible={true} type='Circle' color='#3cb9fc' />
				<Button title="CHANGE YOUR LOCATION" ViewComponent={LinearGradient}
					titleStyle={{ fontSize: 16, fontFamily: 'ProximaNova-Bold' }}
					linearGradientProps={{ colors: ['#4a46d6', '#964cc6'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 }, }}
					buttonStyle={{ borderRadius: 30 }}
					icon={<FIcon name='navigation' type='ionicon' color='white' size={20} containerStyle={{}} />}
					onPress={() => { this.props.navigation.push('EditLocation') }}
					containerStyle={{ marginBottom: 20, position: 'absolute', bottom: 0, width: 300 }}
				/>
			</View>
		)
	}
}

let styles = {
	inCircle: {
		width: Dimensions.get("window").width * 0.8,
		height: Dimensions.get("window").width * 0.8,
		borderRadius: 100,
		alignItems: "center", alignSelf: 'center',
		justifyContent: "center",
		marginBottom: 0
	},
	avatarImage: {
		width: Dimensions.get("window").width * 0.6,
		height: Dimensions.get("window").width * 0.6,
		borderRadius: (Dimensions.get("window").width * 0.6) / 2
	},
};

const mapStateToProps = (state) => {
	return {
		dating: state.dating,
		profile: state.user.profile,
	}
};

export default withNavigation(connect(mapStateToProps)(NoDiscover))
