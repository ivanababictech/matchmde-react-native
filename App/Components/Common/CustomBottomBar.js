import React, { Component } from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'

import { Images } from 'App/Theme'

const tabItems=[
	{
		iconSourceActive:Images.CompassBlue,
		iconSourceNormal:Images.Compass,
		label:'Discover'
	},
	{
		iconSourceActive:Images.CompassBlue,
		iconSourceNormal:Images.Compass,
		label:'Discover'
	}
];
const fontSize = 10;

export default class CustomBottomBar extends Component{
	render(){
		return(
			<View style={{height:70, flexDirection:'row', backgroundColor:'white'}}>
				{ this.renderDiscoverTabItem() }
				{ this.renderMatchmadeTabItem() }
				{ this.renderMessageTabItem() }
				{ this.renderStoreTabItem() }
				{ this.renderProfileTabItem() }
			</View>
			)
	}

	renderDiscoverTabItem(){
		if(this.props.activeTab==0){
			return(
				<View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
					<Image source={Images.CompassBlue} style={{width:24, height:29}}/>
					<Text style={{color:'#3cb9fc', fontSize:fontSize, marginTop:7}}>Discover</Text>
				</View>
			)
		}else{
			return(
				<TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
					onPress={()=>{ this.props.changeTab(0) }}>
					<Image source={Images.Compass} style={{width:24, height:29}}/>
					<Text style={{color:'#91919d', fontSize:fontSize, marginTop:7}}>Discover</Text>
				</TouchableOpacity>
			)
		}
	}

	renderMatchmadeTabItem(){
		if(this.props.activeTab==1){
			return(
				<View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
					<Image source={Images.MatchmakerBlue} style={{width:36, height:31}}/>
					<Text style={{color:'#3cb9fc', fontSize:fontSize, marginTop:4}}>Matchmaker</Text>
				</View>
			)
		}else{
			return(
				<TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
					onPress={()=>{ this.props.changeTab(1) }}>
					<Image source={Images.Matchmaker} style={{width:36, height:31}}/>
					<Text style={{color:'#91919d', fontSize:fontSize, marginTop:4}}>Matchmaker</Text>
				</TouchableOpacity>
			)
		}
	}

	renderMessageTabItem(){
		if(this.props.activeTab==2){
			return(
				<View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
					<Image source={Images.MessageBlue} style={{width:32, height:25}}/>
					<Text style={{color:'#3cb9fc', fontSize:fontSize, marginTop:9}}>Messages</Text>
				</View>
			)
		}else{
			return(
				<TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
					onPress={()=>{ this.props.changeTab(2) }}>
					<Image source={Images.Message} style={{width:32, height:25}}/>
					<Text style={{color:'#91919d', fontSize:fontSize, marginTop:9}}>Messages</Text>
				</TouchableOpacity>
			)
		}
	}

	renderStoreTabItem(){
		if(this.props.activeTab==3){
			return(
				<View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
					<Image source={Images.StoreBlue} style={{width:30, height:30}}/>
					<Text style={{color:'#3cb9fc', fontSize:fontSize, marginTop:4}}>Store</Text>
				</View>
			)
		}else{
			return(
				<TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
					onPress={()=>{ this.props.changeTab(3) }}>
					<Image source={Images.Store} style={{width:30, height:30}}/>
					<Text style={{color:'#91919d', fontSize:fontSize, marginTop:4}}>Store</Text>
				</TouchableOpacity>
			)
		}
	}

	renderProfileTabItem(){
		if(this.props.activeTab==4){
			return(
				<View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
					<Image source={Images.ProfileBlue} style={{width:28, height:28}}/>
					<Text style={{color:'#3cb9fc', fontSize:fontSize, marginTop:5}}>Profile</Text>
				</View>
			)
		}else{
			return(
				<TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
					onPress={()=>{ this.props.changeTab(4) }}>
					<Image source={Images.Profile} style={{width:28, height:28}}/>
					<Text style={{color:'#91919d', fontSize:fontSize, marginTop:5}}>Profile</Text>
				</TouchableOpacity>
			)
		}
	}
}
