import { sanitizeLocale } from './index'

describe('#textUtils sanitizeLocale() unit test', () => {
  test('should return expected values for valid locale', () => {
    const result = sanitizeLocale('sv-SE')
    expect(result).toBeDefined()
    expect(result).toEqual('sv')
  })
  test('should return expected values for valid locale', () => {
    const result = sanitizeLocale('en-GB')
    expect(result).toBeDefined()
    expect(result).toEqual('en')
  })
  test('should return expected values for valid locale', () => {
    const result = sanitizeLocale(null)
    expect(result).toBeDefined()
    expect(result).toEqual('en')
  })
  test('should return expected values for valid locale', () => {
    const result = sanitizeLocale(undefined)
    expect(result).toBeDefined()
    expect(result).toEqual('en')
  })
})
