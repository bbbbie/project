import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { OnboardingItemObj } from "../../TypesCheck/OnboardingTypesCheck";
import LottieView from "lottie-react-native";
type Props = {};
const OnboardingItems = ({ item, index, x }: OnboardingItemObj) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const circleAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [1, 4, 4],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale: scale }],
    };
  });
  const lottieAnimation = useAnimatedStyle(() => {
    const translatey = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [450, -400, 100],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY: translatey }],
    };
  });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 0,
        width: SCREEN_WIDTH,
      }}
    >
      <View style={sty.circularContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              backgroundColor: item.backgroundColor,
              borderRadius: SCREEN_WIDTH / 2,
            },
          ]}
        ></Animated.View>
      </View>
      <Animated.View style={[lottieAnimation]}>
        <LottieView
          source={item.imageUrl}
          autoPlay
          style={{ width: SCREEN_WIDTH * 0.9, height: SCREEN_WIDTH * 0.9 }}
        />
      </Animated.View>
      <Text
        style={{
          fontSize: 40,
          color: item.textColor,
          fontWeight: "bold",
          textAlign: "center",
          marginHorizontal: 10,
          marginBottom: 10,
        }}
      >
        {item.text}
      </Text>
    </View>
  );
};

const sty = StyleSheet.create({
  circularContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnboardingItems;
