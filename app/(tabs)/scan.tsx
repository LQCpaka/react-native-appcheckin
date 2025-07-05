import { Text, TextInput, FlatList, View, ScrollView, TouchableOpacity, NativeSyntheticEvent, TextInputSubmitEditingEventData, Image } from "react-native";
import { Button, DataTable, Divider, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ScanArea from "@/components/ScanArea";


export default function Index() {



  return (
    <PaperProvider>
      <SafeAreaView className='flex-1'>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/*===============================| HEADER  |============================================*/}
          <View className='flex items-center justify-center h-12 bg-white shadow mb-4'>
            <Text className='text-lg uppercase font-semibold'>Quét Mã</Text>
          </View>
          <ScanArea
          />
        </GestureHandlerRootView >
      </SafeAreaView >
    </PaperProvider>

  );
}

