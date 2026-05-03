import type { LanguageCode } from './config'

export type UiDict = {
    [key: string]: string | UiDict
}

export type UiDictionaries = {
    [lang in LanguageCode]?: UiDict
}
