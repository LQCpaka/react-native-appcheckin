import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScannedInventoryType } from "@/types/Inventory";
import { InventoryType } from "@/libs/useInventoryStore";

export type SeparatedDraft = {
  ticketId: string;
  ticketType: InventoryType;
  scannedData: ScannedInventoryType[];
  savedAt: string;
}

export const saveDraft = async (
  username: string,
  ticketId: string,
  ticketType: InventoryType,
  scannedData: ScannedInventoryType[]
) => {
  const timestamp = new Date().toISOString();
  const key = `inventory_draft_${username}_${ticketId}_${timestamp}`;

  const data: SeparatedDraft = {
    ticketId,
    ticketType,
    scannedData,
    savedAt: timestamp
  }

  await AsyncStorage.setItem(key, JSON.stringify(data));
};

export const getDrafts = async (username: string): Promise<SeparatedDraft[]> => {
  const keys = await AsyncStorage.getAllKeys();
  const matchedKeys = keys.filter(k => k.startsWith(`inventory_draft_${username}_`));
  const entries = await AsyncStorage.multiGet(matchedKeys);
  return entries.map(([key, value]) => {
    const parsed = JSON.parse(value ?? '{}');
    return parsed as SeparatedDraft;
  });
};

export const deleteDraft = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const getLatestDraftForTicket = async (
  username: string,
  ticketId: string
): Promise<SeparatedDraft | null> => {
  const keys = await AsyncStorage.getAllKeys();
  const matchedKeys = keys.filter(k => k.startsWith(`inventory_draft_${username}_${ticketId}_`))

  if (matchedKeys.length === 0) return null;

  const sortedKeys = matchedKeys.sort().reverse();
  const latestValue = await AsyncStorage.getItem(sortedKeys[0]);
  return latestValue ? JSON.parse(latestValue) : null;
}
