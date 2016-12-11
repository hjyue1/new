import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { logout } from '../../actions/login'

import GetCrawlerInfoForm  from '../getCrawlerinfoForm'



class Home extends Component {
    static propTypes = {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    handleLogout = async (e) => {
        let {dispatch} = this.props;
        let r = await dispatch(logout());
        r.response.body.code == 200 && browserHistory.push('/login')

    }


    render() {
        let {user} = this.props;

        return (
            <div>
                {user.userName ?
                    <div>
                        <a href='javascript:' onClick={this.handleLogout}>退出登录</a>
                        <GetCrawlerInfoForm />
                    </div>
                    :
                    <div>
                        <a href='/login' >请先登录</a>
                    </div>
                }
            </div>
        )
    }
}


export default connect(state=>state)(Home)
