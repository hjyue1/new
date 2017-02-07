require('babel-polyfill');
var fs = require('fs');
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var mainPath = path.resolve(__dirname, 'src', 'main.js');
var publicPath = path.resolve(__dirname, 'public');






var config = {
	devtool: 'eval',
	entry: {
    main: [
      'webpack-hot-middleware/client?http://localhost:9000/__webpack_hmr',
      // example for single entry point. Multiple Entry bundle example will be added later
      path.join(__dirname, './src/index.js')
    ],
    commons: [
      // configuration for babel6
      'babel-polyfill',
      'redux-router',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-thunk',
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public'),
    chunkFilename: '[name].[chunkhash:5].chunk.js',
    publicPath: '/public/'
  },
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      include: [path.join(__dirname, 'src'),path.join(__dirname, 'bin')],
      loader: "babel",
      exclude: [nodeModulesPath],
      query: {
          plugins: [
            ["react-transform", {
              transforms: [{
                transform: "react-transform-hmr",
                imports: ["react"],
                locals: ["module"]
              }]
            }]
          ]
        }
    },
    { test: /\.css$/, loader: "style!css-loader!less-loader" },
    { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css!autoprefixer-loader?browsers=last 2 version!sass')},
    { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")}
    ]},

 	plugins: [
    new webpack.optimize.CommonsChunkPlugin('commons', 'commons.js'),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true,  // <-------- DISABLE redux-devtools HERE
      'process.env': {'NODE_ENV': `"${process.env.NODE_ENV}"`}
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProgressPlugin(function(percentage, msg) {
      //console.log((percentage * 100) + '%', msg);
    }),
    new ExtractTextPlugin('main.css'),
  ],
  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ["", ".js", ".jsx"],
  },


}

module.exports = config;