import * as crypto from 'crypto'
import * as _ from 'lodash'
import { IUserDataObject } from '../../types'

export const generateRandomUser = (): IUserDataObject => {
  const id = Math.floor(100000000 + Math.random() * 900000000)
  const nameRandomString = crypto.randomBytes(10).toString('hex')
  const email = `${nameRandomString}@intercomtest.life`
  const name = `Intercom Test ${nameRandomString}`
  return {
    user_id: `${id}`,
    email: email,
    name: name,
  }
}

export const generateRandomUsers = (amount: number): IUserDataObject[] => {
  const dummyUsers = []
  for (let i = 0; i < amount; i++) {
    dummyUsers.push(generateRandomUser())
  }
  return dummyUsers
}
