const { ProvidePlugin } = require('webpack');
const { resolve, join } = require('path');

const { srcScript, output, outputScript } = require('./directories');

const nodeEnv = process.env.NODE_ENV;
const isDevelopment = nodeEnv !== 'production';

module.exports = {
  mode: 'none',
  context: join(__dirname, '../../', output),
  output: {
    path: join(__dirname, '../../', outputScript),
    filename: '[name].js',
    chunkFilename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            [
              '@babel/plugin-transform-runtime', {
                helpers: true,
                regenerator: true
              }
            ],
            [
              '@babel/plugin-proposal-decorators', {
                legacy: true
              }
            ],
            [
              '@babel/plugin-proposal-pipeline-operator', {
                proposal: 'minimal'
              }
            ],
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-function-name',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-optional-chaining'
          ],
          cacheDirectory: true
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@': resolve(srcScript, 'cores')
    }
  },
  plugins: [
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Plugin: ['@/plugin', 'default']
    })
  ],
  optimization: {
    nodeEnv,
    splitChunks: false,
    flagIncludedChunks: true,
    concatenateModules: true,
    sideEffects: true,
    chunkIds: "size",
    moduleIds: "size",
  },
  devtool: isDevelopment && 'source-map'
};
