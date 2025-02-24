import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { GoBack } from './GoBackButton';

interface IHeaderParams {
    gotoPrevious?: () => void;
    search?: () => void;
    cartLength?: number;
    gotoCartScreen?: () => void;
}

export const HeadersComponent = ({ gotoPrevious, search, cartLength, gotoCartScreen } : IHeaderParams) => {
    const [searchInput, setSearchInput] = useState("")
    return (
      <View
        style={{
          backgroundColor: "#000",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <GoBack onPress={gotoPrevious}/>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 10,
            height: 38,
            flex: 1,
          }}
        >
          <Pressable style={{ padding: 10 }} onPress={search}>
            <AntDesign name="search1" size={20} color={"blue"} />
          </Pressable>
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="search Items ... "
          />
        </Pressable>
        <Pressable 
          onPress={gotoCartScreen}
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 5
          }}
        >
            <View style={{
              position: "absolute",
              top: -5,
              right: -5,
              zIndex: 1
            }}>
                <Text style={{
                  color: "pink",
                  fontSize: 12
                }}>
                    {cartLength}
                </Text>
            </View>
            <MaterialIcons 
              name="shopping-cart" 
              size={24} 
              color="white" 
              style={{padding: 5}}
            />
        </Pressable>
      </View>
    )
}