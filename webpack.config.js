'use strict';

module.exports = {
  entry: './src/FirebaseLogin.jsx',
  output: {
    path: './dist',
    filename: 'RapidFirebaseLogin.js',
    library: 'RapidFirebaseLogin',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    firebase: {
      root: 'Firebase',
      commonjs: 'firebase',
      commonjs2: 'firebase',
      amd: 'firebase'
    }
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}