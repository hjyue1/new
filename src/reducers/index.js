import { routerStateReducer } from 'redux-router';
import { combineReducers } from 'redux';

import user from '../schemas/user';
import fromData from '../schemas/from';

// import departments from 'schemas/department';
// members
// orders

export default combineReducers({
    router: routerStateReducer,
    user,
    fromData
});