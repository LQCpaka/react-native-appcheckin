import { View, Text, TouchableOpacity, FlatList, ImageBackground, Image } from 'react-native'
import { Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRef, useState } from "react";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { images } from '@/constant/images';
import { useRouter } from 'expo-router';
const items = [
  { id: '1', icon: 'cube-scan', label: 'QUÉT KIỂM', urlItem: '(tabs)/scan' },
  { id: '2', icon: 'sticker-text', label: 'PHIẾU KIỂM', urlItem: '(tabs)/inventory' },
  { id: '3', icon: 'account', label: 'TÀI KHOẢN', urlItem: '(tabs)/profile' },
  { id: '4', icon: 'information', label: 'TRẠNG THÁI', urlItem: '(tabs)/home' },
];
const Home = () => {
  const pushRoute = useRouter();

  const handlePress = (url: any) => {
    pushRoute.push(url);
  }
  return (
    <SafeAreaView className='flex-1'>
      <View className='flex items-center bg- justify-center shadow-md'
        style={{ backgroundColor: "#FFFFFF", borderBottomRightRadius: 30, borderBottomLeftRadius: 30, height: "70%" }}>
        <Image source={images.homebg}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
          }}
        />
        <Text className='text-2xl uppercase font-bold'>CHÀO MỪNG!</Text>
        <Text className='text-lg uppercase font-semibold'>Lê Quốc Cần</Text>
        <br />
        <Text className='text-2xl uppercase font-bold'>Trạng thái: Active</Text>
      </View>
      <FlatList
        data={items}
        numColumns={2}
        style={{ position: 'absolute', width: "90%", bottom: 20, zIndex: 99, alignSelf: 'center', padding: 10 }}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 10, marginBottom: 10 }} // Khoảng cách hàng và giữa cột
        renderItem={({ item }) => (
          <TouchableOpacity
            className='flex-1 py-5 shadow-md gap-3 justify-center items-center bg-white rounded-md'
            style={{ width: '48%' }} // 48% để chừa chỗ cho khoảng cách
            onPress={() => handlePress(item.urlItem)}
          >
            <View>
              <MaterialCommunityIcons
                name={item.icon}
                color="#aba4a4"
                size={40}
              />
              <View className="absolute top-[-5] right-0 bg-red-500 rounded-full w-5 h-5 justify-center items-center">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
            </View>
            <Text className='font-semibold text-center' style={{ color: "#aba4a4" }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />


    </SafeAreaView >
  )
}

export default Home
