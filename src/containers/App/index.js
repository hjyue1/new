import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { validation } from '../../actions/login'

import 'antd/dist/antd.less'
import './index.less'

class App extends Component {
    static propTypes = {
    }

    async componentWillMount() {
        let r = await this.props.dispatch(validation())
        if (!this.props.user.userName) {
            browserHistory.push('/login')
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
