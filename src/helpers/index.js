//import { Promise } from 'es6-promise';
import superagent  from 'superagent';
import  agent  from './request';
import React from 'react';
import { History, RouteContext } from 'react-router'
import cookie from './cookie';
import ua from './ua';

const SEND = superagent.Request.prototype.send
const END = superagent.Request.prototype.end

export function getCsrfToken(){
    let csrftoken = cookie('csrf') || '';

    if(!csrftoken){
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
            , maxPos = $chars.length;

        for (let i = 0; i < 32; i++) {
        　　csrftoken += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        cookie('csrf', csrftoken, { path: '/' })
    }

    return csrftoken;
}

/**
 * SuperAgent
 */
export function _request(options){
    let request = agent(superagent, Promise)
    if(typeof document === 'undefined' && options && options.req &&  options.req.header){
          superagent.Request.prototype.send = SEND
          let _r = {}

          for(let key in request){
              _r[key] = function(){
                  let req = request[key].apply(request, arguments)
                  req.set(options.req.header)
                  return req
              }
          }

          return _r;

    }else{
        /*superagent.Request.prototype.send = function(data){
            //let _data = Object.assign(data || {}, { csrfmiddlewaretoken : getCsrfToken() })
            return SEND.call(this, _data);
        }*/
        //注入跨域
        superagent.Request.prototype.end = function(fn){
            this.withCredentials();
            if(~['POST', 'DELETE', 'PUT'].indexOf(this.method)){
                this.send({ csrfmiddlewaretoken : getCsrfToken() })
            }

            return END.call(this, fn);
        }
    }

    return request
}

/**
 * Reducers 生成工厂函数
 *
 * @params {mix} initialState 默认 state
 * @params {object} handers reduces 的 action 处理
 */
export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
      if (handlers.hasOwnProperty(action.type)) {
          return handlers[action.type](state, action);
      } else {
          return state;
      }
  }
}

export function parseUrl( url ) {
    var a = document.createElement('a');
    a.href = url;
    return a;
}

export function loginUri(cb) {
        var ext = ''
        if (cb) ext = '?cb=' + encodeURIComponent(cb)
        return window.location.protocol + '//account.wps.cn/' + ext
    }

export function connectHistory(Component) {
    return React.createClass({
        mixins: [ History, RouteContext ],
        render() {
            return <Component {...this.props} history={this.history} />
        }
    })
}

export function keys(items, primary, prifix=''){

    if(!primary) throw Error('need a primary key!');
    return items.map(function(item){
        let _item = Object.assign({}, item)
        if(!_item.hasOwnProperty('key')) _item.key = `${prifix}_${_item[primary]}`

        return _item
    })
}


export function cx(classNames) {
    if (typeof classNames === 'object') {
        return Object.keys(classNames).filter(function(className) {
            return classNames[className];
        }).join(' ');
    } else {
        return Array.prototype.join.call(arguments, ' ');
    }
}

export function trim(str, charlist) {

    var whitespace, l = 0,
        i = 0;
        str += '';

    if (!charlist) {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

export let request = _request();