import * as Intercom from 'intercom-client'
import * as _ from 'lodash'
import * as retry from 'retry'
import {
  ICompanyDataObject,
  IUserDataObject,
  IDeleteUserObject,
  IIntercomServiceObject,
  IIntercomServiceConstructorObject,
  ITagCompanyData,
  IIntercomErrorResponse,
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
  public tagCompany(params: ITagCompanyData): Promise<IIntercomServiceObject> {
    return new Promise(async resolve => {
      try {
        const { intercom } = this
        const tagToSave = params.tag
        const actionResult = await intercom.tags.tag({
          name: tagToSave,
          companies: [{ company_id: `${params.company_id}` }],
        })
        const companyInfo = actionResult.body
        resolve({
          success: true,
          data: {
            internal_id: params.company_id,
            intercom_id: companyInfo.id,
            result: companyInfo,
          },
        })
      } catch (error) {
        const err = jsonParse(error.message) as IIntercomErrorResponse
        const errorCode =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].code
            : 'unknown_error'
        const errorMessage =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].message
            : `Error when tagging company with id '${params.company_id}' in Intercom`
        resolve({
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            errors: [errorMessage],
            data: {
              internal_id: params.company_id,
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
        const err = jsonParse(error.message) as IIntercomErrorResponse
        const errorCode =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].code
            : 'unknown_error'
        const errorMessage =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].message
            : `Error when creating/updating company with id '${
                companyData.company_id
              }' in Intercom.`
        resolve({
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            errors: [errorMessage],
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
              code: 'validation_failed',
              message: 'The validation of the incoming user object failed',
              errors: validationResult.errors,
              data: {
                internal_id: userData.user_id,
              },
            },
          })
        }
      } catch (error) {
        const err = jsonParse(error.message) as IIntercomErrorResponse
        const errorCode =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].code
            : 'unknown_error'
        const errorMessage =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].message
            : `Error when creating/updating user with id '${userData.user_id}' in Intercom.`
        resolve({
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            errors: [errorMessage],
            data: {
              internal_id: userData.user_id,
            },
          },
        })
      }
    })
  }

  /**
   * Delete a user in Intercom
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
        const err = jsonParse(error.message) as IIntercomErrorResponse
        const errorCode =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].code
            : 'unknown_error'
        const errorMessage =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].message
            : `Error when deleting user with id '${deleteUserParams.user_id}' in Intercom.`
        resolve({
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            errors: [errorMessage],
            data: {
              internal_id: deleteUserParams.user_id,
            },
          },
        })
      }
    })
  }

  private updateUserWithRetry(user: IUserDataObject): Promise<IIntercomServiceObject> {
    return new Promise((resolve, reject) => {
      try {
        const operation = retry.operation()

        operation.attempt(currentAttempt => {
          this.createOrUpdateUser({
            user_id: `${user.user_id}`,
            name: user.name,
            email: user.email,
          }).then(userUpdate => {
            if (operation.retry(userUpdate.error)) {
              return
            }

            if (!userUpdate.success) {
              reject(new Error(userUpdate.error.message))
            } else {
              resolve()
            }
          })
        })
      } catch (error) {
        reject(new Error(error.message))
      }
    })
  }

  public updateUsersInBulk(users: IUserDataObject[]): Promise<IIntercomServiceObject> {
    return new Promise(async resolve => {
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
          await this.updateUserWithRetry(user)
        } catch (error) {
          errors.push(error)
        }
      })
      if (_.size(errors) > 0) {
        resolve({
          success: false,
          error: {
            code: 'operation_error',
            message:
              'The bulk operation experienced errors. See the errors array for more information',
            errors,
          },
        })
      } else {
        resolve({
          success: true,
        })
      }
    })
  }
}
