import { View, Dimensions, Text, TouchableOpacity, FlatList, ImageBackground, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { images } from '@/constant/images';
import { useRouter } from 'expo-router';
import Svg, { Circle, Rect } from 'react-native-svg';
import { PieChart } from 'react-native-chart-kit';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;


const items = [
  { id: '1', icon: 'cube-scan', label: 'QUÉT KIỂM', urlItem: '(tabs)/scan' },
  { id: '2', icon: 'sticker-text', label: 'PHIẾU KIỂM', urlItem: '(tabs)/inventory' },
  { id: '3', icon: 'account', label: 'TÀI KHOẢN', urlItem: '(tabs)/profile' },
  { id: '4', icon: 'information', label: 'TRẠNG THÁI', urlItem: '(tabs)/home' },
];

interface TicketItem {
  _id: string;
  ticketId: string;
  ticketName: string;
  ticketType: string;
  ticketStatus: string;
  createdDate: string;
}
const Home = () => {
  const pushRoute = useRouter();

  const [ticket, setTicket] = useState<TicketItem[]>([]);

  const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;
  useEffect(() => {
    axios.get(`${API_URL}/list-tickers`,
      {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => {
        if (Array.isArray(response.data)) {
          setTicket(response.data);
        } else {
          console.error("Data is not an array:", response.data);
          setTicket([]);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      })
  }, [])

  const handlePress = (url: any) => {
    pushRoute.push(url);
  }

  const chartData = useMemo(() => {
    const counts = {
      'Phiếu Mới': 0,
      'Phiếu Chờ Xác Nhận': 0,
      'Phiếu Đã Xác Nhận': 0,
      'Kiểm Kê Hoàn Tất': 0
    };

    ticket.forEach(item => {
      if (counts[item.ticketStatus] !== undefined) {
        counts[item.ticketStatus]++;
      }
    });

    return [
      {
        name: 'Phiếu Mới',
        population: counts['Phiếu Mới'],
        color: '#FF6384',
        legendFontColor: '#333',
        legendFontSize: 13
      },
      {
        name: 'Phiếu Chờ Xác Nhận',
        population: counts['Phiếu Chờ Xác Nhận'],
        color: '#FFCD56',
        legendFontColor: '#333',
        legendFontSize: 13
      },
      {
        name: 'Phiếu Đã Xác Nhận',
        population: counts['Phiếu Đã Xác Nhận'],
        color: '#36A2EB',
        legendFontColor: '#333',
        legendFontSize: 13
      },
      {
        name: 'Kiểm Kê Hoàn Tất',
        population: counts['Kiểm Kê Hoàn Tất'],
        color: '#4BC0C0',
        legendFontColor: '#333',
        legendFontSize: 13
      }
    ];
  }, [ticket]);

  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedData(chartData), 300); // 300ms delay
    return () => clearTimeout(timer);
  }, [chartData]);

  const row1 = animatedData.slice(0, 2);
  const row2 = animatedData.slice(2, 4);

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex items-center justify-center shadow-md'
        style={{ backgroundColor: "#FFFFFF", position: 'relative', borderBottomRightRadius: 30, borderBottomLeftRadius: 30, zIndex: 10, height: "70%" }}>
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


        {/*===========================| PIE CHART |===========================*/}
        <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <PieChart
              data={animatedData}
              width={screenWidth * 0.9} // Nhỏ hơn chiều rộng để dư khoảng trắng hai bên
              height={220}
              center={[85, 0]} // Căn giữa theo chiều ngang
              paddingLeft='0'
              chartConfig={{ color: () => `#000` }}
              accessor="population"
              backgroundColor="transparent"
              absolute
              hasLegend={false}
            />
          </View>
          {/* Description dưới PieChart */}
          <View style={{ alignItems: 'center', marginTop: 15 }}>
            {[row1, row2].map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
                {row.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: item.color,
                        marginRight: 8,
                        borderRadius: 2,
                      }}
                    />
                    <Text style={{ fontSize: 14, color: '#333' }}>
                      {item.name}: {item.population}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

        </View>
      </View>
      <FlatList
        data={items}
        numColumns={2}
        style={{ position: 'absolute', width: "90%", bottom: 0, zIndex: 99, alignSelf: 'center', padding: 10, elevation: 10, }}
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
              {item.label === 'PHIẾU KIỂM' && ticket.length > 0 && (
                <View className="absolute top-[-5] right-0 bg-red-500 rounded-full w-5 h-5 justify-center items-center">
                  <Text className="text-white text-xs font-bold">{ticket.length}</Text>
                </View>
              )}
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
