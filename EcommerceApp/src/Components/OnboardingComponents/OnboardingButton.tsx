import {View, Text, StyleSheet, useWindowDimensions, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, withSpring, withTiming} from 'react-native-reanimated';
import { onboardingButtonParams } from './../../TypesCheck/OnboardingTypesCheck';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../Navigation/RootNavigator';

type Props = {}

const OnboardingButton = ({ flatListIndex, flatListRef, itemLength, x}: onboardingButtonParams) => {
    const {width: SCREEN_WIDTH} = useWindowDimensions()

    const buttonAnimation = useAnimatedStyle(() => {
        return {
            width:
                flatListIndex.value === itemLength - 1?
                    withSpring(140) : withSpring(60),
                height: 60,
        }
    })
    const arrowAnimation = useAnimatedStyle(() => {
        return{
            opacity: flatListIndex.value === itemLength - 1?
                withTiming(0) : withTiming(1),
            width: 30,
            height: 30,
            transform: [
                {
                    translateX: flatListIndex.value === itemLength - 1?
                        withTiming(0) : withTiming(0),
                }
            ]
        }
    })
    const textAnimation = useAnimatedStyle(() => {
        return {
            opacity: flatListIndex.value === itemLength - 1?
                withTiming(1) : withTiming(0),
            transform: [
                {
                    translateX: flatListIndex.value === itemLength - 1?
                        withTiming(0) : withTiming(100),
                }
            ]
        }
    })
    const colorAnimation = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(x.value,
            [
                0, SCREEN_WIDTH, SCREEN_WIDTH * 2
            ],
            ["#c80dfc","#250dfc","#251357"],
        )
        return {
            backgroundColor: backgroundColor
        }
    })
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

    return (
        <TouchableWithoutFeedback onPress={() => {
            if(flatListIndex.value === itemLength - 1){
                flatListRef.current?.scrollToIndex({index: flatListIndex.value + 1});
            } else {
                //alert("Click here to Start shopping online!!")
                navigation.replace("TabsStack", {"screen": "Home"})
            }
        }}
        >
            <Animated.View 
                style={[sty.container, buttonAnimation, colorAnimation]}
            >
                <Animated.Text style={[sty.textButton, textAnimation]}>
                    Get Started
                </Animated.Text>
                <Animated.Image
                    source={require('../../../assets/onboarding/right-arrow.png')}
                    style={[sty.arrow, arrowAnimation]}
                />
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

export default OnboardingButton

const sty = StyleSheet.create({
    container: {
        backgroundColor: "#c822fc",
        padding: 10,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    arrow: {
        position: 'absolute',
    },
    textButton: {
        color: '#fff',
        fontSize: 20,
        position: 'absolute',
    }
})