import React, {Component} from 'react'
import { View, Text, TouchableOpacity, Dimensions} from 'react-native'
import { Avatar, Header, Icon } from 'react-native-elements'

import { Dialogflow_V2 } from "react-native-dialogflow";
import { GiftedChat, MessageImage } from "react-native-gifted-chat";

import { dialogFlowConfig } from "App/Config";
import { fbService } from 'App/Services/FirebaseService'
import { Images } from 'App/Theme'

const IMAGEMARK = "$I$M$A$G$E$M$A$R$K$";

Dialogflow_V2.setConfiguration(
  dialogFlowConfig.client_email,
  dialogFlowConfig.private_key,
  Dialogflow_V2.LANG_ENGLISH_US,
  dialogFlowConfig.project_id
);

export default class AdminChatRoomScreen extends Component{
	constructor(props){
		super(props);
		this.state = {
			messages:[]
		};

		this.adminChatRoomRef = fbService.getAdminChatRoomRef()
	}
	componentDidMount(){

		this.adminChatRoomRef.on('child_added', snapshot=>{
			const message = fbService.parse_admin(snapshot);
			let newMessage;

			message.user.avatar = 120
			console.log("aaaaaaaa", message)

			if (message.text.includes(IMAGEMARK)) {
				const img = message.text.replace(IMAGEMARK, "");
				newMessage = Object.assign({ image: img }, message);
				newMessage.text = ""
			} else {
				newMessage = message
			}

			this.setState(previousState => ({
			  messages: GiftedChat.append(previousState.messages, newMessage)
	        }));
		})
	}

	componentWillUnmount(){
		this.adminChatRoomRef.off()
	}

	render(){
		return(
			<View style={{flex:1, backgroundColor:'#f9f9f9'}}>
				<Header leftComponent={this.header_left} centerComponent={this.header_center}
		            rightComponent={this.header_right} backgroundColor="transparent"/>
		        <GiftedChat
		            messages={this.state.messages}
		            renderInputToolbar={()=>{
		              return(<View></View>);
		            }}
		            scrollToBottom={true}
		            showUserAvatar={false}
		            alwaysShowSend={true}

					renderMessageImage={(props) => {
						return <MessageImage {...props}
								imageStyle={{
									borderWidth: 2,
									borderColor: '#3cb9fc',
									width: Dimensions.get("window").width - 80,
									height: Dimensions.get("window").width - 180
								}}
							/>
					}}

		            user={{
		              _id: "me"
		            }}
		          />
			</View>
			)
	}

	header_left = () => {
		return (
		  <TouchableOpacity
		    onPress={() => {
		      this.props.navigation.goBack(null);
		    }}
		  >
		    <View style={styles.headerLeftText}>
		      <Icon name="ios-arrow-back" type='ionicon' size={25} color={"#000"} />
		    </View>
		  </TouchableOpacity>
		);
	};

	header_center = () => {
		return (
		  <View style={{ flexDirection: "row", marginLeft: 10 }}>
		    <Avatar source={Images.ic_milahearts} size={"small"} rounded />
		    <View style={{ width: Dimensions.get("window").width - 130, marginLeft: 10, justifyContent: "center" }} >
		      <Text style={styles.headerCenterText}>M.I.L.A</Text>
		    </View>
		  </View>
		);
	};

	header_right = () => {
		return (
		  <TouchableOpacity>
		    <Text style={styles.headerLeftText} />
		  </TouchableOpacity>
		);
	};
}

let styles={
	headerLeftText: {
		marginLeft: 10,
		fontSize: 16,
	},
	headerCenterText: {
		width: Dimensions.get("window").width - 100,
		fontSize: 18,
		fontWeight: "600",
	}
};
