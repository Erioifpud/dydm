const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: ['./src'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'Danmu',
    globalObject: 'this'
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
      path: path.join(__dirname, 'dist')
    }),
    new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        output: {
          comments: false
        },
        compress: {
          drop_console: true
        }
      }
    })
  ]
}
