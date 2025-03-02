import { View, Text, Platform, FlatList, Image, Pressable, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { CartState } from '../TypesCheck/productCartTypes';
import { TabsStackScreenProps } from '../Navigation/TabsNavigator';
import DisplayMessage from '../Components/HeaderComponent/DisplayMessage';
import { ProductListParams } from '../TypesCheck/HomeProps';
import { increaseQuantity, decreaseQuantity, removeFromCart, clearCart } from '../redux/CartReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const CartScreen = ({ navigation }: TabsStackScreenProps<'Cart'>) => {
  const cart = useSelector((state: CartState) => state.cart.cart || []);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleClearCart = () => {
    dispatch(clearCart());
    setMessage('Cart cleared successfully.');
    setDisplayMessage(true);
    setTimeout(() => setDisplayMessage(false), 3000);
  };

  const handleRemoveItem = (item: ProductListParams) => {
    dispatch(removeFromCart(item)); // Truyền toàn bộ item
    setMessage('Item removed from cart.');
    setDisplayMessage(true);
    setTimeout(() => setDisplayMessage(false), 3000);
  };

  const handleIncreaseQuantity = (item: ProductListParams) => {
    dispatch(increaseQuantity(item));
  };

  const handleDecreaseQuantity = (item: ProductListParams) => {
    dispatch(decreaseQuantity(item));
  };

  const handleProceedToBuy = async () => {
    if (cart.length === 0) {
      setMessage('Cart is empty. Please add products to cart.');
      setDisplayMessage(true);
      setTimeout(() => setDisplayMessage(false), 3000);
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.navigate('CheckoutScreen'); // Chuyển sang CheckoutScreen
      } else {
        navigation.navigate('UserLogin');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const renderCartItem = ({ item }: { item: ProductListParams }) => (
    <LinearGradient
      colors={['#ffffff', '#f9f9f9']}
      style={styles.cartItem}
    >
      <Image
        source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/100' }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.selectedStorage && (
          <Text style={styles.itemOption}>Storage: {item.selectedStorage}</Text>
        )}
        {item.selectedColor && (
          <Text style={styles.itemOption}>Color: {item.selectedColor}</Text>
        )}
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
        <LinearGradient
          colors={['#ef4444', '#dc2626']}
          style={styles.removeButton}
        >
          <Pressable onPress={() => handleRemoveItem(item)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      {displayMessage && (
        <DisplayMessage
          message={message}
          visible={() => setDisplayMessage(!displayMessage)}
        />
      )}

      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Cart</Text>
      </LinearGradient>

      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your Cart is Empty</Text>
          <Text style={styles.emptyCartSubText}>Add some products to get started!</Text>
        </View>
      ) : (
        <View style={styles.cartContent}>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => 
              `${item._id}-${item.selectedStorage || ''}-${item.selectedColor || ''}`
            }
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          <LinearGradient
            colors={['#ffffff', '#f5f5f5']}
            style={styles.summaryContainer}
          >
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Total Items:</Text>
              <Text style={styles.summaryValue}>{totalItems}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Total Price:</Text>
              <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.buttonRow}>
              <LinearGradient
                colors={['#f87171', '#ef4444']}
                style={styles.clearButton}
              >
                <Pressable onPress={handleClearCart}>
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </Pressable>
              </LinearGradient>
              <LinearGradient
                colors={['#34d399', '#22c55e']}
                style={styles.proceedButton}
              >
                <Pressable onPress={handleProceedToBuy}>
                  <Text style={styles.proceedButtonText}>Proceed to Buy</Text>
                </Pressable>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    color: '#1F2937',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptyCartSubText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
  cartContent: {
    flex: 1,
  },
  cartList: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 200,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  itemOption: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 30,
    padding: 6,
  },
  quantityButton: {
    backgroundColor: '#4facfe',
    borderRadius: 15,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
    textAlign: 'center',
    position: 'relative',
    top: Platform.OS === 'ios' ? 0 : 0,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 15,
    color: '#1F2937',
  },
  removeButton: {
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22c55e',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  clearButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  proceedButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CartScreen;