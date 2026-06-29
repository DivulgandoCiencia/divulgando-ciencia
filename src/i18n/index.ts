import { DEFAULT_LANGUAGE } from "./config"
import * as enTranslations from "./translations/en.json"
import * as esTranslations from "./translations/es.json"

const translations = {
    en: enTranslations,
    es: esTranslations,
}

export const clientTranslations: typeof translations | any = translations

export * from './config';
export * from './utils';
export * from './ui';