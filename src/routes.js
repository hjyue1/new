import React from 'react';
import {Router,  Route, browserHistory, IndexRoute } from 'react-router';

import App from './containers/App'
// import Login from './components/login'
// import Reg from './components/reg'
import Home from './components/home'

export default (
	//store做来验证登录
	/**
   * Please keep routes in alphabetical order
   */
  	<Router history={browserHistory}>
	    <Route path="/" component={App}>
            <IndexRoute component={ Home }/>
	        <Route path="login" 
                getComponent={
                    (location, callback) => { 
                        require.ensure([], require => {
                            callback(null, require('./components/login').default)
                        }, 'Login')
                    }
                }
            />
	        <Route path="reg" 
                getComponent={
                    (location, callback) => {
                        require.ensure([], require => {
                            callback(null, require('./components/reg').default)
                        }, 'Reg')
                    }
                }
            /> 
	    </Route>
    </Router>
) 