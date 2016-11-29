import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectReddit, fetchPostsIfNeeded, invalidateReddit } from '../actions'
import GetCrawlerInfoForm from '../components/getCrawlerInfoForm'

import 'antd/dist/antd.less'


class App extends Component {
    static propTypes = {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }


    render() {
    return (
        <GetCrawlerInfoForm/>
    )
    }
}


export default connect(state=>state)(App)
