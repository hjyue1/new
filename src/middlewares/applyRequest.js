import { _request } from '../helpers';

export default function(req){
    return (next) => (reducer, initialState) => {
        const store = next(reducer, initialState)
        store.getState.request = _request({req})
        return store;
    }
}