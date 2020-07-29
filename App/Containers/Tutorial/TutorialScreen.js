import React, { Component } from 'react';
import { View, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import { Button } from 'react-native-elements';
import TutorialPage from '../../Components/Tutorial/TutorialPage';
import LinearGradient from 'react-native-linear-gradient'
import NavigationService from 'App/Services/NavigationService'
import { Images } from 'App/Theme'

let dots = Array.from({ length: 5 }, (v, i) => 0);

export default class TutorialScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageIndex: 0,
            nextBtnTitle: "NEXT"
        }
    }

    componentDidMount() {

    }

    onNext = async() => {

        if (this.state.pageIndex < 4) {

            this.setState({
                pageIndex: this.state.pageIndex + 1,
                nextBtnTitle: this.state.pageIndex < 3 ? "NEXT" : "LETS GO!", },
                () => {
                    this.viewpager.scrollBy(1)
                }
            )
        } else {
            this.onSkip()
        }
    };

    onSkip() {
        NavigationService.navigate('Drawer');
    }

    render() {
        return (
            <View style={styles.rootContainer}>
                <Swiper ref={(ref) => this.viewpager = ref} showsPagination={false} pagingEnabled={false}
                    scrollEnabled={false} loop={false}>
                    <View style={{ flex: 1 }}>
                        <TutorialPage
                            title={"Daily Curated\nMatches"}
                            subtitle="A.I. powered for better quality matches"
                            image={Images.image1_tutorial}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TutorialPage
                            title={"Chat Wingman"}
                            subtitle="A little help from M.I.L.A when chat gets a little slow."
                            image={Images.image2_tutorial}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TutorialPage
                            title={"Rate Your Matches"}
                            subtitle="Ratings help validate profiles and create a better community"
                            image={Images.image3_tutorial}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TutorialPage
                            title={"Easy Date\nScheduling"}
                            subtitle="Keeps your dates organized"
                            image={Images.image4_tutorial}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TutorialPage
                            title={"Post Date\nFeedback"}
                            subtitle="Feedback helps us better curate the matches"
                            image={Images.image5_tutorial}
                        />
                    </View>
                </Swiper>
                {
                    this.renderCenterDots()
                }
                <View style={{ marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{width: '70%'}}>
                        <Button title={this.state.nextBtnTitle} titleStyle={{ color: '#fff', fontWeight: 'bold' }}
                            ViewComponent={LinearGradient}
                            linearGradientProps={{
                                colors: ['#4a46d6', '#964cc6'],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            }}
                            buttonStyle={{ borderRadius: 30, width: '100%' }}
                            onPress={this.onNext}
                            containerStyle={{ marginBottom: 0, marginTop: 30 }}
                        />
                        <Button title="SKIP" titleStyle={{ color: '#91919d', fontWeight: 'bold' }}
                            ViewComponent={LinearGradient}
                            linearGradientProps={{
                                colors: ['#fff', '#efefef'],
                                start: { x: 0, y: 0 },
                                end: { x: 0, y: 1 },
                            }}
                            buttonStyle={{ borderRadius: 30, width: '100%' }}
                            onPress={() => this.onSkip()}
                            containerStyle={{ marginBottom: 0, marginTop: 20 }}
                        />
                    </View>

                </View>
            </View>
        )
    }

    renderCenterDots = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {
                    dots.map((v, i) => {
                        let backgroundColor = (i === this.state.pageIndex ? '#3cb9fc' : '#d6d6d6');
                        return (
                            <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: backgroundColor, marginRight: 5 }} />
                        )
                    })
                }
            </View>
        )
    };
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingTop: 25
    },
    wrapper: {

    }
});
