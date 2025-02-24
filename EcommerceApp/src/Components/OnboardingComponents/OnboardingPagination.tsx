import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { OnboardingPaginationParams } from '../../TypesCheck/OnboardingTypesCheck';
import OnboardingDots from './OnboardingDots';


type Props = {}

const OnboardingPagination = ({item, x}: OnboardingPaginationParams) => {
    return (
        <View style={sty.paginationContainer}>
            {item.map((_, index) => {
                return <OnboardingDots key={index} index={index} x={x} />
            })}
        </View>
    )
}

export default OnboardingPagination

const sty = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40
    }
})
