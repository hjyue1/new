import {
    REG_USER_REQUEST,
    REG_USER_SUCCESS,
    REG_USER_FAILTRUE,
    
} from '../../constants/userActionTypes'

import _ from 'underscore'


export function regUser(data) {
    console.log(data)
    return {
        types: [
            REG_USER_REQUEST,
            REG_USER_SUCCESS,
            REG_USER_FAILTRUE
        ],
        callAPI: q=>q.post(`/api/reg`).send(data).end()
    }
    
}
