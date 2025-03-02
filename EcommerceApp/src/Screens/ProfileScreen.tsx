import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Alert, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabsStackScreenProps } from '../Navigation/TabsNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

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
  const [avatar, setAvatar] = useState<string>('https://via.placeholder.com/150'); // Giá trị mặc định ban đầu
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = 'http://192.168.1.17:9000/users';

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('userData');
      console.log('Token:', token);
      console.log('UserDataString:', userDataString);

      if (token && userDataString) {
        const user: UserData = JSON.parse(userDataString);
        console.log('User ID:', user.id);
        setUserData(user);
        const correctedAvatar = user.avatar?.replace('http://localhost:9000', 'http://192.168.1.17:9000') || 'https://via.placeholder.com/150';
        setAvatar(correctedAvatar);

        const response = await axios.get(`${BACKEND_URL}/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedUser = response.data;
        console.log('Fetched user data:', updatedUser);
        const updatedAvatar = updatedUser.avatar?.replace('http://localhost:9000', 'http://192.168.1.17:9000') || 'https://via.placeholder.com/150';
        setUserData(updatedUser);
        setAvatar(updatedAvatar);
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      } else {
        Alert.alert('Error', 'No user data found. Please log in again.');
        navigation.navigate('UserLogin');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Chỉ hiển thị lỗi nếu không có userData
      if (!userData) {
        Alert.alert('Error', 'Failed to load profile.');
      }
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
        const formData = new FormData();
        formData.append('avatar', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any);

        const response = await axios.put(
          `${BACKEND_URL}/user/${userData?.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const updatedUser = response.data.user;
        console.log('Updated user after upload:', updatedUser);
        console.log('New avatar URL:', updatedUser.avatar);
        const correctedAvatar = updatedUser.avatar?.replace('http://localhost:9000', 'http://192.168.1.17:9000') || 'https://via.placeholder.com/150';
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
      Alert.alert('Success', 'You have been logged out.');
      navigation.navigate('UserLogin');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const handleAdminPanel = () => navigation.navigate('AdminPanel');
  const handleEditPersonalInfo = () => navigation.navigate('EditPersonalInfo', { userData });
  const handleEditAddress = () => navigation.navigate('EditAddress', { userData });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.headerGradient}>
        <Text style={styles.headerTitle}>Your Profile</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Pressable onPress={pickImage} disabled={loading} style={styles.avatarContainer}>
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
            />
            <Text style={styles.changeAvatarText}>Change Avatar</Text>
          </Pressable>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.firstName || 'User'}</Text>
            <Text style={styles.userEmail}>{userData?.email || 'Loading...'}</Text>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <Pressable style={styles.optionCard} onPress={handleEditPersonalInfo}>
            <Text style={styles.optionText}>Edit Personal Info</Text>
          </Pressable>
          <Pressable style={styles.optionCard} onPress={handleEditAddress}>
            <Text style={styles.optionText}>Edit Shipping Address</Text>
          </Pressable>
          {userData?.role === 'admin' && (
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
});

export default ProfileScreen;