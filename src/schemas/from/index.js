import { createReducer } from '../../helpers';

import {
    LOAD_FROM_DATA_REQUEST,
    LOAD_FROM_DATA_SUCCESS,
    LOAD_FROM_DATA_FAILURE,
} from '../../constants/fromActionTypes'

const DEFAULT = {}

export default createReducer(DEFAULT, {
    [LOAD_FROM_DATA_SUCCESS] : (state, action)=>action.response.body,
});
