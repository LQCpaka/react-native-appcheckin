import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { images } from '../constant/images';

// const API_URL = 'https://a275-2405-4803-c7a0-3380-6d70-1b94-a1d7-2852.ngrok-free.app/api/login';
const API_URL = `${process.env.EXPO_PUBLIC_BEAPI_URL}/api/login`;

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const loginUser = async () => {
    try {
      const response = await axios.post(API_URL, { email, password });

      if (response.status === 200) { // Kiểm tra phản hồi thành công
        router.replace('/home');
        Alert.alert('Đăng nhập thành công', response.data.message || 'Chào mừng!');
      } else {
        throw new Error('Phản hồi không hợp lệ');
      }

    } catch (error) {
      Alert.alert('Lỗi đăng nhập', error.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <View className='flex-1 justify-center items-center'>
      <Image
        source={images.wavebg}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />
      <View>
        <Text className='mb-4 font-semibold text-center text-2xl'>DELFI TECHNOLOGIES</Text>
        <TextInput
          placeholder="Email"
          value={email}
          placeholderTextColor='#808080'
          onChangeText={setEmail}
          className='border-[0.5px] border-gray-400 rounded-md  p-2 mb-2 w-64'
        />
        <TextInput
          placeholder="Mật Khẩu"
          value={password}
          placeholderTextColor='#808080'
          onChangeText={setPassword}
          className='border-[0.5px] border-gray-400 rounded-md p-2 mb-2 w-64'
          secureTextEntry
        />
        <TouchableOpacity className='mt-4 bg-blue-500 py-2 rounded-md' onPress={loginUser}>
          <Text className='text-white text-center'>Đăng Nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;

