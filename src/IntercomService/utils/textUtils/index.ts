import * as _ from 'lodash'

export const sanitizeLocale = locale => {
  let sanitizedLocale = 'en'
  if (locale) {
    const n = locale.indexOf('-')
    sanitizedLocale = locale.substring(0, n !== -1 ? n : locale.length)
  }
  return sanitizedLocale
}
