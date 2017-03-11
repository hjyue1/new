import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { logout } from 'actions/login'
import { Link, browserHistory } from 'react-router'
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './index.less'


class Header extends Component {
    static propTypes = {
    }

    state = {
        current: 'setting',
    }

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
        current: e.key,
        });
    }

    componentWillMount() {
        
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
            <div className='header'>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="setting">
                        <Icon type="setting" />爬取设置1
                    </Menu.Item>
                    <Menu.Item key="app" disabled>
                        <Icon type="appstore" />Navigation Two
                    </Menu.Item>
                    <Menu.Item key="setting2" disabled>
                        <Icon type="setting" />爬取设置2
                    </Menu.Item>
                    <Menu.Item key="exit">
                        <a href='javascript:' onClick={this.handleLogout}>退出登录</a>
                    </Menu.Item>
                </Menu> 
            </div>
        )
    }
}


export default connect(state=>state)(Header)
