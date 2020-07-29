## Setup instructions

- Install NodeJS on your computer.

- Install yarn on your computer

- Launch yarn command in a terminal opened in the project folder.

git clone https://gitlab.com/fab79sg/matchmde.git

cd matchmde

yarn install

## Troubleshooting

- iOS

You need to customize the node_modules to run correctly.

1.  Go to /node_modules/react-native-linkedin/lib/index.js file

    Convert this code :

    return (React.createElement(TouchableOpacity, { accessibilityComponentType: 'button', accessibilityTraits: ['button'], onPress: this.open },
    React.createElement(Text, null, linkText)));

    to :

    return (React.createElement(TouchableOpacity, { style: {marginTop: 10, marginBottom: 10, width: 250, height: 40}, accessibilityComponentType: 'button', accessibilityTraits: ['button'], onPress: this.open },
    React.createElement(Text, null, linkText)));

2.  Go to /node_modules/react-native-deck-swiper/Swiper.js file

    Convert this code :

    initializePanResponder = () => {
    this.\_panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => false,

    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
    const isVerticalSwipe = Math.sqrt(
    Math.pow(gestureState.dx, 2) < Math.pow(gestureState.dy, 2)
    )
    if (!this.props.verticalSwipe && isVerticalSwipe) {
    return false
    }
    return Math.sqrt(Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)) > 10
    },
    onPanResponderGrant: this.onPanResponderGrant,
    onPanResponderMove: this.onPanResponderMove,
    onPanResponderRelease: this.onPanResponderRelease,
    onPanResponderTerminate: this.onPanResponderRelease
    })

    to :

    initializePanResponder = () => {
    this.\_panResponder = PanResponder.create({
    // onStartShouldSetPanResponder: (event, gestureState) => true,
    // onMoveShouldSetPanResponder: (event, gestureState) => false,

    // onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
    // const isVerticalSwipe = Math.sqrt(
    // Math.pow(gestureState.dx, 2) < Math.pow(gestureState.dy, 2)
    // )
    // if (!this.props.verticalSwipe && isVerticalSwipe) {
    // return false
    // }
    // return Math.sqrt(Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)) > 10
    // },
    // onPanResponderGrant: this.onPanResponderGrant,
    // onPanResponderMove: this.onPanResponderMove,
    // onPanResponderRelease: this.onPanResponderRelease,
    // onPanResponderTerminate: this.onPanResponderRelease
    })

3.  Go to /node_modules/react-native-elements/src/header/Header.js file

    Remove the default status bar height.

4.  Go to /node_modules/@react-native-community/viewpager/ios/ReactNativePageView.m

    Convert this code :

        _reactPageViewController.dataSource = self;

    to:
    \_reactPageViewController.dataSource = nil;

- Android

  We don't need to use the react-native-dynamic-cropper package for Android.
  So please remove the react-native-dynamic-cropper dependency.
