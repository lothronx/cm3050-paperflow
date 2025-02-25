import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PageSize } from "@/types/PageSize";

const STORAGE_KEYS = {
  PAGE_SIZE: "@paperflow_page_size",
  AUTO_SPLIT: "@paperflow_auto_split",
} as const;

export const StorageService = {
  async getSettings() {
    try {
      const [pageSize, autoSplit] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PAGE_SIZE),
        AsyncStorage.getItem(STORAGE_KEYS.AUTO_SPLIT),
      ]);
      return {
        pageSize: pageSize as PageSize | null,
        autoSplit: autoSplit ? autoSplit === "true" : null,
      };
    } catch (error) {
      console.error("Error loading saved values:", error);
      return { pageSize: null, autoSplit: null };
    }
  },

  async savePageSize(pageSize: PageSize) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PAGE_SIZE, pageSize);
    } catch (error) {
      console.error("Error saving page size:", error);
    }
  },

  async saveAutoSplit(value: boolean) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTO_SPLIT, value.toString());
    } catch (error) {
      console.error("Error saving autoSplit setting:", error);
    }
  },
};
