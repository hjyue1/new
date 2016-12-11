import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { login } from '../../actions/login'
import './index.less'
const FormItem = Form.Item;


class Longin extends Component {
    static propTypes = {}

    state ={
    }

    handleSubmit=(e)=> {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let r = await this.props.dispatch(login(values))
                r.response.body.code == 200 ?   browserHistory.push('/') : alert(r.response.body.msg)

            }
        });
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='login'>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                      {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                      })(
                        <Input addonBefore={<Icon type="user" />} placeholder="Username" />
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                      })(
                        <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(
                        <Checkbox>记住我</Checkbox>
                      )}
                      <a className="login-form-forgot">忘记密码</a>
                      <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                      </Button>
                      <Link to='/reg'>去注册！</Link>
                    </FormItem>
                </Form>
            </div>
        );
    }
}



export default connect(state =>state)(Form.create()(Longin))
