import { View, Text, Platform } from 'react-native';
import React, { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadersComponent } from '../Components/HeaderComponent/HeaderComponent';

import { useSelector } from 'react-redux';
import { CartState } from '../TypesCheck/productCartTypes';
import { TabsStackScreenProps } from '../Navigation/TabsNavigator';
import DisplayMessage from '../Components/HeaderComponent/DisplayMessage';

const CartScreen = ({ navigation, route }: TabsStackScreenProps<'Cart'>) => {
  // Hàm điều hướng đến giỏ hàng (không cần thiết trong CartScreen, giữ nguyên để tương thích)
  const gotoCartScreen = () => {
    if (cart.length === 0) {
      setMessage('Cart is empty. Please add products to cart.');
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
      }, 3000);
    } else {
      navigation.navigate('Home');
    }
  };

  // Hàm quay lại màn hình trước hoặc về Home
  const gotoPreviousScreen = () => {
    if (navigation.canGoBack()) {
      console.log('Chuyển về trang trước.');
      navigation.goBack();
    } else {
      console.log('Không thể quay lại, chuyển về trang Home.');
      navigation.navigate('Home');
    }
  };

  // Lấy giỏ hàng từ Redux
  const cart = useSelector((state: CartState) => state.cart.cart);
  const [message, setMessage] = useState('');
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 0 : 0, flex: 1, backgroundColor: 'black' }}>
      {/* Hiển thị thông báo nếu có */}
      {displayMessage && <DisplayMessage message={message} visible={() => setDisplayMessage(!displayMessage)} />}

      {/* Header component */}
      <HeadersComponent
        gotoCartScreen={gotoCartScreen}
        cartLength={cart.length}
        gotoPrevious={gotoPreviousScreen}
      />

      {/* Nội dung giỏ hàng (chưa có sản phẩm, bạn có thể thêm danh sách sản phẩm ở đây) */}
      {cart.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18 }}>Your cart is empty. Add some products!</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 18 }}>Cart items will be displayed here.</Text>
          {/* Thêm logic hiển thị danh sách sản phẩm từ cart ở đây */}
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;