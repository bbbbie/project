// Screens/CartScreen.tsx
import { View, Text, Platform, FlatList, Image, Pressable, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadersComponent } from '../Components/HeaderComponent/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { CartState } from '../TypesCheck/productCartTypes';
import { TabsStackScreenProps } from '../Navigation/TabsNavigator';
import DisplayMessage from '../Components/HeaderComponent/DisplayMessage';
import { ProductListParams } from '../TypesCheck/HomeProps';
import { increaseQuantity, decreaseQuantity, removeFromCart, clearCart } from '../redux/CartReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation, route }: TabsStackScreenProps<'Cart'>) => {
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
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);

  // Tính tổng số lượng và tổng giá tiền
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Xóa toàn bộ giỏ hàng
  const handleClearCart = () => {
    dispatch(clearCart());
    setMessage('Cart cleared successfully.');
    setDisplayMessage(true);
    setTimeout(() => {
      setDisplayMessage(false);
    }, 3000);
  };

  // Xóa một sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
    setMessage('Item removed from cart.');
    setDisplayMessage(true);
    setTimeout(() => {
      setDisplayMessage(false);
    }, 3000);
  };

  // Tăng số lượng sản phẩm
  const handleIncreaseQuantity = (item: ProductListParams) => {
    dispatch(increaseQuantity(item));
  };

  // Giảm số lượng sản phẩm
  const handleDecreaseQuantity = (item: ProductListParams) => {
    dispatch(decreaseQuantity(item));
  };

  // Xử lý nút "Proceed to Buy"
 // Screens/CartScreen.tsx (chỉ sửa handleProceedToBuy)
const handleProceedToBuy = async () => {
  if (cart.length === 0) {
    setMessage('Cart is empty. Please add products to cart.');
    setDisplayMessage(true);
    setTimeout(() => {
      setDisplayMessage(false);
    }, 3000);
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Token:', token); // Debug
    if (token) {
      console.log('User is logged in. Proceed to buy logic can be added here.');
    } else {
      console.log('Navigating to UserLogin');
      navigation.navigate('UserLogin'); // Không cần params
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};

  // Render mỗi item trong giỏ hàng
  const renderCartItem = ({ item }: { item: ProductListParams }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/100' }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price} x {item.quantity}</Text>
        <Text style={styles.itemTotal}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.quantityControls}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleDecreaseQuantity(item)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleIncreaseQuantity(item)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item._id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Hiển thị thông báo nếu có */}
      {displayMessage && (
        <DisplayMessage
          message={message}
          visible={() => setDisplayMessage(!displayMessage)}
        />
      )}

      {/* Header component */}
      <HeadersComponent
        gotoCartScreen={gotoCartScreen}
        cartLength={cart.length}
        gotoPrevious={gotoPreviousScreen}
      />

      {/* Nội dung giỏ hàng */}
      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty. Add some products!</Text>
        </View>
      ) : (
        <View style={styles.cartContent}>
          {/* Danh sách sản phẩm trong giỏ hàng */}
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Tổng kết giỏ hàng */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Total Items:</Text>
              <Text style={styles.summaryValue}>{totalItems}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Total Price:</Text>
              <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <Pressable style={styles.clearButton} onPress={handleClearCart}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </Pressable>
            <Pressable style={styles.proceedButton} onPress={handleProceedToBuy}>
              <Text style={styles.proceedButtonText}>Proceed to Buy</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '500',
  },
  cartContent: {
    flex: 1,
  },
  cartList: {
    paddingHorizontal: 15,
    paddingBottom: 220, // Tăng padding để chứa nút Proceed to Buy
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ecc71',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#2ecc71', // Green button for Proceed to Buy
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;