import React, { useState, useEffect } from 'react'; // Thêm useEffect
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from '../Navigation/RootNavigator';

const UserLogin = ({ navigation }: RootStackScreenProps<'UserLogin'>) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNo: '',
  });
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Kiểm tra token khi component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true); // Nếu đã có token, chuyển sang form địa chỉ
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.17:9000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        setIsLoggedIn(true);
      } else {
        Alert.alert('Error', data.error || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.17:9000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          email: formData.email,
          password: formData.password,
          mobileNo: formData.mobileNo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Registration successful. Please login.');
        setIsLogin(true);
        setFormData({
          firstName: '',
          email: '',
          password: '',
          confirmPassword: '',
          mobileNo: '',
        });
      } else {
        Alert.alert('Error', data.error || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleAddressSubmit = () => {
    Alert.alert(
      'Address Submitted',
      `Street: ${addressData.street}\nCity: ${addressData.city}\nState: ${addressData.state}\nZip Code: ${addressData.zipCode}`
    );
    setAddressData({
      street: '',
      city: '',
      state: '',
      zipCode: '',
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!isLoggedIn ? (
          <>
            <Text style={styles.title}>
              {isLogin ? 'Login to Your Account' : 'Create an Account'}
            </Text>

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
            />

            {!isLogin && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    setFormData({ ...formData, confirmPassword: text })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  value={formData.mobileNo}
                  onChangeText={(text) =>
                    setFormData({ ...formData, mobileNo: text })
                  }
                />
              </>
            )}

            <Pressable
              style={styles.submitButton}
              onPress={isLogin ? handleLogin : handleRegister}
            >
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchButtonText}>
                {isLogin
                  ? "Don't have an account? Register"
                  : 'Already have an account? Login'}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.title}>Enter Your Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Street Address"
              value={addressData.street}
              onChangeText={(text) =>
                setAddressData({ ...addressData, street: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="City"
              value={addressData.city}
              onChangeText={(text) =>
                setAddressData({ ...addressData, city: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="State"
              value={addressData.state}
              onChangeText={(text) =>
                setAddressData({ ...addressData, state: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              keyboardType="numeric"
              value={addressData.zipCode}
              onChangeText={(text) =>
                setAddressData({ ...addressData, zipCode: text })
              }
            />

            <Pressable style={styles.submitButton} onPress={handleAddressSubmit}>
              <Text style={styles.submitButtonText}>Submit Address</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    color: '#3498db',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default UserLogin;