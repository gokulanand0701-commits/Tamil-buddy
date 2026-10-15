import { useSettingsStore } from '../store/useSettingsStore';
import { translations, TranslationKey, Language } from '../utils/translations';

export const useTranslation = () => {
  const { language, toggleLanguage, setLanguage } = useSettingsStore();

  const t = (key: TranslationKey, fallback?: string): string => {
    const langDict = translations[language as Language] || translations.en;
    if (key in langDict) {
      return (langDict as any)[key];
    }
    const enDict = translations.en;
    if (key in enDict) {
      return (enDict as any)[key];
    }
    return fallback || key;
  };

  return {
    t,
    language,
    toggleLanguage,
    setLanguage,
    isTamil: language === 'ta',
  };
};
