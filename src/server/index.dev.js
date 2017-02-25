const express = require('express')

const webpack = require('webpack')
const webpackConfig = require('../../config/webpack.config')
const project = require('../../config/project.config')

const host = require('./host')
host((err, app) => {
  if (err) {

  } else {
    const compiler = webpack(webpackConfig)
    // console.log(paths.client('static'))
    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath  : webpackConfig.output.publicPath,
      contentBase : project.paths.client(),
      hot         : true,
      quiet       : project.compiler_quiet,
      noInfo      : project.compiler_quiet,
      lazy        : false,
      stats       : project.compiler_stats
    }))
    app.use(require('webpack-hot-middleware')(compiler, {
      path: '/__webpack_hmr'
    }))

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
    app.use(express.static(project.paths.dist()))

    app.listen(project.server_port)
    console.log(`Server address: ${project.server_host}:${project.server_port}`)
  }
})

