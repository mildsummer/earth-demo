var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: "./src/js/entry.js"
  },
  output: {
    path: __dirname + '/dist/assets',
    publicPath: '/assets/',
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['env']
        }
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.(otf)$/,
        loader: 'file'
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.sass', '.scss', '.css']
  },
  node: {
    fs: "empty"
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css', { allChunks: true })
  ]
};
