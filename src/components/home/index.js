import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

import GetCrawlerInfoForm  from '../getCrawlerInfoForm'
import Header from './header'
import { Spin, Alert } from 'antd';

import './index.less'

class Home extends Component {
    static propTypes = {
    }

    state = {
        loading: true
    }

    async componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        let {user} = this.props;

        return (
            <div>
                {!user.userName ?
                    <div className="Loading">
                        <Spin size="large">
                        </Spin>
                    </div>
                    :
                    <div>
                        <Header />
                        <GetCrawlerInfoForm />
                    </div>

                }
            </div>
        )
    }
}


export default connect(state=>state)(Home)
