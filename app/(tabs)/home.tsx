import { View, Text } from 'react-native'
import { Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRef, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

const Home = () => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoint = ['50%'];
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='flex-1'>
        <View className='flex items-center justify-center h-12 bg-white shadow mb-4'>
          <Text className='text-lg uppercase font-semibold'>Trang Chủ</Text>
        </View>
        <View className='flex-1 items-center justify-center'>
          <Text className='text-2xl font-semibold'>
            COMING SOON...
          </Text>
          <Button onPress={() => {
            setIsOpen(true);
            sheetRef.current?.expand();
          }}>Button Toggle</Button>

        </View>
        <BottomSheet
          ref={sheetRef}
          enablePanDownToClose={true}
          snapPoints={snapPoint}
          index={-1}
          onClose={() => setIsOpen(false)}
        >
          <BottomSheetView >
            <Text className="text-2xl font-semibold  uppercase">Hello WORLD</Text>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Home
