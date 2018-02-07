import { ICompanyDataObject, IUserDataObject, IDeleteUserObject } from '../types'
import { IntercomService } from '../index'
import { generateRandomUsers } from './utils/generateUsers'

const intercomTestAPIToken = ''
const liveTestCompanyId = '546484'
const liveTestUserId = '87465'
const liveTestEmail = 'test.intercom@intercomtest.life'
const liveTestFullName = 'Test McTestson'

describe('#IntercomService createOrUpdateUser() integration test', () => {
  test('should return expected values for valid object', async () => {
    const create = userData => {
      return new Promise(resolve => {
        userData['id'] = '46874613'
        resolve({
          body: userData,
        })
      })
    }
    const MockEffect = {
      users: {
        create,
      },
    }

    const intercom = new IntercomService({ token: 'abc123', MockEffect })

    const createResult = await intercom.createOrUpdateUser({
      user_id: liveTestUserId,
      email: liveTestEmail,
      name: liveTestFullName,
    })
    expect(createResult).toBeDefined()
    expect(createResult.success).toBeTruthy()
    expect(createResult.data.internal_id).toEqual(liveTestUserId)
    expect(createResult.data.intercom_id).toEqual('46874613')
  })
  test('should return expected values for invalid object', async () => {
    const create = userData => {
      return new Promise((resolve, reject) => {
        const errors = JSON.stringify({
          message: {
            body: {
              errors: [
                {
                  code: 'TestErrorCode',
                  message: 'This is a test error text',
                },
              ],
            },
          },
        })
        reject(errors)
      })
    }
    const MockEffect = {
      users: {
        create,
      },
    }

    const intercom = new IntercomService({ token: 'abc123', MockEffect })

    const createResult = await intercom.createOrUpdateUser({
      user_id: liveTestUserId,
      email: liveTestEmail,
      name: liveTestFullName,
    })
    expect(createResult).toBeDefined()
    expect(createResult.success).toBeFalsy()
    expect(createResult.error).toBeDefined()
    expect(createResult.error.code).toEqual('TestErrorCode')
    expect(createResult.error.data).toBeDefined()
    expect(createResult.error.data.internal_id).toEqual(liveTestUserId)
    expect(createResult.error.errors[0]).toEqual('This is a test error text')
  })
})

describe('#IntercomService createOrUpdateUser() LIVE integration test', () => {
  test('should return expected values for valid object', async () => {
    const intercom = new IntercomService({ token: intercomTestAPIToken })
    const userDataData: IUserDataObject = {
      user_id: liveTestUserId,
      email: liveTestEmail,
      name: liveTestFullName,
      companies: [
        {
          company_id: liveTestCompanyId,
        },
      ],
    }
    const createResult = await intercom.createOrUpdateUser(userDataData)
    expect(createResult).toBeDefined()
    expect(createResult.success).toBeTruthy()
    expect(createResult.data.internal_id).toEqual(liveTestUserId)
    expect(createResult.data.intercom_id).toBeDefined()
    expect(createResult.data.result.email).toEqual(liveTestEmail)
    expect(createResult.data.result.name).toEqual(liveTestFullName)
  })
})

describe('#IntercomService createOrUpdateCompany() integration test', () => {
  test('should return expected values for valid object', async () => {
    const create = companyData => {
      return new Promise(resolve => {
        companyData['id'] = '46874613'
        resolve({
          body: companyData,
        })
      })
    }
    const MockEffect = {
      companies: {
        create,
      },
    }

    const intercom = new IntercomService({ token: 'abc123', MockEffect })

    const createResult = await intercom.createOrUpdateCompany({ company_id: '233' })
    expect(createResult).toBeDefined()
    expect(createResult.success).toBeTruthy()
    expect(createResult.data.internal_id).toEqual('233')
    expect(createResult.data.intercom_id).toEqual('46874613')
  })
  test('should return expected values for invalid object', async () => {
    const create = companyData => {
      return new Promise((resolve, reject) => {
        const errors = JSON.stringify({
          message: {
            body: {
              errors: [
                {
                  code: 'TestErrorCode',
                  message: 'This is a test error text',
                },
              ],
            },
          },
        })
        reject(errors)
      })
    }
    const MockEffect = {
      companies: {
        create,
      },
    }

    const intercom = new IntercomService({ token: 'abc123', MockEffect })

    const createResult = await intercom.createOrUpdateCompany({ company_id: '233' })
    expect(createResult).toBeDefined()
    expect(createResult.success).toBeFalsy()
    expect(createResult.error).toBeDefined()
    expect(createResult.error.code).toEqual('TestErrorCode')
    expect(createResult.error.data).toBeDefined()
    expect(createResult.error.data.internal_id).toEqual('233')
    expect(createResult.error.errors[0]).toEqual('This is a test error text')
  })
})

describe('#IntercomService createOrUpdateCompany() LIVE integration test', () => {
  test('should return expected values for valid object', async () => {
    const intercom = new IntercomService({ token: intercomTestAPIToken })
    const companyName = 'Integration Test Company'
    const companyData: ICompanyDataObject = {
      company_id: liveTestCompanyId,
      name: companyName,
      size: 1,
    }
    const createResult = await intercom.createOrUpdateCompany(companyData)
    expect(createResult).toBeDefined()
    expect(createResult.success).toBeTruthy()
    expect(createResult.data.internal_id).toEqual(liveTestCompanyId)
    expect(createResult.data.intercom_id).toBeDefined()
    expect(createResult.data.result.name).toEqual(companyName)
  })
})

