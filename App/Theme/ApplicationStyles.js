import Toast from "react-native-root-toast";

export default {
  screen: {
    container: {
      flex: 1,
    },
  },

	toastOptionError : {
		duration: Toast.durations.LONG,
		position: 90,
		shadow: false,
		animation: true,
		hideOnPress: true,
		delay: 0,
		backgroundColor: 'rgba(205,48,48,1)',
	},

	toastOptionSuccess :{
	    duration: Toast.durations.LONG,
	    position: 90,
	    shadow: false,
	    animation: true,
	    hideOnPress: true,
	    delay: 0,
	    backgroundColor: 'rgba(20,128,255,1)',
	},
	textInputStyle:{
		borderColor:'#e6e2e2',
		borderRadius:4,
		borderWidth:1,
		paddingLeft:10,
		backgroundColor:'white',
		fontSize:17,
		color:'#17144e',
		fontWeight:'bold'
	}	
}
