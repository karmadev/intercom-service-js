import * as _ from 'lodash'

export const jsonParse = (str: string): any => _.attempt(JSON.parse.bind(null, str))
