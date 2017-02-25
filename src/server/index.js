const express = require('express')
const path = require('path')
const project = require('../../config/project.config')
const host = require('./host')
host((err, app) => {
  if (err) {

  } else {
    app.use(express.static(path.join(__dirname, '../app')))

    app.listen(project.server_port)
    console.log(`Server address: ${project.server_host}:${project.server_port}`)
  }
})
