import React from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import OnboardingScreen from "../Screens/OnboardingScreen";
import { NavigatorScreenParams } from "@react-navigation/native";
import TabsNavigator ,{ TabsStackParams } from "./TabsNavigator";
import ProductDetails from "../Screens/ProductDetails";



export type RootStackParams = {
  OnboardingScreen: undefined;
  TabsStack: NavigatorScreenParams<TabsStackParams>;
  Deals: undefined;
  Cart: undefined;
  Profile: undefined;
  ProductDetails: {
    _id: string;
    images: string[];
    name: string;
    price: number;
    oldPrice?: number;
    inStock?: boolean;
    color?: string;
    size?: string;
    description?: string;
    quantity?: number;
  };
};

const RootStack = createNativeStackNavigator<RootStackParams>();
export type RootStackScreenProps<T extends keyof RootStackParams> =
  NativeStackScreenProps<RootStackParams, T>;
const RootNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="TabsStack"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />

      <RootStack.Screen
      name ="ProductDetails"
      component={ProductDetails}
      options={{headerShown: false}}>

      </RootStack.Screen>
    </RootStack.Navigator>
  );
};

export default RootNavigator;
