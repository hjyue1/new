//import { Promise } from 'es6-promise'
import _ from 'underscore'
//import {errorInfo} from 'helpers/totast'

export default function callAPIMiddleware({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            const {
                types,
                callAPI,
                shouldCallAPI = () => true,
                storeKey = '',
                payload = {},
                key  = ''
            } = action;

            let store = getState()

            if (!types) {
                // 普通 action：传递
                return next(action);
            }

            if (
                !Array.isArray(types) ||
                types.length !== 3 ||
                !types.every(type => typeof type === 'string')
            ) {
                throw new Error('Expected an array of three string types.');
            }

            if (typeof callAPI !== 'function') {
                throw new Error('Expected fetch to be a function.');
            }

            if (!shouldCallAPI(store)) {

                return new Promise((resolve, reject)=>{
                    let res = {type:'API_NOT_INVOKE', response : {}}
                        , responseBody = {}
                        , bodyFromStore = store[storeKey]

                    if(_.isArray(storeKey)){
                        bodyFromStore = storeKey.reduce((pre, current)=>pre[current], store)
                    }
                    
                    if(key){
                        responseBody[key] = bodyFromStore
                    }else{
                        responseBody = bodyFromStore
                    }

                    res.response.body = responseBody

                    resolve(res)
                })
            }

            const [requestType, successType, failureType] = types;

            dispatch(Object.assign({}, payload, {
                type: requestType
            }));
            return callAPI(getState.request).then(
                response => dispatch(Object.assign({}, payload, {
                  response: response,
                  type: successType
                })),
                error => { console.log('这里报错了  callApi')
                }
            );
        };
    };
}
