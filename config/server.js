/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path')
const argv = require('yargs').argv

const ip = '127.0.0.1'

// ========================================================
// Default Configuration
// ========================================================
const config = {
  env: process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '../'),
  dir_client: 'src/app',
  dir_dist: './dist/app',
  dir_dist_server: './dist/server',
  dir_server: 'server',
  dir_test: 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: ip, // use string 'localhost' to prevent exposure on local network
  server_port: process.env.PORT || 3000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel: {
    cacheDirectory: true,
    plugins: ['babel-plugin-transform-runtime'].map(require.resolve),
    presets: ['es2015', 'react', 'stage-0']
  },
  compiler_devtool: 'source-map',
  compiler_hash_type: 'hash',
  compiler_fail_on_warning: false,
  compiler_quiet: true,
  compiler_silent: true,
  compiler_public_path: '/',
  compiler_stats: {
    chunks: false,
    chunkModules: false,
    colors: true
  },
  compiler_vendors: [
    'react',
    'react-redux',
    'react-router',
    'redux'
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters: [{
    type: 'text-summary'
  }, {
    type: 'lcov',
    dir: 'coverage'
  }]
}

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env': {
    'NODE_ENV': JSON.stringify(config.env)
  },
  'NODE_ENV': config.env,
  '__DEV__': config.env === 'development',
  '__PROD__': config.env === 'production',
  '__TEST__': config.env === 'test',
  '__COVERAGE__': !argv.watch && config.env === 'test',
  '__BASENAME__': JSON.stringify(process.env.BASENAME || '')
}

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json')

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep] || pkg.devDependencies[dep]) return true

    console.log(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/config/index.js`
    )
  })

// ------------------------------------
// Utilities
// ------------------------------------
function base () {
  const args = [config.path_base].concat([].slice.call(arguments))
  return path.resolve.apply(path, args)
}

config.utils_paths = {
  base: base,
  client: base.bind(null, config.dir_client),
  serverDist: base.bind(null, config.dir_dist_server),
  dist: base.bind(null, config.dir_dist)
}

// ========================================================
// Environment Configuration
// ========================================================
console.log(`Looking for environment overrides for NODE_ENV "${config.env}".`)
const environments = require('./environments')
const overrides = environments[config.env]
if (overrides) {
  console.log('Found overrides, applying to default configuration.')
  Object.assign(config, overrides(config))
} else {
  console.log('No environment overrides found, defaults will be used.')
}

module.exports = config