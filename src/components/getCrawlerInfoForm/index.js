import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
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
} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class GetCrawlerInfoForm extends Component {
    static propTypes = {}

    state ={
        select_web: ['smzdm'], //关注的网站
        frequency: 1, //监控的频率
        waitTime: 30, //等待超时的时间
        notice: true, //是否通知手机
        cycleTime: 1, //关注的周期
    }

    handleSubmit=(e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                }
            });
        }
    //关注时间周期
    handleCycleTime =(value)=>{
        this.setState({
          cycleTime: value,
        });
    }
    handleCycleTime2 =(value)=>{
        this.props.form.setFieldsValue({'cycle': value})
        this.setState({
          cycleTime: value,
        });
    }
    //是否手机通知
    handleNotice=(value) =>{
        this.setState({
            notice: value
        })
    }

    normFile=(e) =>{
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        };
        const {select_web, frequency, waitTime, notice, cycleTime} =this.state;

        return ( 
            <Form horizontal onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="关注的网站">
                    {getFieldDecorator('select-web', {rules: [{ required: true, message: '选择错误', type: 'array'}],initialValue: select_web})(
                        <Select multiple placeholder="选择您要关注订阅的网站">
                            <Option value="smzdm">什么值得买</Option>
                            <Option value="msd">买手党</Option>
                            <Option value="gd">逛丢</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="监控的频率">
                    {getFieldDecorator('frequency', { initialValue: frequency })(
                        <InputNumber min={1} max={100000} />
                    )}
                    <span className="ant-form-text"> 分钟/次</span>
                </FormItem>

                <FormItem {...formItemLayout} label="超时时间">   
                    <span className="ant-form-text">等待</span>
                    {getFieldDecorator('waitTime', { initialValue: waitTime })(
                        <InputNumber min={1} max={100} />
                    )}
                    <span className="ant-form-text"> S</span>
                </FormItem>

                <FormItem {...formItemLayout} label="是否手机通知">
                    {getFieldDecorator('notice', { valuePropName: 'checked',initialValue: notice })(
                        <Switch checkedChildren={'开'} unCheckedChildren={'关'} onChange={this.handleNotice}/>
                    )}
                </FormItem>

                {notice &&
                    <FormItem {...formItemLayout} label="手机号码">
                        {getFieldDecorator('iphoneNumber', {rules: [{ required: true, message: '请输入手机号码!',len:11 }]})(
                            <Input />
                        )}
                    </FormItem>
                }
                
                <FormItem {...formItemLayout} label="关注周期">   
                    <div>
                        <Col span={18}>
                            {getFieldDecorator('cycle', {initialValue:cycleTime})(
                                <Slider marks={{ 7: '一周', 15: '半月', 30: '一月', 100: '一百天'}} onChange={this.handleCycleTime} />
                            )}
                        </Col>
                        <Col span={4}>
                            <InputNumber min={1} max={100} style={{ width: '100%' }} value={cycleTime} onChange={this.handleCycleTime2} />
                        </Col>
                        <Col span={2}>
                            <span className="ant-form-text" style={{ width: '100%', distextAlign: 'center' }}>天</span>
                        </Col>
                    </div>
                </FormItem>

                <FormItem {...formItemLayout} label="关键词">
                    {getFieldDecorator('keywords', {rules: [{ required: true, message: '请输入搜索的关键词!' }]})(
                        <Input />
                    )}
                </FormItem>

                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                  <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
            </Form>
        )
    }
}



export default connect(state =>state)(Form.create()(GetCrawlerInfoForm))
