require('../server.babel');
var path = require('path');
var fs = require('fs');
var http = require('http');
var express = require('express');
var webpack = require('webpack');
var React = require('react');
var ReactDOM =  require('react-dom/server');
var Html = require('../src/helpers/Html').default;


global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';


var app = express();

if (__DEVELOPMENT__) {
  //测试环境
  console.log('测试环境')
  var config = require('../webpack.config');
  var compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));


} else{
  console.log('生产环境')
  //生产环境
  var config = require('../webpack.prod.config');
  var compiler = webpack(config);
  compiler.run(function(){})
}

const server = new http.Server(app);
const index = '<!doctype html>\n' +
      ReactDOM.renderToString(<Html/>);
app.use('/public', express.static(path.join(__dirname, '../public')));


app.get('/', function(req, res) {
  res.status(200).send(index);
});

app.get('*', function(req, res) {
  res.status(404).send('Server.js > 404 - Page Not Found');
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