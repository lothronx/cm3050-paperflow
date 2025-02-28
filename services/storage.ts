/**
 * Storage service for managing persistent app settings using AsyncStorage.
 * This module handles saving and retrieving user preferences such as page size,
 * auto-split settings, and language preferences for the Paperflow application.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PageSize } from "@/types/PageSize";

// Storage keys used for persisting settings in AsyncStorage
const STORAGE_KEYS = {
  PAGE_SIZE: "@paperflow_page_size",
  AUTO_SPLIT: "@paperflow_auto_split",
  USER_LANGUAGE: "@paperflow_user_language",
} as const;

/**
 * Service object providing methods to interact with persistent storage.
 * Handles saving and retrieving application settings.
 */
export const StorageService = {
  /**
   * Retrieves the user's saved settings from storage.
   * @returns Object containing:
   * - pageSize: The user's preferred page size setting, null if not set
   * - autoSplit: The user's auto-split preference, null if not set
   */
  async getSettings() {
    try {
      // Fetch both settings concurrently for better performance
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

  /**
   * Saves the user's preferred page size setting.
   * @param {PageSize} pageSize - The page size setting to save
   */
  async savePageSize(pageSize: PageSize) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PAGE_SIZE, pageSize);
    } catch (error) {
      console.error("Error saving page size:", error);
    }
  },

  /**
   * Saves the user's auto-split preference.
   * @param {boolean} value - The auto-split setting to save
   */
  async saveAutoSplit(value: boolean) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTO_SPLIT, value.toString());
    } catch (error) {
      console.error("Error saving autoSplit setting:", error);
    }
  },

  /**
   * Gets the user's saved language preference.
   * @returns The saved language code or null if not set
   */
  async getUserLanguage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_LANGUAGE);
    } catch (error) {
      console.error("Error getting user language:", error);
      return null;
    }
  },

  /**
   * Saves the user's language preference.
   * @param {string} language - The language code to save
   */
  async saveUserLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LANGUAGE, language);
    } catch (error) {
      console.error("Error saving user language:", error);
    }
  },
};
