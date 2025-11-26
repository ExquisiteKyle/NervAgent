// Internationalization (i18n) Utility
// Note: Vite handles JSON imports automatically
import translations from '../../locales/en.json';

/**
 * Get a translated string by key
 * @param {string} key - Translation key (e.g., 'ui.pressE' or 'items.inventoryFull')
 * @param {object} params - Optional parameters to replace placeholders (e.g., {itemName: 'Potion'})
 * @returns {string} Translated string
 */
export function t(key, params = {}) {
  // Navigate through nested object structure
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return key if translation not found
    }
  }
  
  // If value is not a string, return the key
  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string for key: ${key}`);
    return key;
  }
  
  // Replace placeholders with parameters
  let result = value;
  for (const [paramKey, paramValue] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
  }
  
  return result;
}

/**
 * Get current language
 * @returns {string} Current language code (default: 'en')
 */
export function getCurrentLanguage() {
  return 'en'; // For now, only English is supported
}

/**
 * Set language (for future use)
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 */
export function setLanguage(lang) {
  // TODO: Implement language switching
  console.log(`Language switching to ${lang} not yet implemented`);
}

