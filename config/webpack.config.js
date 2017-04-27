const webpack = require('webpack')
const cssnano = require('cssnano')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./server')

const paths = config.utils_paths
const __DEV__ = config.globals.__DEV__
const __PROD__ = config.globals.__PROD__
const __TEST__ = config.globals.__TEST__

console.log('Creating configuration.')
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: config.compiler_devtool,
  resolve: {
    root: paths.client(),
    extensions: ['', '.js', '.jsx', '.json'],
    fallback: path.join(__dirname, '../../node_modules')
  },
  resolveLoader: {
    fallback: path.join(__dirname, '../../node_modules')
  },
  module: {
    noParse: [/localforage/, /google-libphonenumber/]
  }
}
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = paths.client('main.js')
const APP_ENTRY_POINTS = [

]
if (__DEV__) {
  APP_ENTRY_POINTS.push(
    `webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`
  )
}
APP_ENTRY_POINTS.push(
  'react',
  'react-dom',
  'babel-polyfill',
  APP_ENTRY
)

console.log('Web Server URL')
console.log(config.compiler_public_path)
webpackConfig.entry = {
  app: APP_ENTRY_POINTS,
  vendor: config.compiler_vendors
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name].[${config.compiler_hash_type}].js`,
  path: paths.dist(),
  publicPath: config.compiler_public_path
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  new HtmlWebpackPlugin({
    template: paths.client('index.html'),
    hash: false,
    favicon: paths.client('static/favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true
    }
  })
]

if (__DEV__) {
  console.log('Enable plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
} else if (__PROD__) {
  console.log('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    })
  )
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: config.compiler_babel
}, {
  test: /\.json$/,
  loader: 'json'
}]

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = 'css?localIdentName=[local]__[path][name]__[hash:base64:5]' +
  '&modules&importLoaders=1&sourceMap&-minimize'

const cssPaths = [/node_modules/]
const scssPaths = [/node_modules/, /app[/\\]styles/]

if (__DEV__) {
  cssPaths.push(/ims-shared-client/)
}

webpackConfig.module.loaders.push({
  test: /\.scss$/,
  exclude: scssPaths,
  loaders: [
    'style',
    BASE_CSS_LOADER,
    'postcss',
    'sass?sourceMap'
  ]
})

// Do not transform styles loaded from app/styles folder with
// CSS modules
webpackConfig.module.loaders.push({
  test: /\.scss$/,
  include: scssPaths,
  loaders: [
    'style',
    'css?importLoaders=1&-minimize',
    'postcss',
    'sass?sourceMap'
  ]
})

webpackConfig.module.loaders.push({
  test: /\.css$/,
  exclude: cssPaths,
  loaders: [
    'style',
    BASE_CSS_LOADER,
    'postcss'
  ]
})

// Do not transform vendor's CSS with CSS-modules
// The point is that they remain in global scope.
// Since we require these CSS files in our JS or CSS files,
// they will be a part of our compilation either way.
// So, no need for ExtractTextPlugin here.
webpackConfig.module.loaders.push({
  test: /\.css$/,
  include: cssPaths,
  loaders: [
    'style',
    'css?importLoaders=1',
    'postcss'
  ]
})

webpackConfig.sassLoader = {
  includePaths: paths.client('styles')
}

webpackConfig.postcss = [
  cssnano({
    autoprefixer: {
      add: true,
      remove: true,
      browsers: ['last 2 versions']
    },
    discardComments: {
      removeAll: true
    },
    discardUnused: false,
    mergeIdents: false,
    reduceIdents: false,
    safe: true,
    sourcemap: true
  })
]

// File loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/, loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/, loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/, loader: 'url?limit=8192' }
)
/* eslint-enable */

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!__DEV__) {
  console.log('Apply ExtractTextPlugin to CSS loaders.')
  webpackConfig.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const first = loader.loaders[0]
    const rest = loader.loaders.slice(1)
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
    delete loader.loaders
  })

  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true
    })
  )
}

module.exports = webpackConfig
