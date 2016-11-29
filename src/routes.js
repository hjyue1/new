import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App from './containers/App'
import Asd from './containers/asd'



export default (store) => {
	//store做来验证登录
	/**
   * Please keep routes in alphabetical order
   */
  return (
  	<Router history={browserHistory}>
	    <Route path="/" component={App}>
	      { /* Home (main) route */ }
	      
	    </Route>

	    <Route path="/asd" component={Asd}>
	    </Route>
    </Router>
  );
}