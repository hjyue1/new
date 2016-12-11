import { createReducer } from '../../helpers';

import {
    SEND_FROM_DATA_REQUEST,
    SEND_FROM_DATA_SUCCESS,
    SEND_FROM_DATA_FAILURE,
    
    LOAD_FROM_DATA_REQUEST,
    LOAD_FROM_DATA_SUCCESS,
    LOAD_FROM_DATA_FAILURE,
} from '../../constants/fromActionTypes'

const DEFAULT = {}

export default createReducer(DEFAULT, {
    [SEND_FROM_DATA_SUCCESS] : (state, action)=>action.response.body,
    [LOAD_FROM_DATA_SUCCESS] : (state, action)=>action.response.body,
});
