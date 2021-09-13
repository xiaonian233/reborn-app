const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const url = require('url');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const marked = require('marked');
const publicPath = './';

module.exports = (options = {}) => ({
  entry: {
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev
      ? 'static/js/[name].js'
      : 'static/js/[name].js?[chunkhash]',
    chunkFilename: 'static/js/[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'less-loader']
        })
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: ['url-loader?limit=8192&name=static/images/[hash:8].[name].[ext]']
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.md$/,
        loader: 'ware-loader',
        enforce: 'pre',
        options: {
          middleware: function (source) {
            return `<div>${marked(source)}</div>`
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackPwaManifest({
      name: "Reborn's Web App",
      short_name: 'Reborn',
      description: "Reborn",
      lang: "zh-CN",
      start_url: './index.html',
      theme_color: '#3f51b5',
      background_color: '#3f51b5',
      orientation: 'portrait-primary',
      display: 'standalone',
      icons: [
        {
          src: resolve(__dirname, 'src/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          type: "image/png",
          destination: join('icons', 'ios'),
          ios: true
        }
      ],
      ios: {
        'apple-mobile-web-app-title': 'Reborn',
        'apple-touch-fullscreen': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent'
      }
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    new ExtractTextPlugin('static/css/styles.css'),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: resolve(__dirname, 'src/favicon.ico'),
      inject: true,
      path: './public'
    }),
    new CopyWebpackPlugin([
      {
        from: resolve(__dirname, 'public'),
        to: 'public',
        ignore: ['.*']
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
      // name: 'vendor',
      // chunks: 'initial',
      // minChunks: 2
    },
    minimizer: [
      new UglifyJsPlugin({
        /* your config */
        uglifyOptions: {
          compress: true,
          ecma: 6,
          output: {
            comments: false
          },
          compress: {
            dead_code: true,
            drop_console: true
          }
        },
        sourceMap: false
      })
    ]
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@': resolve('src')
    },
    extensions: ['.js', '.json', '.css']
  },
  devServer: {
    host: '0.0.0.0',
    port: 8010,
    proxy: {
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
});
