import React, {Component} from 'react'
import {View, Text, FlatList} from 'react-native'
import { ListItem } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { thousands_separators } from 'App/Services/HelperServices'
import { connect } from 'react-redux'
import { userService } from 'App/Services/UserService'
class ActivityView extends Component{

	constructor(props){
		super(props);
		this.state={
			history:[],
			isRefreshing:false,
			page:1
		}
	}

	componentDidMount(){
		this.loadData()
	}

	loadData = () =>{
		const { history, page } = this.state;
		this.setState({ isRefreshing: true });

		userService.get_request(this.props.userToken.access_token,`/transfers`)
			.then(res =>{
				const data = res.data;
				this.setState({
		          history: page === 1 ? data.data : [...history, ...data.data],
		          isRefreshing: false
		        });
			})
			.catch(err => {
				console.log("transfers error -> ", err);
				this.setState({
		          isRefreshing: false
		        });
			});
	};

	keyExtractor = (item, index) => index.toString();

	renderItem = ({ item }) => {
		if(item.from.id===this.props.profile.id){
			return(
				<ListItem
				    title={item.to.name} titleStyle={{fontSize:17, color:'#17144e', fontWeight:'bold'}}
				    subtitle='Sent' subtitleStyle={{fontSize:13, color:'#91919d'}}
				    leftAvatar={{ source: { uri: item.to.picture } }}
				    rightTitle={`-$${item.amount}`} rightTitleStyle={{ fontSize:17, color:'#17144e', fontWeight:'bold'}}
				    rightSubtitle={<View style={{width:10, height:10, borderRadius:5, backgroundColor:'green'}}/>}
				    bottomDivider
				  />
			)
		}
		return(
			<ListItem
			    title={item.from.name} titleStyle={{fontSize:17, color:'#17144e', fontWeight:'bold'}}
			    subtitle='Received' subtitleStyle={{fontSize:13, color:'#91919d'}}
			    leftAvatar={{ source: { uri: item.to.picture } }}
			    rightTitle={`+$${item.amount}`} rightTitleStyle={{ fontSize:17, color:'#17144e', fontWeight:'bold'}}
			    rightSubtitle={<View style={{width:10, height:10, borderRadius:5, backgroundColor:item.reated_at===item.updated_at?'red':'green'}}/>}

			    bottomDivider
			  />
		)
	};

	render(){
		return(
			<View style={{flex:1}}>
				<LinearGradient style={styles.balanceContainer} colors={['#4a46d6', '#964cc6']}>
					<Text style={styles.balanceLabel}>{`$${thousands_separators(this.props.profile.balance)}`}</Text>
					<Text style={styles.balanceTitle}>Match $ Balance</Text>
				</LinearGradient>
				<FlatList
					data={this.state.history}
					renderItem={this.renderItem}
					keyExtractor={this.keyExtractor}
				/>
			</View>
			)
	}
}

let styles={
	balanceContainer:{
		margin:14,
		borderRadius:7,
		alignItems:'center',
		padding:28
	},
	balanceLabel:{
		fontSize:47,
		color:'white',
		fontWeight:'bold'
	},
	balanceTitle:{
		fontSize:17,
		color:'white',
	}
};

const mapStateToProps = (state) =>{
	return{
    	userToken:state.startup.userToken,
    	profile:state.user.profile
	}
};

const mapDispatchToProps = dispatch=>{
	return{
		updateProfilePhotos:(photo)=>dispatch(UserActions.fetchUserSuccess(photo))
	}
};

export default connect(mapStateToProps)(ActivityView)

const users = [
	{
		picture:'https://randomuser.me/api/portraits/women/90.jpg',
		status:'online',
		name:'Test Name1',
		subtitle:'Send you a gift',
		gift_history:'+$100.00'
	},
	{
		picture:'https://randomuser.me/api/portraits/women/19.jpg',
		status:'online',
		name:'Test Name2',
		subtitle:'Send you a gift',
		gift_history:'-$67.00'
	},
	{
		picture:'https://randomuser.me/api/portraits/women/59.jpg',
		status:'online',
		name:'Test Name3',
		gift_history:'-$34.00'
	},
	{
		picture:'https://randomuser.me/api/portraits/women/68.jpg',
		status:'offline',
		name:'Test Name4',
		gift_history:'-$34.00'
	},
	{
		picture:'https://randomuser.me/api/portraits/women/79.jpg',
		status:'offline',
		name:'Test Name5',
		gift_history:'+$250.00'
	},
];
