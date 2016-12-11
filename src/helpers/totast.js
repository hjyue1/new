import React from 'react';
import { message } from 'antd';
import { exception } from 'helpers';

export default function(input, success, callback){

    if(input.hasOwnProperty('status') && input.status !== 200) input.error = Object.assign({}, input)

    if(input.response && input.response.status === 200){
        message.success(success);
        typeof callback === 'function' && callback()
    }else if(input.error){
        message.error(exception(input));
    }else{
        message.success(success);
        typeof callback === 'function' && callback()
    }
}

export function success(str){
    message.success(str);
}


export function error(input){
    message.error(exception(input));
}

export function errorInfo(str){
    message.error(str);
}

export function errorText(text){
    message.error(text);
}
