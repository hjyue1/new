var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var User = require('../mongodb/mongodbConfig').user;
var userShuju = require('../mongodb/mongodbConfig').userShuju;
// /*login*/
// api.get('/', function(req, res) {
//   if (req.session) {//检查用户是否已经登录，如果已登录展现的页面
//     console.log(req.session);//打印session的值
//   } else {//否则展示index页面
//     res.send({title:'hello'})
//   }
// });


const fromData = (req, res) => {
  console.log('收到表单数据');
  var data = req.body
  userShuju.update({userName:data.userName}, data , {safe : true, upsert : true}, (err, doc)=> {
    if (err) {console.log('更新表单数据错误')};
    console.log('更新表单数据*成功*')
    res.send({code:'200', msg:'表单保存成功'})
  })
};

const loadData = (req, res) => {
    console.log('加载用户'+req.query.userName+'的表单数据');
    if (req.session.userName == req.query.userName) {
        userShuju.find({userName: req.query.userName}, (err,docs)=>{
            if (err) {return console.log('加载出错了')}
            if(docs.length>0) {
                res.send(docs)
            }else{
                console.log('没有搜索到')
                res.send('没有数据')
            }
        })
    }else {
        res.send('session不通过')
    }

}


const createData = (userName, docs) => {
    console.log(userName)
    let data = new userShuju();
        data.userName=userName
        data.select_web= []
        data.frequency=''
        data.waitTime=''
        data.notice=true
        data.cycleTime=''
        data.keywords=[]
        data.iphoneNumber=''
    return new Promise((resolve, reject)=>{
        data.save((err,docs)=>{
            if (!err) {
                if(docs != '') {
                    console.log('createData保存成功')
                    resolve(docs)
                }else{
                    console.log('没有搜索到')
                    reject()
                }
            }
        })
    })

}



exports.fromData = fromData;
exports.loadData = loadData;
exports.createData = createData;
