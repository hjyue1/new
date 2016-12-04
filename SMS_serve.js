

var request = require('request');
var randomstring = require("randomstring");
var crypto = require('crypto-browserify');
var urlencode = require('urlencode');

let sendAliMessage = function(Obj, k){ 
    var param = { 
        'Action'            : 'SingleSendSms', 
        'SignName'          : 'liudo网',                         //短信签名名称 
        'TemplateCode'      : 'SMS_32445127', 
        'RecNum'            : '13138140235',                  //手机号 
        'ParamString'       : JSON.stringify({"k":k,"webName":Obj.web_name}),//验证码模板里的变量 
        'Version'           : '2016-09-27', 
        'Format'            : 'JSON', 
        'AccessKeyId'       : 'LTAIGdaxOjeCOiJ4', 
        'SignatureMethod'   : 'HMAC-SHA1', 
        'SignatureVersion'  : '1.0', 
        'SignatureNonce'    : randomstring.generate(9),                   //随机数 
        'Timestamp'         : new Date().toISOString(), 
    }; 
     
    param.Signature = signForAliMessage(param, 'ShUJbqDPu3q9y7X0ujdNz4p9D54VSB'); 
    var api_url = 'https://sms.aliyuncs.com/'; 
 
    request.post({ 
        url: api_url, 
        headers: { 
            'Content-Type':'application/x-www-form-urlencoded' 
        }, 
        form:param 
    },function(err,response,data){ 
        data = JSON.parse(data); 
        console.log(data)
        if (!err && data.Model) { 
            console.log('短信发送成功')
        }else{ 
 
 
            console.log('短信发送失败')
        } 
 
 
    }); 
} 
 
/*签名方法*/ 
let signForAliMessage = function(src_sign,access_key_secret){ 
    let param , qstring = []; 
    let oa = Object.keys(src_sign).sort() , on = {}; 
    for(let i=0;i<oa.length;i++){ 
        on[oa[i]] = src_sign[oa[i]]; 
    } 
    param = on; 
    for(let key in param){ 
        qstring.push(urlencode(key)+'='+urlencode(param[key])); 
    } 
    qstring = qstring.join('&'); 
    let StringToSign = 'POST'+'&'+urlencode('/')+'&'+urlencode(qstring); 
    access_key_secret = access_key_secret+'&'; 
    let signature = crypto.createHmac('sha1', access_key_secret).update(new Buffer(StringToSign, 'utf-8')).digest('base64'); 
    return signature; 
} 
export default sendAliMessage