import { validateDataObject } from './index'
import { ICompanyDataObject } from '../../types'

describe('#validateDataObject()', () => {
  test('should return true for valid object', () => {
    const validObject: ICompanyDataObject = {
      company_id: '1234',
      custom_attributes: {
        string: '1234',
        number: 1234,
        boolean: true,
      },
    }
    const result = validateDataObject(validObject)
    expect(result).toBeDefined()
    expect(result.validated).toBeDefined()
    expect(result.validated).toBeTruthy()
  })
  test('should return false when custom_attributes contains arrays and objects', () => {
    const validObject: ICompanyDataObject = {
      company_id: '1234',
      custom_attributes: {
        string: '1234',
        number: { 1: 234 },
        boolean: [1234],
      },
    }
    const result = validateDataObject(validObject)
    expect(result).toBeDefined()
    expect(result.validated).toBeDefined()
    expect(result.validated).toBeFalsy()
  })
  test('should return false when keys in custom_attributes contains non valid characters', () => {
    const validObject: ICompanyDataObject = {
      company_id: '1234',
      custom_attributes: {
        'point.point': '1234',
        'number€': { 1: 234 },
        'boolean....$': [1234],
      },
    }
    const result = validateDataObject(validObject)
    expect(result).toBeDefined()
    expect(result.validated).toBeDefined()
    expect(result.validated).toBeFalsy()
  })
  test('should return false when the size of custom attributes is more than 100', () => {
    let validObject: ICompanyDataObject = {
      company_id: '1234',
      custom_attributes: {},
    }
    for (let i = 0; i < 101; i++) {
      validObject.custom_attributes[i] = i
    }
    const result = validateDataObject(validObject)
    expect(result).toBeDefined()
    expect(result.validated).toBeDefined()
    expect(result.validated).toBeFalsy()
  })
})
