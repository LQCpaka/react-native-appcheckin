import { images } from "@/constant/images";
import React from "react";
import { View, StyleSheet, ImageBackground, Image, Text, ScrollView, TouchableOpacity } from "react-native";
import { Avatar, Button, Divider } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";


const settings = [
  {
    title: 'Thông Tin Tài Khoản',
    bgColor: '#dddddd',
    icon: 'information-circle',
  },

  {
    title: 'Phiếu kiểm kê',
    bgColor: '#f0e9e9',
    icon: 'create-sharp'
  },
  {
    title: 'Lịch Sử',
    bgColor: '#dddddd',
    icon: 'time'
  },
  {
    title: 'Cài Đặt',
    bgColor: '#f0e9e9',
    icon: 'settings',
  },
  {
    title: 'Hỗ Trợ',
    bgColor: '#dddddd',
    icon: 'help-circle'
  }
]

const ProfileScreen = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  }
  return (
    <View className="flex-1 relative">
      <Image
        source={images.archlinuxbg}
        style={{
          width: '100%',
          height: '25%',
        }} />
      <View className="absolute flex self-center items-center" style={{ top: '15%' }}>
        <Avatar.Image
          size={120}
          source={images.avatarsample}
        />
        <Text className="text-2xl text-center font-semibold mt-4">Lê Quốc Cần</Text>
      </View>
      <Divider className="mx-4" style={{ marginTop: "35%" }} />
      <ScrollView className="mx-4">

        {settings.map((item) => {
          return (
            <TouchableOpacity
              key={item.title}
              style={{
                marginVertical: "-3%",
                paddingVertical: "3%",
                paddingLeft: "2%",
                backgroundColor: `${item.bgColor}`,
                alignContent: 'center',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              className='mt-4 rounded-md'
            >
              <Ionicons name={item.icon} size={24} color="black" />
              <Text style={{ marginLeft: '1%' }} className="text-xl">{item.title}</Text>
            </TouchableOpacity>
          )
        })}

        <TouchableOpacity

          style={{
            marginVertical: "-3%",
            paddingVertical: "3%",
            paddingLeft: "2%",
            backgroundColor: `#f0e9e9`,
            alignContent: 'center',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={handleLogout}
          className='mt-4 rounded-md'
        >
          <Ionicons name='exit-sharp' size={24} color="#ff474c" />
          <Text style={{ marginLeft: '1%', color: '#ff474c' }} className="text-xl">Đăng Xuất</Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
};


export default ProfileScreen;

