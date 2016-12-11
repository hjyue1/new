import _ from 'underscore'
import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILTRUE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    VALIDATION_USER_REQUEST,
    VALIDATION_USER_SUCCESS,
    VALIDATION_USER_FAILURE,
    
} from '../../constants/userActionTypes'



export function validation() {
    
    return {
        types: [
            VALIDATION_USER_REQUEST,
            VALIDATION_USER_SUCCESS,
            VALIDATION_USER_FAILURE
        ],
        callAPI: q=>q.post(`/api/validation`).end()
    }
    
}

export function login(data) {
    
    return {
        types: [
            LOGIN_USER_REQUEST,
            LOGIN_USER_SUCCESS,
            LOGIN_USER_FAILTRUE
        ],
        callAPI: q=>q.post(`/api/login`).send(data).end()
    }
    
}

export function logout() {
    return {
        types: [
            LOGOUT_REQUEST,
            LOGOUT_SUCCESS,
            LOGOUT_FAILURE
        ],
        callAPI: q=>q.post(`/api/logout`).send({timestamp: new Date()}).end()
    }
}