/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
const webpack = require('webpack');
const path = require('path')

const baseConfig = {
  entry: [
    path.resolve('./extractComponentSchemas.js')
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: { target: 'node' }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          /src\/stubs/,
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'file-loader?name=[name].[ext]?[hash]',
        }]
      },
    ],
  },
  mode: process.env.NODE_ENV || 'development'
}; /* baseConfig */

const webConfig = {
  ...baseConfig,
  output: {
  	path: path.resolve(__dirname),
    filename: 'doc.bundle.js',
  }
}

module.exports = [
  webConfig,
];
