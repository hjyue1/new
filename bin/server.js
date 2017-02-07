require('../server.babel');
var path = require('path');
var fs = require('fs');
var http = require('http');
var express = require('express');
var webpack = require('webpack');
var React = require('react');
var ReactDOM =  require('react-dom/server');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//mongodb数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/liudo_crawler');
var MongoStore = require('connect-mongo')(session);


var Html = require('../src/helpers/Html').default;
var api = require('../api/routes');


global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';


var app = express();

if (__DEVELOPMENT__) {
  //测试环境
  console.log('测试环境')
  var config = require('../webpack.config');
  var compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  }));
  app.use(require('webpack-hot-middleware')(compiler));


} else{
  console.log('生产环境')
  //生产环境
  var config = require('../webpack.prod.config');
  var compiler = webpack(config);
  compiler.run(function(err, stats){
    console.log(stats.toString({
      colors: true,
      chunks: false
    }))
  })
}

const server = new http.Server(app);
const index = '<!doctype html>\n' +
      ReactDOM.renderToString(<Html/>);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'liudo_session', //为了安全性的考虑设置secret属性
  cookie: {maxAge: 1000*60*60}, //设置过期时间
  resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true
  saveUninitialized: false, //
  store: new MongoStore({
    url: 'mongodb://localhost/liudo_crawler',
    touchAfter: 1000*60*60 // time period in seconds
  })
}));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use('/api', api)
app.get('*', function(req, res) {
  res.status(200).send(index);
});
app.get('/', function(req, res) {
  res.status(200).send(index);
});

app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);
  res.status(500).send("Server error");
});

process.on('uncaughtException', evt => {
  console.log('uncaughtException ', evt);
});

server.listen('9000', (err) => {
  if (err) {
    console.error(err);
  }
  console.info('==> 💻  Open http://%s:%s in a browser to view the app.', 'localhost', '9000');
});