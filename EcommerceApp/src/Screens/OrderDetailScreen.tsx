import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '../Navigation/RootNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

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

interface ProductDetails {
  _id: string;
  name: string;
  images: string[];
  price: number;
  description?: string;
}

interface OrderItemWithProduct extends OrderItem {
  productDetails?: ProductDetails;
}

const OrderDetailScreen = ({ route, navigation }: RootStackScreenProps<'OrderDetailScreen'>) => {
  const { order } = route.params;
  const [orderItemsWithDetails, setOrderItemsWithDetails] = useState<OrderItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = 'http://192.168.1.17:9000';

  // Gọi API để lấy thông tin chi tiết từng sản phẩm từ productId
  const fetchProductDetails = async () => {
    try {
      const productDetailsPromises = order.items.map(async (item) => {
        try {
          const response = await axios.get(`${BACKEND_URL}/product/getProductByID/${item.productId}`);
          // Thay thế URL hình ảnh nếu cần
          const fixedProductDetails = {
            ...response.data,
            images: response.data.images.map((img: string) =>
              img.replace('http://localhost:9000', BACKEND_URL)
            ),
          };
          return { ...item, productDetails: fixedProductDetails };
        } catch (error: any) {
          console.error(
            `Error fetching product ${item.productId}:`,
            error.response?.data || error.message
          );
          return { ...item, productDetails: undefined };
        }
      });

      const itemsWithDetails = await Promise.all(productDetailsPromises);
      setOrderItemsWithDetails(itemsWithDetails);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();

   
    navigation.setOptions({
  
      headerShown: false, 
    });

  
    
  }, [navigation]);

  const renderOrderItem = ({ item }: { item: OrderItemWithProduct }) => {
   
    const productName = item.productDetails?.name || 'Unknown Product';
    const imageUri =
      item.productDetails?.images?.[0] || 'https://via.placeholder.com/100';

    return (
      <LinearGradient colors={['#ffffff', '#f9f9f9']} style={styles.orderItem}>
        <Image
          source={{ uri: imageUri }}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{productName}</Text>
          {item.selectedStorage && (
            <Text style={styles.itemOption}>Storage: {item.selectedStorage}</Text>
          )}
          {item.selectedColor && (
            <Text style={styles.itemOption}>Color: {item.selectedColor}</Text>
          )}
          <Text style={styles.itemPrice}>Price: ${item.price}</Text>
          <Text style={styles.itemPrice}>Quantity: {item.quantity}</Text>
          <Text style={styles.itemTotal}>
            Total: ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <Text style={styles.infoText}>Order ID: {order._id}</Text>
          <Text style={styles.infoText}>
            Ordered on: {moment(order.createdAt).format('MMMM Do YYYY, h:mm a')}
          </Text>
          <Text style={styles.infoText}>Status: {order.status}</Text>
          <Text style={styles.infoText}>Payment Method: {order.paymentMethod}</Text>
          <Text style={styles.infoText}>Shipping Address: {order.shippingAddress}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items in Order</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading products...</Text>
          ) : orderItemsWithDetails.length === 0 ? (
            <Text style={styles.loadingText}>No items found in this order.</Text>
          ) : (
            <FlatList
              data={orderItemsWithDetails}
              renderItem={renderOrderItem}
              keyExtractor={(item, index) => `${item.productId}-${index}`}
              scrollEnabled={false}
            />
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Items:</Text>
            <Text style={styles.summaryValue}>{order.items.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Price:</Text>
            <Text style={styles.summaryValue}>${order.totalPrice.toFixed(2)}</Text>
          </View>
        </View>
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
    paddingTop: Platform.OS === 'android' ? 40 : 0,
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40, // Để cân đối với nút back
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
  infoText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 20,
  },
  orderItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
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
    marginBottom: 2,
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
});

export default OrderDetailScreen;