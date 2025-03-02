import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; // Thêm useDispatch để xóa giỏ hàng
import { CartState, ProductListParams } from '../TypesCheck/productCartTypes';
import { RootStackScreenProps } from '../Navigation/RootNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { clearCart } from '../redux/CartReducer';


interface UserData {
  id: string;
  firstName: string;
  email: string;
  mobileNo: string;
  address?: string | null;
}

const CheckoutScreen = ({ navigation }: RootStackScreenProps<'CheckoutScreen'>) => {
  const dispatch = useDispatch(); // Thêm dispatch để gọi action Redux
  const cart = useSelector((state: CartState) => state.cart.cart || []);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const BACKEND_URL = 'http://192.168.1.17:9000';

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('userData');
      if (token && userDataString) {
        const user: UserData = JSON.parse(userDataString);
        setUserData(user);
      } else {
        Alert.alert('Error', 'Please log in to proceed.', [
          { text: 'OK', onPress: () => navigation.navigate('UserLogin') },
        ]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data.');
    }
  };

  // Sử dụng useFocusEffect để tải lại dữ liệu user mỗi khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [navigation])
  );

  const renderCartItem = ({ item }: { item: ProductListParams }) => (
    <LinearGradient colors={['#ffffff', '#f9f9f9']} style={styles.cartItem}>
      <Image
        source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/100' }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.selectedStorage && <Text style={styles.itemOption}>Storage: {item.selectedStorage}</Text>}
        {item.selectedColor && <Text style={styles.itemOption}>Color: {item.selectedColor}</Text>}
        <Text style={styles.itemPrice}>${item.price} x {item.quantity}</Text>
        <Text style={styles.itemTotal}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
    </LinearGradient>
  );

  const handlePlaceOrder = async () => {
    // Kiểm tra nếu không có userData hoặc địa chỉ
    if (!userData || !userData.address) {
      Alert.alert('Error', 'Please provide a shipping address in your profile.', [
        { text: 'Edit Address', onPress: () => navigation.navigate('EditAddress', { userData }) },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    // Kiểm tra nếu giỏ hàng trống
    if (cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty. Add items to proceed.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.', [
          { text: 'OK', onPress: () => navigation.navigate('UserLogin') },
        ]);
        return;
      }

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        userId: userData.id,
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          selectedStorage: item.selectedStorage || undefined,
          selectedColor: item.selectedColor || undefined,
        })),
        totalPrice,
        paymentMethod,
        shippingAddress: userData.address,
      };

      // Gửi yêu cầu đặt hàng đến backend
      const response = await axios.post(`${BACKEND_URL}/orders/create`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Nếu đặt hàng thành công
      if (response.status === 201) {
        Alert.alert('Success', 'Order placed successfully!', [
          { text: 'OK', onPress: () => {
            dispatch(clearCart()); 
            navigation.navigate('TabsStack', { screen: 'Home' });
          }},
        ]);
      }
    } catch (error: any) {
      // Xử lý lỗi chi tiết từ backend
      console.error('Error placing order:', error.response?.data || error.message);
      if (error.response) {
        const { data } = error.response;
        if (data.error === 'Invalid token.') {
          Alert.alert('Error', 'Session expired. Please log in again.', [
            { text: 'OK', onPress: () => navigation.navigate('UserLogin') },
          ]);
        } else if (data.error.includes('Product with ID')) {
          Alert.alert('Error', 'One or more products in your cart are unavailable.');
        } else if (data.error.includes('Not enough stock')) {
          Alert.alert('Error', 'One or more products are out of stock.');
        } else if (data.error === 'All fields are required') {
          Alert.alert('Error', 'Missing required fields. Please check your information.');
        } else {
          Alert.alert('Error', data.error || 'Failed to place order. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <Text style={styles.userText}>Name: {userData?.firstName || 'Loading...'}</Text>
          <Text style={styles.userText}>Email: {userData?.email || 'Loading...'}</Text>
          <Text style={styles.userText}>Phone: {userData?.mobileNo || 'N/A'}</Text>
          <Text style={styles.userText}>Address: {userData?.address || 'Not provided'}</Text>
          <Pressable
            style={styles.editButton}
            onPress={() => navigation.navigate('EditPersonalInfo', { userData })}
          >
            <Text style={styles.editButtonText}>Edit Personal Info</Text>
          </Pressable>
          <Pressable
            style={styles.editButton}
            onPress={() => navigation.navigate('EditAddress', { userData })}
          >
            <Text style={styles.editButtonText}>Edit Address</Text>
          </Pressable>
        </View>

        {/* Cart Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) =>
              `${item._id}-${item.selectedStorage || ''}-${item.selectedColor || ''}`
            }
            scrollEnabled={false}
          />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Items:</Text>
            <Text style={styles.summaryValue}>{totalItems}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Price:</Text>
            <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Pressable
            style={[styles.paymentOption, paymentMethod === 'COD' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('COD')}
          >
            <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
          </Pressable>
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonTitle}>More Payment Options</Text>
            <View style={styles.comingSoonOptions}>
              <View style={[styles.paymentOption, styles.disabledOption]}>
                <Text style={styles.disabledText}>Credit/Debit Card</Text>
                <Text style={styles.comingSoonBadge}>Coming Soon</Text>
              </View>
              <View style={[styles.paymentOption, styles.disabledOption]}>
                <Text style={styles.disabledText}>PayPal</Text>
                <Text style={styles.comingSoonBadge}>Coming Soon</Text>
              </View>
              <View style={[styles.paymentOption, styles.disabledOption]}>
                <Text style={styles.disabledText}>Mobile Payment</Text>
                <Text style={styles.comingSoonBadge}>Coming Soon</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Place Order Button */}
        <LinearGradient colors={['#34d399', '#22c55e']} style={styles.placeOrderButton}>
          <Pressable onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>Place Order</Text>
          </Pressable>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginLeft: 40,
    marginRight: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  userText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#ff6f61',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
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
    fontSize: 14,
    color: '#6B7280',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22c55e',
  },
  paymentOption: {
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  placeOrderButton: {
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  selectedPayment: {
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  comingSoonContainer: {
    marginTop: 15,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },
  comingSoonOptions: {
    gap: 10,
  },
  disabledOption: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.7,
  },
  disabledText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  comingSoonBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#6b7280',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
});

export default CheckoutScreen;