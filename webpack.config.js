const path = require('path');

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'public'),
    publicPath: '/public',
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
  devServer: {
    static: {
      directory: __dirname,
    },
    port: 5500,
    hot: true,
    compress: true,
  },
};