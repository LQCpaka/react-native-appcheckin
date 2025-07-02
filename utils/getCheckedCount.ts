
import { InventoryItem, InventoryNoInput } from '@/types/Inventory';

export const getCheckedCount = (item: InventoryItem | InventoryNoInput): number => {
  if ('amountProductChecked' in item) return item.amountProductChecked;
  if ('amountProduct' in item) return item.amountProduct;
  return 0;
};

