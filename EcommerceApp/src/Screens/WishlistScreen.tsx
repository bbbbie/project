import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, Image, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RootStackScreenProps } from '../Navigation/RootNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import { ProductListParams } from '../TypesCheck/HomeProps';

const WishlistScreen = ({ navigation }: RootStackScreenProps<'WishlistScreen'>) => {
  // Allow wishlist to be null initially
  const [wishlist, setWishlist] = useState<ProductListParams[] | null>(null);
  const BASE_URL = 'http://192.168.1.17:9000';

  const fetchWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('userData');

      if (!token || !userDataString) {
        Alert.alert('Error', 'Please log in to view your wishlist.');
        navigation.navigate('UserLogin');
        setWishlist(null); // Set wishlist to null if not authenticated
        return;
      }

      const user = JSON.parse(userDataString);
      const response = await axios.get(`${BASE_URL}/users/user/${user.id}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle wishlist data
      if (response.data && Array.isArray(response.data.wishlist)) {
        const fixedWishlist = response.data.wishlist.map((item: ProductListParams) => ({
          ...item,
          images: item.images.map((img: string) => img.replace('http://localhost:9000', BASE_URL)),
        }));
        setWishlist(fixedWishlist);
      } else {
        console.warn('Wishlist data is not an array or is missing:', response.data);
        setWishlist(null); // Set to null if data is invalid
      }
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);

      // Handle 401 Unauthorized specifically
      if (error.response && error.response.status === 401) {
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
        await AsyncStorage.removeItem('token'); // Optionally clear invalid token
        navigation.navigate('UserLogin');
      } else {
        Alert.alert('Error', 'Failed to load wishlist.');
      }
      setWishlist(null); // Set to null on error
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const renderWishlistItem = ({ item }: { item: ProductListParams }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ProductDetails', item)}
    >
      <Image
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/100' }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
      </LinearGradient>
      {wishlist === null ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Unable to load wishlist.</Text>
        </View>
      ) : wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your wishlist is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

// Styles remain unchanged
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
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
  },
  listContent: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
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
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ff6f61',
  },
});

export default WishlistScreen;