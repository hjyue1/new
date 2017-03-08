import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { sendFromData , loadData } from '../../actions/fromData'

import {
    Form,
    Select,
    InputNumber,
    Switch,
    Radio,
    Slider,
    Button,
    Upload,
    Icon,
    Input,
    Col,
    message,
} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class GetCrawlerInfoForm extends Component {

    state ={
        loadData: false,
        select_web: ['msd'], //关注的网站
        waitTime: 30, //等待超时的时间
        notice: true, //是否通知手机
        keywords: '', //搜索关键词
        iphoneNumber: '', //手机号码
    }

    handleSubmit=(e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                values.keywords = values.keywords.split(",");
                values.userName = this.props.user.userName;
                let r = await this.props.dispatch(sendFromData(values));
                if(r.response.body.code == 200) {
                    message.success('保存成功')
                }else {
                    message.error('保存失败，状态码:' + r.response.body.code)
                }
            }
        });
    }

    handleState =(key, value)=>{
        this.setState({
          [key]: value,
        });
    }
        //关注时间周期
    // handleCycleTime =(value)=>{
    //     this.props.form.setFieldsValue({'cycleTime': value})
    //     this.setState({
    //       cycleTime: value,
    //     });
    // }
 
    normFile=(e) =>{
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    async componentWillMount() {
        let { dispatch, user} = this.props;
        let r = await dispatch(loadData(user.userName))
        let {select_web, waitTime, notice,  keywords, iphoneNumber} = r.response.body[0]; //数组
        this.setState({
            select_web,
            waitTime,
            notice,
            keywords,
            iphoneNumber,
            loadData:true})
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let {loadData} =this.state;
        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        };
        let {select_web, waitTime, notice, keywords, iphoneNumber} =this.state;
        keywords = keywords && keywords.join(',') ;
        return ( 
            <div>
                {loadData ? 
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label="关注的网站">
                            {getFieldDecorator('select_web', {rules: [{ required: true, message: '选择错误', type: 'array'}],initialValue: select_web})(
                                <Select multiple placeholder="选择您要关注订阅的网站">
                                    <Option value="msd">买手党</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label="超时时间">   
                            <span className="ant-form-text">等待</span>
                            {getFieldDecorator('waitTime', { initialValue: waitTime })(
                                <InputNumber min={1} max={99999999} />
                            )}
                            <span className="ant-form-text"> S</span>
                        </FormItem>

                        <FormItem {...formItemLayout} label="是否手机通知">
                            {getFieldDecorator('notice', { valuePropName: 'checked',initialValue: notice })(
                                <Switch checkedChildren={'开'} unCheckedChildren={'关'} onChange={this.handleState.bind(this, 'notice')}/>
                            )}
                        </FormItem>

                        {notice &&
                            <FormItem {...formItemLayout} label="手机号码">
                                {getFieldDecorator('iphoneNumber', {rules: [{ required: true, message: '请输入手机号码!',len:11 }], initialValue:iphoneNumber})(
                                    <Input />
                                )}
                            </FormItem>
                        }
                        
                        <FormItem {...formItemLayout} label="关键词">
                            {getFieldDecorator('keywords', {rules: [{ required: true, message: '请输入搜索的关键词!' }], initialValue:keywords})(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                          <Button type="primary" htmlType="submit">Submit</Button>
                        </FormItem>
                    </Form>
                    :
                    <div>等待加载</div>
                }
            </div>
            
        )
    }
}



export default connect(state =>state)(Form.create()(GetCrawlerInfoForm))
