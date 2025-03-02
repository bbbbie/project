import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../Navigation/RootNavigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const EditPersonalInfo = ({ navigation, route }: NativeStackScreenProps<RootStackParams, 'EditPersonalInfo'>) => {
  const { userData } = route.params;
  const [firstName, setFirstName] = useState(userData.firstName);
  const [email, setEmail] = useState(userData.email);
  const [mobileNo, setMobileNo] = useState(userData.mobileNo);

  const BACKEND_URL = 'http://192.168.1.17:9000/users';

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const updatedData = { firstName, email, mobileNo };
      const response = await axios.put(`${BACKEND_URL}/user/${userData.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      Alert.alert('Success', 'Personal info updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating personal info:', error);
      Alert.alert('Error', 'Failed to update personal info.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Xử lý bàn phím trên iPhone
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Điều chỉnh offset trên iPhone
    >
      <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            Edit Personal Info
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Your email"
            keyboardType="email-address"
            editable={false}
            selectTextOnFocus={false}
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobileNo}
            onChangeText={setMobileNo}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.saveButton}>
            <Pressable onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: 50,
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
  content: {
    flex: 1,
    justifyContent: 'center', // Căn giữa form theo chiều dọc
    alignItems: 'center', // Căn giữa form theo chiều ngang
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default EditPersonalInfo;