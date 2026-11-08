import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, languages, defaultNS } from './i18n.config';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: any, namespace: any) => {
      return import(`./locales/${language}/${namespace}.json`);
    })
  )
  .init({
    supportedLngs: languages,
    fallbackLng,
    lng: undefined,
    fallbackNS: defaultNS,
    defaultNS,
    detection: {
      order: ['cookie', 'header'],
    },
    preload: runsOnServerSide ? languages : [],
  });

// dates follow the interface language (month names, weekdays); unknown
// locales are ignored by dayjs, so English stays the fallback
const syncDateLocale = (lng?: string) => {
  if (lng) {
    dayjs.locale(lng.split('-')[0]);
  }
};
if (!runsOnServerSide) {
  i18next.on('languageChanged', syncDateLocale);
  syncDateLocale(i18next.language);
}

export default i18next;
