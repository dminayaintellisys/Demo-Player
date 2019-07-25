const express = require('express')
const livereload = require('livereload')
const router = require('./router/router')
const hbs = require('hbs')
const app = express()

// Set up the server
app.set("view engine", "html")
app.engine('html', hbs.__express)

// Listen the http request
app.use('/', router)
app.listen(8080, () => console.log("http://localhost:8080/"))

// Reload the browser when some file is edited
app.use(require('connect-livereload')({port: 35729}))
const reloadServer = livereload.createServer({exts: [ 'html', 'js', 'css'], debug: true});

reloadServer.watch(__dirname + '/view');
reloadServer.watch(__dirname + '/public/css');
reloadServer.watch(__dirname + '/public/javascript');