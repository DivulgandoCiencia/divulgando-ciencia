import * as enTranslations from "./translations/en.json"
import * as esTranslations from "./translations/es.json"
import { DEFAULT_LANGUAGE } from "./config"

const translations = {
    en: enTranslations,
    es: esTranslations,
}

export function t(key: string, lang: string): string {
    const currentLang = lang
    const keys = key.split(".")
    const translationObj = translations[currentLang] || translations[DEFAULT_LANGUAGE]
    let result = translationObj
    for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
            result = result[k]
        } else {
            if (currentLang !== DEFAULT_LANGUAGE) {
                let defaultResult = translations[DEFAULT_LANGUAGE]
                for (const defaultK of keys) {
                    if (defaultResult && typeof defaultResult === "object" && defaultK in defaultResult) {
                        defaultResult = defaultResult[defaultK]
                    } else {
                        return key
                    }
                }
                return typeof defaultResult === "string" ? defaultResult : key
            }
            return key
        }
    }

    return typeof result === "string" ? result : key
}
