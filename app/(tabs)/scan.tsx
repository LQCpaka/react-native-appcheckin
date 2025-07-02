import axios from "axios";
import { useRef, useState, useEffect, useCallback } from "react";
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router";

import { Text, TextInput, FlatList, View, ScrollView, TouchableOpacity, NativeSyntheticEvent, TextInputSubmitEditingEventData, Image } from "react-native";
import { Button, DataTable, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import ScanArea from "@/components/ScanArea";
//====================| DATA FETCHING |==========================

interface InventoryItem {
  _id: string;
  productId: string;
  productName: string;
  countAs: string;
  amountProduct: number;
  amountProductChecked: number;
  productPrice?: string;
  productDescriptionA?: string;
  productDescriptionB?: string;
}


export default function Index() {


  // =================| BOTTOM SHEET DATA |===========================
  // const sheetRef = useRef<BottomSheetMethods>(null);
  // const [isOpen, setIsOpen] = useState(false);
  // const snapPoint = ['50%'];
  //
  // const [selectedItem, setSelectedItem] = useState(null);
  //

  return (
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

  );
}

