import { View, Dimensions, Text, TouchableOpacity, FlatList, ImageBackground, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { images } from '@/constant/images';
import { useRouter } from 'expo-router';
import Svg, { Circle, Rect } from 'react-native-svg';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = [
  {
    name: 'Red',
    population: 215,
    color: '#f00',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Green',
    population: 280,
    color: '#0f0',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Blue',
    population: 527,
    color: '#00f',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];
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
        <View style={{
          position: 'absolute',
          width: '100%',
          paddingHorizontal: 10,
          top: 20,
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row'
        }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#aba4a4',
            }}>
            Lê Quốc Cần
          </Text>

          <Text
            className='shadow-lg'
            style={{
              marginHorizontal: 5,
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#aba4a4'
            }}
          >
            Trạng thái: Active
          </Text>
        </View>


        {/*===========================| PIE CHART |===========================*/}
        <PieChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={{
            color: () => `#000`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
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
