import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScannedInventoryType } from "@/types/Inventory";
import { InventoryType } from "@/libs/useInventoryStore";

type DraftData = {
  scannedData: ScannedInventoryType[];
  ticketType: InventoryType;
  timestamp: string;
}

type AllDrafts = {
  [ticketId: string]: DraftData;
};

export const saveDraft = async (username: string, ticketId: string, ticketType: InventoryType, scannedData: ScannedInventoryType[]) => {
  const key = `inventory_drafts_${username}`;
  const existing = await AsyncStorage.getItem(key);
  const drafts: AllDrafts = existing ? JSON.parse(existing) : {};

  drafts[ticketId] = {
    scannedData,
    ticketType,
    timestamp: new Date().toISOString(),
  };

  await AsyncStorage.setItem(key, JSON.stringify(drafts));
}

export const loadDraft = async (
  username: string,
  ticketId: string
): Promise<DraftData | null> => {

  const key = `inventory_drafts_${username}`;
  const existing = await AsyncStorage.getItem(key);
  if (!existing) return null;

  const drafts: AllDrafts = JSON.parse(existing);
  return drafts[ticketId] ?? null;
}

export const getAllDrafts = async (username: string): Promise<{ ticketId: string; info: DraftData }[]> => {
  const key = `inventory_drafts_${username}`;
  const existing = await AsyncStorage.getItem(key);
  if (!existing) return [];

  const drafts: AllDrafts = JSON.parse(existing);
  return Object.entries(drafts).map(([ticketId, info]) => ({ ticketId, info }));
};

export const deleteDraft = async (username: string, ticketId: string) => {
  const key = `inventory_drafts_${username}`;
  const existing = await AsyncStorage.getItem(key);
  if (!existing) return;

  const drafts: AllDrafts = JSON.parse(existing);
  delete drafts[ticketId];

  await AsyncStorage.setItem(key, JSON.stringify(drafts));
}

