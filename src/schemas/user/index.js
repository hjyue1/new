import { createReducer } from '../../helpers';

import {
    REG_USER_REQUEST,
    REG_USER_SUCCESS,
    REG_USER_FAILTRUE,


    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILTRUE,

    VALIDATION_USER_REQUEST,
    VALIDATION_USER_SUCCESS,
    VALIDATION_USER_FAILTRUE,


    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
} from '../../constants/userActionTypes'

const DEFAULT = {}

export default createReducer(DEFAULT, {
    [REG_USER_SUCCESS] : (state, action)=>action.response.body,
    [LOGIN_USER_SUCCESS] : (state, action)=>action.response.body,
    [VALIDATION_USER_SUCCESS] : (state, action)=>action.response.body,
    [LOGOUT_SUCCESS] : (state, action)=>action.response.body,
});
