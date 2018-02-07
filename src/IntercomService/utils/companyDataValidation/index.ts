import {
  ICompanyDataObject,
  IUserDataObject,
  IIntercomServiceObject,
  IIntercomValidationResultObject,
} from '../../types'
import * as _ from 'lodash'
import * as winston from 'winston'

export const validateDataObject = (
  data: ICompanyDataObject | IUserDataObject
): IIntercomValidationResultObject => {
  let validated = true
  const errors = []

  if (_.size(data.custom_attributes) > 100) {
    validated = false
    errors.push(
      `The size(${_.size(
        data.custom_attributes
      )}) of the custom_attributes object exceeds the allowd 100`
    )
  } else {
    _.forEach(data.custom_attributes, (value, key) => {
      if (_.size(key) > 190) {
        validated = false
        errors.push(`The length(${_.size(key)}) of key(${key}) exceeds the allowd 190`)
      }
      if (_.includes(key, '.') || _.includes(key, '$')) {
        validated = false
        errors.push(`The key(${key}) contains non allowed characters (., $)`)
      }
      if (_.isString(value) && _.size(value) > 255) {
        validated = false
        errors.push(
          `The length(${_.size(value)}) of value(${value}) of key(${key}) exceeds the allowd 255`
        )
      }
      if (!(_.isString(value) || _.isBoolean(value) || _.isNumber(value))) {
        validated = false
        errors.push(`The type of value(${value}) of key(${key}) is not valid.`)
      }
    })
  }

  return {
    validated,
    errors,
  }
}
