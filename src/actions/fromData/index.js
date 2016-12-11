import _ from 'underscore'

import {
    SEND_FROM_DATA_REQUEST,
    SEND_FROM_DATA_SUCCESS,
    SEND_FROM_DATA_FAILURE,

    LOAD_FROM_DATA_REQUEST,
    LOAD_FROM_DATA_SUCCESS,
    LOAD_FROM_DATA_FAILURE,
    
} from '../../constants/fromActionTypes'



export function sendFromData(data) {
    return {
        types: [
            SEND_FROM_DATA_REQUEST,
            SEND_FROM_DATA_SUCCESS,
            SEND_FROM_DATA_FAILURE
        ],
        callAPI: q=>q.post(`/api/fromdata`).send(data).end()
    }
    
}


export function loadData(userName) {
    console.log(userName)
    return {
        types: [
            LOAD_FROM_DATA_REQUEST,
            LOAD_FROM_DATA_SUCCESS,
            LOAD_FROM_DATA_FAILURE
        ],
        callAPI: q=>q.get(`/api/loadData`).query({userName:userName}).end()
    }
    
}