const express = require('express')

const cookieParser = require('cookie-parser')

const compression = require('compression')

module.exports = (onInitialized) => {
  const app = express()

  process.on('uncaughtException', (ex) => {
    console.error(ex)
    process.exit(1)
  })

  app.use(cookieParser())
  app.use(compression())

    // This rewrites all routes requests to the root /index.html file
    // (ignoring file requests). If you want to implement universal
    // rendering, you'll want to remove this middleware.
  app.use(require('connect-history-api-fallback')())

    // ------------------------------------
    // Apply Webpack HMR Middleware
    // ------------------------------------
  onInitialized(null, app)

      // Serving ~/dist by default. Ideally these files should be served by
      // the web server and not the app server, but this helps to demo the
      // server in production.
}

