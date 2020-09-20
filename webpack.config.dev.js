const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  output: {
    path: path.join(__dirname, 'dev'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
          // plugins: ['@babel/plugin-proposal-class-properties']
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  plugins: [
    new CleanWebpackPlugin({
      path: path.join(__dirname, 'dev')
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      inject: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    publicPath: '/',
    contentBase: path.join(__dirname, 'dev'),
    host: '0.0.0.0',
    port: 10010,
    overlay: true,
    compress: true,
    inline: true
  },
  devtool: 'source-map'
}
