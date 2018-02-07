import * as Intercom from 'intercom-client'
import * as _ from 'lodash'
import * as winston from 'winston'
import * as retry from 'retry'
import {
  ICompanyDataObject,
  IUserDataObject,
  IDeleteUserObject,
  IIntercomServiceObject,
  IIntercomServiceConstructorObject,
} from './types'
import { validateDataObject } from './utils/companyDataValidation'
import { jsonParse } from './utils/parseTools'
import { sanitizeLocale } from './utils/textUtils'

export class IntercomService {
  private intercom
  constructor({ token, MockEffect }: IIntercomServiceConstructorObject) {
    this.intercom = MockEffect ? MockEffect : new Intercom.Client({ token: token })
  }

  /**
   * Tag a company in Intercom
   */
  public tagCompany(companyId: string, tag: string): Promise<IIntercomServiceObject> {
    return new Promise(async resolve => {
      try {
        const { intercom } = this
        const tagToSave = tag ? tag : 'activated'
        const actionResult = await intercom.tags.tag({
          name: tagToSave,
          companies: [{ company_id: `${companyId}` }],
        })
        const companyInfo = actionResult.body
        resolve({
          success: true,
          data: {
            internal_id: companyId,
            intercom_id: companyInfo.id,
            result: companyInfo,
          },
        })
      } catch (error) {
        const parsedFullError = jsonParse(error)
        const parsedError = parsedFullError.message ? parsedFullError.message : parsedFullError
        const firstError =
          parsedError && parsedError.body && parsedError.body.errors
            ? parsedError.body.errors[0]
            : {
                code: 'UnknownError',
                message: `Error when tagging company with id '${companyId}' in Intercom. Error was '${parsedError}'`,
              }
        resolve({
          success: false,
          error: {
            code: firstError.code,
            message: firstError.message,
            errors: [firstError.message],
            originalError: `${error}`,
            data: {
              internal_id: companyId,
            },
          },
        })
      }
    })
  }

  /**
   * Create or Update a company in Intercom
   */
  public createOrUpdateCompany(companyData: ICompanyDataObject): Promise<IIntercomServiceObject> {
    return new Promise(async resolve => {
      try {
        const { intercom } = this
        let validated = false
        const validationResult = validateDataObject(companyData)
        if (validationResult.validated) {
          const actionResult = await intercom.companies.create(companyData)
          const companyInfo = actionResult.body
          resolve({
            success: true,
            data: {
              internal_id: companyData.company_id,
              intercom_id: companyInfo.id,
              result: companyInfo,
            },
          })
        } else {
          resolve({
            success: false,
            error: {
              code: 'ValidationFailed',
              message: 'The incoming company object could not be validated',
              errors: validationResult.errors,
              data: {
                internal_id: companyData.company_id,
              },
            },
          })
        }
      } catch (error) {
        const parsedFullError = jsonParse(error)
        const parsedError = parsedFullError.message ? parsedFullError.message : parsedFullError
        const firstError =
          parsedError && parsedError.body && parsedError.body.errors
            ? parsedError.body.errors[0]
            : {
                code: 'unknown_error',
                message: `Error when creating/updating company with id '${
                  companyData.company_id
                }' in Intercom. Error was '${parsedError}'`,
              }
        resolve({
          success: false,
          error: {
            code: firstError.code,
            message: firstError.message,
            errors: [firstError.message],
            originalError: `${error}`,
            data: {
              internal_id: companyData.company_id,
            },
          },
        })
      }
    })
  }

  /**
   * Create or Update a user in Intercom
   */
  public createOrUpdateUser(userData: IUserDataObject): Promise<IIntercomServiceObject> {
    return new Promise(async resolve => {
      try {
        const { intercom } = this
        let validated = false
        const validationResult = validateDataObject(userData)
        if (validationResult.validated) {
          const actionResult = await intercom.users.create(userData)
          const userInfo = actionResult.body
          resolve({
            success: true,
            data: {
              internal_id: userData.user_id,
              intercom_id: userInfo.id,
              result: userInfo,
            },
          })
        } else {
          resolve({
            success: false,
            error: {
              code: 'ValidationFailed',
              message: 'The validation of the incoming user object failed',
              errors: validationResult.errors,
              data: {
                internal_id: userData.user_id,
              },
            },
          })
        }
      } catch (error) {
        const parsedFullError = jsonParse(error)
        const parsedError = parsedFullError.message ? parsedFullError.message : parsedFullError
        const firstError =
          parsedError && parsedError.body && parsedError.body.errors
            ? parsedError.body.errors[0]
            : {
                code: 'unknown_error',
                message: `Error when creating/updating user with id '${
                  userData.user_id
                }' in Intercom. Error was '${parsedError}'`,
              }
        resolve({
          success: false,
          error: {
            code: firstError.code,
            message: firstError.message,
            errors: [firstError.message],
            originalError: `${error}`,
            data: {
              internal_id: userData.user_id,
            },
          },
        })
      }
    })
  }

