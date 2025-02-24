import { View, Text, SafeAreaView, Platform } from 'react-native'
import React from 'react'
import { HeadersComponent } from '../Components/HeaderComponent/HeaderComponent'

type Props = {}

const CartScreen = (props: Props) => {
  return (
    <SafeAreaView style={{paddingTop: Platform.OS === 'android' ? 40:0, flex: 1, backgroundColor: "black"}}>
      <HeadersComponent/>
    </SafeAreaView>
  )
}

export default CartScreen