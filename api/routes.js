var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var User = require('../mongodb/mongodbConfig').user;
var from = require('./fromData');
var userShuju = require('../mongodb/mongodbConfig').userShuju;
// var createData = require('./fromData').createData;
// /*login*/
// api.get('/', function(req, res) {
//   if (req.session) {//检查用户是否已经登录，如果已登录展现的页面
//     console.log(req.session);//打印session的值
//   } else {//否则展示index页面
//     res.send({title:'hello'})
//   }
// });

//用户登录
api.post('/login', function(req, res) {
  console.log('收到登录post');

  var query_doc = {userName: req.body.userName};
  console.log(query_doc)
  User.find({userName: req.body.userName},function(err, docs){
    console.log('err是'+err);
    console.log(docs)
    if(!err && docs.length >0) {
      console.log(docs);
      console.log(docs[0].password);
      console.log(req.body.password);
      if(docs!='' && docs[0].password == req.body.password){
        console.log(docs);
        console.log('登录成功');
        req.session.sign = true;
        req.session.userName = req.body.userName;
        res.send({code:'200', msg:'登录成功', userName:docs[0].userName})
      } else{
        console.log('用户名或密码不正确');
        return res.send({code:'400',msg:'用户名或密码不正确'})
      }

    }else{
      return res.send({code:'400',msg:'用户名或密码不正确'})
      console.log("Something happend.");
    }
  });
});

//用户注册
api.post('/reg', function(req, res) {
  console.log('收到注册post');
  var queryid= {userName: req.body.userName};
  console.log(queryid);
  User.find(queryid,function(err, docs){
    console.log(err);
    if(docs.length>0) {
      console.log(docs);
      console.log('注册失败-账户已注册');
      res.send({ code: '400' ,msg:'注册失败-账户已注册'});
    }else {
      var reg=new User();
      reg.userName= req.body.userName;
      reg.password= req.body.password;
      console.log('密码是'+req.body.password);
      reg.save(function(err, docs){
        if(!err) {
          if(docs!=''){
            console.log(docs);
            console.log('注册成功');
            req.session.sign = true;
            req.session.userName = req.body.userName;
            console.log('session是:'+req.session);
            from.createData(req.body.userName).then((resolve)=>{
              return res.send({code:'200', msg:'注册成功', userName:docs.userName})
            })
          } else{
            console.log('注册失败');
            return res.send({code:'400', msg:'注册失败'})
          }

        }else{
          console.log("失败");
        }
      });
    }
  });
});


//验证用户身份（session）
api.post('/validation', function(req, res) {
  console.log('验证用户身份（session）');
  console.log(req.session.userName)
  var queryid= {userName: req.session.userName};
  console.log(queryid);
  if(req.session.userName) {
    User.find(queryid,function(err, docs){
      console.log(err);
      if(docs.length>0) {
        console.log(docs);
        console.log('登录成功');
        res.send({ code: '200', msg:'验证成功', userName: docs[0].userName});
      }
    });
  }else {
    res.send({ code: '400', msg:'验证失败' });
  } 
});


//退出登录
api.post('/logout', function(req, res) {
  console.log(req.session.userName+'登出,时间:'+req.body.timestamp);
  req.session.destroy();
  res.send({ code: '200', msg:'登出成功' });
});

//保存表单数据
api.post('/fromdata', function(req, res) {
  from.fromData(req, res);
});


//加载表单数据
api.get('/loadData', function(req, res) {
  from.loadData(req, res);
});





module.exports = api;
