import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import ViewPager from '@react-native-community/viewpager';

import { Header, Button, Icon } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { StackActions } from 'react-navigation';

import { Images } from 'App/Theme'
import ChooseFirst from 'App/Components/Profile/ChooseFirst'
import ChooseSecond from 'App/Components/Profile/ChooseSecond'
import ChooseThird from 'App/Components/Profile/ChooseThird'
import ChooseFourth from 'App/Components/Profile/ChooseFourth'
import ChooseFifth from 'App/Components/Profile/ChooseFifth'

import SendingProfile from 'App/Components/Profile/SendingProfile'

const popAction = StackActions.pop({
	n: 2,
});

let dots = Array.from({ length: 5 }, (v, i) => 0);

export default class MakeProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: null,
			step: 0,//0,
			pageIndex: 1,
			myer_briggs_type: '',
			profileData: null
		};
		this.viewPager = React.createRef();
	}

	onBack() {
		if( this.state.pageIndex == 1) {
			this.props.navigation.goBack(null);
			return
		}

		this.setState({
			pageIndex:this.state.pageIndex - 1},
			() => {this.viewPager.current.setPageWithoutAnimation(this.state.pageIndex - 1);}
		)
	}

	onNext = (items) => {
		if (this.state.pageIndex < 5) {
			if (this.state.pageIndex == 3) {
				this.setState({ myer_briggs_type: `${items}${this.state.myer_briggs_type}`, pageIndex: this.state.pageIndex + 1 }, () => {
					//this.viewpager.scrollBy(this.state.pageIndex-1,true)
					this.viewPager.current.setPageWithoutAnimation(this.state.pageIndex - 1);
				})
			} else {
				this.setState({ myer_briggs_type: `${this.state.myer_briggs_type}${items}`, pageIndex: this.state.pageIndex + 1 }, () => {
					//this.viewpager.scrollBy(this.state.pageIndex-1,true)
					this.viewPager.current.setPageWithoutAnimation(this.state.pageIndex - 1);
				})
			}

		} else {
			let profile = this.props.navigation.getParam('profile', null);
			profile = { ...profile, myer_briggs_type: this.state.myer_briggs_type, query_language_of_love: items };
			this.setState({ profileData: profile, step: 1 })
		}
	};

	goLoading() {
		this.props.navigation.navigate('Loading', { isSignUp: true })
	}

	render() {

		if (this.state.step == 0) {
			return (
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View style={{ alignItems: 'center' }}>
						<Image source={Images.Image02} style={{width: 120, height: 120}} />
						<Text style={{ fontSize: 26, color: '#17144e', marginTop: 40 }}>We are almost there</Text>
						<Text style={{ textAlign: 'center', marginTop: 30, color: '#91919d' }}>{"To make sure I find you great matches, I \n need to know you just a wee bit more"}</Text>
					</View>
					<Button title="Next" titleStyle={{fontFamily: 'ProximaNova-Bold'}}
						ViewComponent={LinearGradient}
						linearGradientProps={{
							colors: ['#4a46d6', '#964cc6'],
							start: { x: 0, y: 0 },
							end: { x: 0, y: 1 },
						}}
						buttonStyle={{ borderRadius: 30 }}
						icon={<Icon name='md-arrow-round-forward' type='ionicon' color='white' containerStyle={{position:'absolute', right:12}}/>}
						onPress={() => { this.setState({ step: 2 }) }}
						containerStyle={{ position: 'absolute', bottom: 10, width: 300, alignSelf: 'center' }} />
				</View>
			)
		} else if (this.state.step == 1) {
			return (<SendingProfile profileData={this.state.profileData} onNext={() => { this.goLoading() }} onBack={() => { this.props.navigation.dispatch(popAction); }} />)
		}
		return (
			<View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
				<Header backgroundColor='transparent' leftComponent={this.header_left} centerComponent={this.renderCenterDots} />
				<ViewPager ref={this.viewPager} scrollEnabled={false} style={{ flex: 1, marginTop: 10 }}>
					<View key="0" style={{ flex: 1 }}>
						<ChooseFirst onNext={this.onNext} />
					</View>
					<View key="1" style={{ flex: 1 }}>
						<ChooseSecond onNext={this.onNext} />
					</View>
					<View key="2" style={{ flex: 1 }}>
						<ChooseThird onNext={this.onNext} />
					</View>
					<View key="3" style={{ flex: 1 }}>
						<ChooseFourth onNext={this.onNext} />
					</View>
					<View key="4" style={{ flex: 1 }}>
						<ChooseFifth onNext={this.onNext} />
					</View>
				</ViewPager>
			</View>
		)
	}

	renderCenterDots = () => {
		return (
			<View style={{ flexDirection: 'row' }}>
				{
					dots.map((v, i) => {
						let backgroundColor = (i < this.state.pageIndex ? '#3cb9fc' : '#d6d6d6');
						return (
							<View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: backgroundColor, marginRight: 5 }} />
						)
					})
				}
			</View>
		)
	};

	header_left = () => {
		return (
			<TouchableOpacity onPress={() => { this.onBack() }} style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Icon name='ios-arrow-back' type='ionicon' containerStyle={{ marginRight: 4 }} color='#17144e' />
				<Text style={styles.headerLeftText}>Back</Text>
			</TouchableOpacity>
		);
	};
}

let styles = {
	headerLeftText: {
		color: '#17144e'
	}
};
