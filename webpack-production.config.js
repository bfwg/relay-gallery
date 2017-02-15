const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, './static');
const nodeModulesPath = path.resolve(__dirname, './node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {
  entry: [path.join(__dirname, './frontend/src/app/app.jsx')],
  resolve: {
    //When require, do not have to add these extensions to file's name
    extensions: ['', '.js', '.jsx'],
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //Render source-map file for final build
  devtool: 'source-map',
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: 'app.js',  //Name of output file
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      },
    }),
    new webpack.optimize.DedupePlugin(),
    //Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        //supresses warnings, usually from module minification
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Transfer Files
    new TransferWebpackPlugin([
      {from: 'images', to: 'images'},
      {from: 'css', to: 'css'},
    ], path.resolve(__dirname, './frontend/src/www')),
  ],
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, './frontend/src/app')],
        exclude: [nodeModulesPath],
      },
    ],
    loaders: [
      {
        //React-hot loader and
        test: /\.(js|jsx)$/,  //All .js and .jsx files
        loaders: ['react-hot', 'babel'], //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },

    ],
  },
  //Eslint config
  eslint: {
    configFile: '.eslintrc', //Rules for eslint
  },
};

module.exports = config;
