import { Stack } from "expo-router";
import './globals.css';
import { Text, View } from "react-native";
import { useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/Bottom-sheet";
// import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoint = ['40%'];
  return (
    <Stack>
      {/* Không cần name="index", vì tự động là index.tsx */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      {/* Đây là cả folder, Expo Router tự map luôn */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>


  )
}

