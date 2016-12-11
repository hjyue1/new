import React from 'react';
import {Router,  Route, browserHistory, IndexRoute } from 'react-router';

import App from './containers/App'
import Login from './components/login'
import Reg from './components/reg'
import Home from './components/home'

export default (
	//store做来验证登录
	/**
   * Please keep routes in alphabetical order
   */
  	<Router history={browserHistory}>
	    <Route path="/" component={App}>
            <IndexRoute component={ Home }/>
	      <Route path="login" component={Login}/>  
	      <Route path="reg" component={Reg}/> 
	    </Route>
    </Router>
) 