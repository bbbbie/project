import React from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { NavigatorScreenParams } from "@react-navigation/native";
import OnboardingScreen from "../Screens/OnboardingScreen";
import TabsNavigator, { TabsStackParams } from "./TabsNavigator";
import ProductDetails from "../Screens/ProductDetails";
import UserLogin from "../Screens/UserLogin";
import AdminPanel from "../Screens/AdminPanel";
import EditPersonalInfo from "../Screens/EditPersonalInfo"; // Thêm
import EditAddress from "../Screens/EditAddress"; // Thêm
import { ProductListParams } from "../TypesCheck/HomeProps";
import AllProductsScreen from "../Screens/AllProductsScreen";

export type RootStackParams = {
  OnboardingScreen: undefined;
  TabsStack: NavigatorScreenParams<TabsStackParams> | undefined;
  Deals: undefined;
  Profile: undefined;
  ProductDetails: {
    _id: string;
    images: string[];
    name: string;
    price: number;
    oldPrice?: number;
    inStock?: boolean;
    color?: string[] | undefined; // Thay đổi thành string[]
    storage?: string[] | undefined;
    description?: string;
    quantity: number;
  };
  cart: {
    _id: string;
    images: string[];
    name: string;
    price: number;
    color?: string;
    size?: string;
    quantity?: number;
  };
  UserLogin: undefined;
  AdminPanel: undefined;
  EditPersonalInfo: { userData: any }; // Thêm
  EditAddress: { userData: any }; // Thêm
  AllProducts: { products: ProductListParams[] }; 
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
        name="ProductDetails"
        component={ProductDetails}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="UserLogin"
        component={UserLogin}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="AdminPanel"
        component={AdminPanel}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="EditPersonalInfo"
        component={EditPersonalInfo}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="EditAddress"
        component={EditAddress}
        options={{ headerShown: false }}
      />
       <RootStack.Screen
        name="AllProducts"
        component={AllProductsScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>

  );
};

export default RootNavigator;