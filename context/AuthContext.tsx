import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

interface AuthContextType {
  userToken: string | null;
  userInfo: any;
  loading: boolean;
  signIn: ({ email, password }: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  //=============================| SIGN-IN |=============================
  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BEAPI_URL}/api/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = res.data.token;
      const userInfo = {
        id: res.data.id,
        email: res.data.email,
        name: res.data.name
      };

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

      setUserToken(token);
      setUserInfo(userInfo);

      router.replace('/(tabs)/home');
    } catch (err: any) {
      console.log('❌ Lỗi login:', JSON.stringify(err, null, 2));
      throw new Error(err.response?.data?.error || err.message || 'Đăng nhập thất bại');
    }
  };


  //=============================| SIGN-OUT |=============================
  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    setUserToken(null);
    setUserInfo(null);
    router.replace('/');
  };

  //=============================| RESTORE SESSION |=============================
  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userInfo');

      if (token && user) {
        setUserToken(token);
        setUserInfo(JSON.parse(user));
      }
    } catch (error) {
      console.log('❌ Lỗi khôi phục phiên:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, userInfo, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

