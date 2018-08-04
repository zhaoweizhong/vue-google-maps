/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
const webpack = require('webpack');
const path = require('path')

const babelConfig = {
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": [
            "last 2 versions",
            "safari >= 7"
          ]
        }
      }
    ]
  ],
  "plugins": [
    "transform-object-rest-spread",
    "transform-inline-environment-variables",
    "minify-dead-code-elimination"
  ]
}

const baseConfig = {
  entry: [
    path.resolve('./src/main.js')
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
        options: babelConfig,
        include: [
          /node_modules\/lazy-value/,
          /node_modules\/sinon/,
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
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

/**
 * Web config uses a global Vue and Lodash object.
 * */
const webConfig = {
  ...baseConfig,
  externals: {
    vue: 'Vue',
    'marker-clusterer-plus': 'MarkerClusterer'
  },
  output: {
  	path: path.resolve(__dirname, 'dist'),
    filename: "vue-google-maps.js",
    library: ["VueGoogleMaps"],
    libraryTarget: "umd"
  }
}

module.exports = [
  webConfig
];
