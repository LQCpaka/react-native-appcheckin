import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post('https://1f90-2405-4803-c7a0-3380-6d70-1b94-a1d7-2852.ngrok-free.app/api/login', { email, password });
    // console.log("Response from BE:", response.data);
    const { token } = response.data;

    // await AsyncStorage.setItem('userToken', token);
    return { success: true, token };
  } catch (error: any) {
    // console.error("Login Error:", error.response?.data); // Log lỗi
    return { success: false, error: error.response.data?.message || 'Đăng nhập thất bại' };
  }
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('userToken');
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem('userToken');
}
