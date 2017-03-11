import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { validation } from '../../actions/login'
import { Spin, Alert } from 'antd';
// import 'antd/dist/antd.less'
import './index.less'

class App extends Component {
    static propTypes = {
    }

    state = {
    }

    async componentWillMount() {
        let r = await this.props.dispatch(validation())
        if (r.response.body.code != 200) {
            browserHistory.push('/login')
        }else {
            
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }


    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}


export default connect(state=>state)(App)
