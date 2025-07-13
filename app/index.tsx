import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, Image } from 'react-native';
import { images } from '../constant/images';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn({ email, password });
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.message || 'Không đăng nhập được');
    }
  };

  return (
    <View className='flex-1 justify-center items-center'>
      <Image
        source={images.wavebg}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
      <Image
        source={images.logodelfi}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%', marginBottom: 20, tintColor: '#000' }}
      />
      <View>

        {/* <Text className='mb-4 font-semibold text-center text-2xl'>DELFI TECHNOLOGIES</Text> */}
        <TextInput
          placeholder="Email"
          value={email}
          placeholderTextColor='#808080'
          onChangeText={setEmail}
          className='border-[0.5px] border-gray-400 rounded-md p-2 mb-2 w-80'
        />
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          placeholderTextColor='#808080'
          onChangeText={setPassword}
          className='border-[0.5px] border-gray-400 rounded-md p-2 mb-2 w-80'
          secureTextEntry
        />
        <TouchableOpacity className='mt-4 bg-blue-500 py-2 rounded-md' onPress={handleLogin}>
          <Text className='text-white text-center'>Đăng Nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;

