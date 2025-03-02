import React, { useState, useEffect } from 'react';
import { View, Text, Platform, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabsStackScreenProps } from '../Navigation/TabsNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment'; // Dùng moment để format ngày tháng

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

const OrderHistoryScreen = ({ navigation }: TabsStackScreenProps<'OrderHistory'>) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = 'http://192.168.1.17:9000';

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('userData');
      if (!token || !userDataString) {
        Alert.alert('Error', 'Please log in to view your order history.', [
          { text: 'OK', onPress: () => navigation.navigate('UserLogin') },
        ]);
        return;
      }

      const userData = JSON.parse(userDataString);
      const userId = userData.id;

      const response = await axios.get(`${BACKEND_URL}/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sắp xếp đơn hàng từ mới nhất đến cũ nhất
      const sortedOrders = response.data.sort(
        (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load order history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetail = (order: Order) => {
    // Điều hướng đến màn hình chi tiết đơn hàng và truyền dữ liệu đơn hàng
    navigation.navigate('OrderDetailScreen', { order });
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <LinearGradient colors={['#ffffff', '#f9f9f9']} style={styles.orderItem}>
      <View style={styles.orderDetails}>
        <Text style={styles.orderDate}>
          Ordered on: {moment(item.createdAt).format('MMMM Do YYYY, h:mm a')}
        </Text>
        <Text style={styles.orderStatus}>Status: {item.status}</Text>
        <Text style={styles.orderTotal}>Total: ${item.totalPrice.toFixed(2)}</Text>
        <Text style={styles.orderItemsCount}>Items: {item.items.length}</Text>
      </View>
      <LinearGradient colors={['#34d399', '#22c55e']} style={styles.viewDetailButton}>
        <Pressable onPress={() => handleViewDetail(item)}>
          <Text style={styles.viewDetailButtonText}>View Detail</Text>
        </Pressable>
      </LinearGradient>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.headerGradient}>
        <Text style={styles.headerTitle}>Order History</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Orders Found</Text>
          <Text style={styles.emptySubText}>Place an order to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.orderList}
          showsVerticalScrollIndicator={false}
        />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#1F2937',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptySubText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
  orderList: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  orderDetails: {
    flex: 1,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 5,
  },
  orderItemsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewDetailButton: {
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  viewDetailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderHistoryScreen;