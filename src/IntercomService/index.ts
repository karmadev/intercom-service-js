import * as Intercom from 'intercom-client'
import * as _ from 'lodash'
import * as RateLimiter from 'request-rate-limiter'
import {
  ICompanyDataObject,
  IUserDataObject,
  IDeleteUserObject,
  IIntercomServiceObject,
  IIntercomServiceConstructorObject,
  ITagCompanyData,
  IIntercomErrorResponse,
  ITagMultipleData,
} from './types'
import { validateDataObject } from './utils/companyDataValidation'
import { jsonParse } from './utils/parseTools'

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
        const fullErr = jsonParse(error)
        const err = fullErr.message as IIntercomErrorResponse
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

  public tagMultiple(params: ITagMultipleData): Promise<IIntercomServiceObject> {
    return new Promise(async resolve => {
      try {
        const { intercom } = this
        const name = params.name
        const actionResult = await intercom.tags.tag({
          name,
          companies: params.companies,
          users: params.users,
        })
        const tag = actionResult.body
        resolve({
          success: true,
          data: {
            result: tag,
          },
        })
      } catch (error) {
        const fullErr = jsonParse(error)
        const err = fullErr.message as IIntercomErrorResponse
        const statusCode = err && err.statusCode ? err.statusCode : -1
        const errorCode =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].code
            : 'unknown_error'
        const errorMessage =
          err && err.body && err.body.errors && err.body.errors[0]
            ? err.body.errors[0].message
            : `Error when creating/updating tags in Intercom.`
        resolve({
          success: false,
          error: {
            statusCode: statusCode,
            code: errorCode,
            message: errorMessage,
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
        const fullErr = jsonParse(error)
        const err = fullErr.message as IIntercomErrorResponse
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
        const fullErr = jsonParse(error)
        const err = fullErr.message as IIntercomErrorResponse
        const statusCode = err && err.statusCode ? err.statusCode : -1
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
            statusCode: statusCode,
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
        const fullErr = jsonParse(error)
        const err = fullErr.message as IIntercomErrorResponse
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

  public updateUsersInBulk(users: IUserDataObject[]): Promise<IIntercomServiceObject> {
    return new Promise(resolve => {
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

      const limiter = new RateLimiter({
        rate: 80,
        interval: 10,
        backoffCode: 429,
        backoffTime: 10,
        maxWaitingTime: 300,
      })

      const errors = []
      _.forEach(users, user => {
        limiter
          .request()
          .then(backoff => {
            this.createOrUpdateUser({
              user_id: `${user.user_id}`,
              name: user.name,
              email: user.email,
            }).then(userUpdate => {
              if (!userUpdate.success) {
                if (_.isEqual(userUpdate.error.statusCode, 429)) {
                  backoff()
                } else {
                  errors.push(userUpdate.error)
                }
              }
              // all went good good with this operation on to the next one
            })
          })
          .catch(error => {
            // the error object is set if the limiter is overflowing or is not able to execute your request in time
            errors.push(error.message)
          })
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
