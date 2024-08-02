import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import path from 'path';

export default {
  // devtool: 'source-map',
  // mode: 'development',
  mode: 'production',
  entry: {
    contentScript: './src/content/index.js',
    background: './src/background/index.js',
    react: './src/react/index.jsx'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    clean: true
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('manifest.json'),
          to: path.resolve('dist/manifest.json')
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', {'runtime': 'automatic'}]
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};