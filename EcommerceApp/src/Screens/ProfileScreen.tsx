import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabsStackScreenProps } from '../Navigation/TabsNavigator';
import { LinearGradient } from 'expo-linear-gradient'; // Thêm lại LinearGradient
import * as ImagePicker from 'expo-image-picker'; // Thêm lại expo-image-picker
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/CartReducer';

interface UserData {
  id: string;
  firstName: string;
  email: string;
  mobileNo: string;
  role: string;
  avatar?: string | null;
  address?: string | null;
}

const ProfileScreen = ({ navigation }: TabsStackScreenProps<'Profile'>) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [avatar, setAvatar] = useState<string>('https://via.placeholder.com/150');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const BACKEND_URL = 'http://192.168.1.17:9000/users';

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('userData');

      if (!token || !userDataString) {
        setUserData(null);
        return;
      }

      const user: UserData = JSON.parse(userDataString);
      setUserData(user);
      const correctedAvatar =
        user.avatar?.replace('http://localhost:9000', 'http://192.168.1.17:9000') ||
        'https://via.placeholder.com/150';
      setAvatar(correctedAvatar);

      const response = await axios.get(`${BACKEND_URL}/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = response.data;
      setUserData(updatedUser);
      setAvatar(
        updatedUser.avatar?.replace('http://localhost:9000', 'http://192.168.1.17:9000') ||
          'https://via.placeholder.com/150'
      );
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to change your avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token || !userData?.id) {
          Alert.alert('Error', 'You must be logged in to update your avatar.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('avatar', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any);

        const response = await axios.put(`${BACKEND_URL}/user/${userData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const updatedUser = response.data.user; // Giả định backend trả về response.data.user như đoạn code 1
        const correctedAvatar =
          updatedUser.avatar?.replace('http://localhost:9000', 'http://192.168.1.17:9000') ||
          'https://via.placeholder.com/150';
        setUserData(updatedUser);
        setAvatar(correctedAvatar);
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        Alert.alert('Success', 'Avatar updated successfully.');
      } catch (error) {
        console.error('Error updating avatar:', error);
        Alert.alert('Error', 'Failed to update avatar.');
        setAvatar(userData?.avatar || 'https://via.placeholder.com/150');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      dispatch(clearCart());
      Alert.alert('Success', 'You have been logged out.');
      navigation.navigate('UserLogin');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('UserLogin');
  };

  const handleAdminPanel = () => navigation.navigate('AdminPanel');
  const handleEditPersonalInfo = () => navigation.navigate('EditPersonalInfo', { userData });
  const handleEditAddress = () => navigation.navigate('EditAddress', { userData });
  const handleWishlist = () => navigation.navigate('WishlistScreen');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.headerGradient}>
        <Text style={styles.headerTitle}>Your Profile</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {userData ? (
          <>
            <View style={styles.profileCard}>
              <Pressable onPress={pickImage} disabled={loading} style={styles.avatarContainer}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <Text style={styles.changeAvatarText}>
                  {loading ? 'Uploading...' : 'Change Avatar'}
                </Text>
              </Pressable>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userData.firstName || 'User'}</Text>
                <Text style={styles.userEmail}>{userData.email || 'Loading...'}</Text>
              </View>
            </View>
            <View style={styles.optionsContainer}>
              <Pressable style={styles.optionCard} onPress={handleEditPersonalInfo}>
                <Text style={styles.optionText}>Edit Personal Info</Text>
              </Pressable>
              <Pressable style={styles.optionCard} onPress={handleEditAddress}>
                <Text style={styles.optionText}>Edit Shipping Address</Text>
              </Pressable>
              <Pressable style={styles.optionCard} onPress={handleWishlist}>
                <Text style={styles.optionText}>Wishlist</Text>
              </Pressable>
              {userData.role === 'admin' && (
                <Pressable style={styles.optionCard} onPress={handleAdminPanel}>
                  <Text style={styles.optionText}>Admin Panel</Text>
                </Pressable>
              )}
              <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.logoutButton}>
                <Pressable onPress={handleLogout}>
                  <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>
              </LinearGradient>
            </View>
          </>
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.loginMessage}>You are not logged in.</Text>
            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
          </View>
        )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
  },
  changeAvatarText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ff6f61',
    marginBottom: 15,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 5,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  logoutButton: {
    borderRadius: 15,
    padding: 18,
    elevation: 2,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginMessage: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#4facfe',
    borderRadius: 15,
    padding: 18,
    elevation: 2,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default ProfileScreen;