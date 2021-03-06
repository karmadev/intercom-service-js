export interface IIntercomServiceObject {
  success: boolean
  data?: {
    internal_id?: string
    intercom_id?: string
    result: {
      [propName: string]: any
    }
  }
  error?: {
    statusCode?: number
    code: string
    message: string
    errors?: string[]
    data?: {
      internal_id: string
    }
    originalError?: any
  }
}

export interface IIntercomErrorResponse {
  statusCode: number
  body: {
    type: string
    request_id: string
    errors: [
      {
        code: string
        message: string
      }
    ]
  }
  headers: object
  request: object
}

export interface ICompanyDataObject {
  company_id: string
  remote_created_at?: string
  name?: string
  monthly_spend?: number
  plan?: string
  size?: number
  website?: string
  industry?: string
  custom_attributes?: object
}

export interface IUserDataObject {
  user_id: string
  email: string
  name?: string
  phone?: string
  website?: string
  companies?: object[]
  signed_up_at?: string
  last_request_at?: string
  last_seen_ip?: string
  last_seen_user_agent?: string
  unsubscribed_from_emails?: boolean
  update_last_request_at?: boolean
  new_session?: boolean
  custom_attributes?: object
}

export interface ITagCompanyData {
  company_id: string
  tag: string
}

export interface ICompanyTag {
  company_id: string
  id?: string
  untag?: boolean
}
export interface IUserTag {
  user_id: string
  email?: string
  id?: string
  untag?: boolean
}
export interface ITagMultipleData {
  companies: ICompanyTag[]
  users: IUserTag[]
  name: string
}

export interface IIntercomValidationResultObject {
  validated: boolean
  errors: string[]
}

export interface IIntercomServiceConstructorObject {
  token: string
  MockEffect?: any
}

export interface IDeleteUserObject {
  user_id: string
}
