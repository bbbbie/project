import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import React from 'react';
import { onboardingDotParams } from '../../TypesCheck/OnboardingTypesCheck';
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

type Props = {}

const OnboardingDots = ({index, x}: onboardingDotParams) => {
    const {width: SCREEN_WIDTH} = useWindowDimensions()
    const animatedDotStyle = useAnimatedStyle(() => {
        const widthAnimation = interpolate (x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH
            ],
            [10, 20, 10],
            Extrapolation.CLAMP
        )
        const opacityAnimation = interpolate (x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH
            ],
            [1, 2, 1],
            Extrapolation.CLAMP
        )
        return {
            width: widthAnimation,
            opacity: opacityAnimation
        }
    })
    const colorAnimation = useAnimatedStyle(() => {
        const background = interpolateColor(x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH
            ],
            ['#8a14d4', '#39d4ba', '#F14546'],
        )
        return {
            backgroundColor: background
        }
    })
    return (
        <Animated.View style={[sty.dots, animatedDotStyle, colorAnimation]} />
    )
}

export default OnboardingDots

const sty = StyleSheet.create({
    dots: {
        height: 10,
        marginHorizontal: 10,
        borderRadius: 5,
    }
})