  /**
   * Create or Update a user in Intercom
   */
  public deleteUser(deleteUserParams: IDeleteUserObject): Promise<IIntercomServiceObject> {
    return new Promise(async resolve => {
      try {
        const { intercom } = this
        const actionResult = await intercom.users.delete(deleteUserParams)
        const actionInfo = actionResult.body
        resolve({
          success: true,
          data: {
            internal_id: deleteUserParams.user_id,
            intercom_id: actionInfo.id,
            result: actionInfo,
          },
        })
      } catch (error) {
        const parsedFullError = jsonParse(error)
        const parsedError = parsedFullError.message ? parsedFullError.message : parsedFullError
        const firstError =
          parsedError && parsedError.body && parsedError.body.errors
            ? parsedError.body.errors[0]
            : {
                code: 'unknown_error',
                message: `Error when deleting user with id '${
                  deleteUserParams.user_id
                }' in Intercom. Error was '${parsedError}'`,
              }
        resolve({
          success: false,
          error: {
            code: firstError.code,
            message: firstError.message,
            errors: [firstError.message],
            originalError: `${error}`,
            data: {
              internal_id: deleteUserParams.user_id,
            },
          },
        })
      }
    })
  }

  // Bulk operations
  private updateUserWithRetry(user: IUserDataObject): Promise<IIntercomServiceObject> {
    return new Promise(resolve => {
      try {
        console.log('updateUserWithRetry...')
        const operation = retry.operation()

        operation.attempt(currentAttempt => {
          this.createOrUpdateUser({
            user_id: `${user.user_id}`,
            name: user.name,
            email: user.email,
          }).then(userUpdate => {
            if (operation.retry(userUpdate.error)) {
              console.log('Retrying because userUpdate.error', userUpdate.error)
              return
            }

            if (!userUpdate.success) {
              console.log('Failed because userUpdate.error', userUpdate.error)
              resolve({
                success: false,
                error: {
                  code: 'UPDATE_ERROR',
                  message: operation.mainError(),
                  errors: [],
                },
              })
            } else {
              console.log('updateUserWithRetry user', user)
              resolve({
                success: true,
              })
            }
          })
        })
      } catch (error) {
        console.log('updateUserWithRetry caught error', error)
        resolve({
          success: false,
          error: {
            code: 'CAUGHT_ERROR',
            message: error.message,
            errors: [],
          },
        })
      }
    })
  }

  public updateUsersInBulk(users: IUserDataObject[]): Promise<IIntercomServiceObject> {
    return new Promise(async resolve => {
      console.log('updateUsersInBulk...')
      if (_.size(users) < 1) {
        resolve({
          success: false,
          error: {
            code: 'NO_DATA',
            message:
              'The size of the incoming array of users where less than 1 so nothing to do here',
            errors: [
              'The size of the incoming array of users where less than 1 so nothing to do here',
            ],
          },
        })
        return
      }
      const errors = []
      _.forEach(users, async user => {
        try {
          const result = await this.updateUserWithRetry(user)
          if (!result.success) {
            errors.push(result.error)
            console.log('updateUsersInBulk returned error', result.error)
          }
        } catch (error) {
          console.log('updateUsersInBulk caught error', error)
          errors.push(error)
        }
      })
      if (_.size(errors) > 0) {
        console.log('updateUsersInBulk errors', errors)
        resolve({
          success: false,
          error: {
            code: 'NO_DATA',
            message:
              'The bulk operation experienced errors. See the errors array for more information',
            errors,
          },
        })
      } else {
        console.log('updateUsersInBulk all is good!')
        resolve({
          success: true,
        })
      }
    })
  }
}