describe('#IntercomService deleteUser() integration test', () => {
  test('should return expected values for valid object', async () => {
    const deleteUser = userData => {
      return new Promise(resolve => {
        userData['id'] = '46874613'
        resolve({
          body: userData,
        })
      })
    }
    const MockEffect = {
      users: {
        delete: deleteUser,
      },
    }

    const intercom = new IntercomService({ token: 'abc123', MockEffect })

    const deleteResult = await intercom.deleteUser({
      user_id: liveTestUserId,
    })
    expect(deleteResult).toBeDefined()
    expect(deleteResult.success).toBeTruthy()
    expect(deleteResult.data.internal_id).toEqual(liveTestUserId)
    expect(deleteResult.data.intercom_id).toEqual('46874613')
  })
  test('should return expected values for invalid object', async () => {
    const deleteUser = userData => {
      return new Promise((resolve, reject) => {
        const errors = JSON.stringify({
          message: {
            body: {
              errors: [
                {
                  code: 'TestErrorCode',
                  message: 'This is a test error text',
                },
              ],
            },
          },
        })
        reject(errors)
      })
    }
    const MockEffect = {
      users: {
        delete: deleteUser,
      },
    }

    const intercom = new IntercomService({ token: 'abc123', MockEffect })

    const deleteResult = await intercom.deleteUser({
      user_id: liveTestUserId,
    })
    expect(deleteResult).toBeDefined()
    expect(deleteResult.success).toBeFalsy()
    expect(deleteResult.error).toBeDefined()
    expect(deleteResult.error.code).toEqual('TestErrorCode')
    expect(deleteResult.error.data).toBeDefined()
    expect(deleteResult.error.data.internal_id).toEqual(liveTestUserId)
    expect(deleteResult.error.errors[0]).toEqual('This is a test error text')
  })
})

describe('#IntercomService deleteUser() LIVE integration test', () => {
  test('should return expected values for valid object', async () => {
    const intercom = new IntercomService({ token: intercomTestAPIToken })
    const deleteUserParams: IDeleteUserObject = {
      user_id: liveTestUserId,
    }
    const deleteResult = await intercom.deleteUser(deleteUserParams)
    expect(deleteResult).toBeDefined()
    expect(deleteResult.success).toBeTruthy()
    expect(deleteResult.data.internal_id).toEqual(liveTestUserId)
  })
})

describe('#IntercomService tagCompany() integration test', () => {
  test('should return expected values for valid object', async () => {
    const tag = tagData => {
      return new Promise(resolve => {
        tagData['id'] = '646481'
        tagData['type'] = 'tag'
        tagData['name'] = 'test tag'
        resolve({
          body: tagData,
        })
      })
    }
    const MockEffect = {
      tags: {
        tag,
      },
    }

    const intercom = new IntercomService({ token: 'abc123', MockEffect })

    const tagResult = await intercom.tagCompany({
      company_id: '1234',
      tag: 'test tag',
    })
    expect(tagResult).toBeDefined()
    expect(tagResult.success).toBeTruthy()
    expect(tagResult.data.internal_id).toEqual('1234')
    expect(tagResult.data.intercom_id).toEqual('646481')
  })
  test('should return expected values for invalid object', async () => {
    const tag = tagData => {
      return new Promise((resolve, reject) => {
        const errors = JSON.stringify({
          message: {
            body: {
              errors: [
                {
                  code: 'TestErrorCode',
                  message: 'This is a test error text',
                },
              ],
            },
          },
        })
        reject(errors)
      })
    }
    const MockEffect = {
      tags: {
        tag,
      },
    }

    const intercom = new IntercomService({ token: 'abc123', MockEffect })

    const tagResult = await intercom.tagCompany({
      company_id: '1234',
      tag: 'test tag',
    })
    expect(tagResult).toBeDefined()
    expect(tagResult.success).toBeFalsy()
    expect(tagResult.error).toBeDefined()
    expect(tagResult.error.code).toEqual('TestErrorCode')
    expect(tagResult.error.data).toBeDefined()
    expect(tagResult.error.data.internal_id).toEqual('1234')
    expect(tagResult.error.errors[0]).toEqual('This is a test error text')
  })
})

describe('#IntercomService tagCompany() LIVE integration test', () => {
  test('should return expected values for valid object', async () => {
    const intercom = new IntercomService({ token: intercomTestAPIToken })
    const tagResult = await intercom.tagCompany({
      company_id: liveTestCompanyId,
      tag: 'tested',
    })
    expect(tagResult).toBeDefined()
    expect(tagResult.success).toBeTruthy()
    expect(tagResult.data.internal_id).toEqual(liveTestCompanyId)
    expect(tagResult.data.intercom_id).toBeDefined()
  })
})

/* describe('#IntercomService updateUsersInBulk() LIVE integration test', () => {
  test('dont know what will happen...', async () => {
    const intercom = new IntercomService({ token: intercomTestAPIToken })
    const users = generateRandomUsers(100)
    // console.log('users', users)
    const updateResult = await intercom.updateUsersInBulk(users)
    expect(updateResult).toBeDefined()
    expect(updateResult.success).toBeTruthy()
  })
}) */
