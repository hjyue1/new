import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'
import getRoutes from './routes'
import configureStore from './store'
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    {getRoutes}
  </Provider>,
  document.getElementById('main')
);
