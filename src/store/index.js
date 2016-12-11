import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
//import { useBasename, createHistory } from 'history';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import routes from '../routes'
import rootReducer from '../reducers';
import callAPIMiddleware from '../middlewares/callApi';
import applyRequestMiddleware from '../middlewares/applyRequest';

const history = createBrowserHistory()

const finalCreateStore = compose(
    applyMiddleware(thunkMiddleware, callAPIMiddleware),
    reduxReactRouter({
        routes,
        history
    }),
    applyRequestMiddleware()
)(createStore);

export default function configureStore(initialState) {
    const store = finalCreateStore(rootReducer, initialState);
    return store;
}
