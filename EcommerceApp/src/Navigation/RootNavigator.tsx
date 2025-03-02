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
import EditPersonalInfo from "../Screens/EditPersonalInfo";
import EditAddress from "../Screens/EditAddress";
import CheckoutScreen from "../Screens/CheckoutScreen";
import { ProductListParams } from "../TypesCheck/HomeProps";
import AllProductsScreen from "../Screens/AllProductsScreen";
import OrderDetailScreen from "../Screens/OrderDetailScreen";

// Định nghĩa interface cho Order và OrderItem
interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  selectedStorage?: string | null;
  selectedColor?: string | null;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: string;
  status: string;
  createdAt: string;
}

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
    color?: string[] | undefined;
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
  EditPersonalInfo: { userData: any };
  EditAddress: { userData: any };
  AllProducts: { products: ProductListParams[] };
  CheckoutScreen: undefined;
  OrderDetailScreen: { order: Order }; // Định nghĩa kiểu cho OrderDetailScreen
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
      <RootStack.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="OrderDetailScreen"
        component={OrderDetailScreen}
        options={{ title: 'Order Details' }}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;