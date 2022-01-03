const path = require('path');

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/public/dist',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
    }, {
      test: /\.ts$/,
      use: 'ts-loader',
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  devtool: 'source-map',
};