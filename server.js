const express = require('express')
const livereload = require('livereload')
const router = require('./router/router')
const hbs = require('hbs')
const app = express()
const mongoose = require('mongoose')

const HOST = "10.0.1.166";
const PORT = 8080;
const DEV_PORT_LIVERELOAD = 35729;

// Settup the server
app.set('view engine', 'html')
app.engine('html', hbs.__express)
app.use(require('connect-livereload')({port: DEV_PORT_LIVERELOAD}))
mongoose.connect(`mongodb://${HOST}/demoplayer`, {useNewUrlParser: true})

// Listen the http requests
app.use('/', router)
app.listen(PORT, HOST, async () =>  {
    console.log(`http://${HOST}:${PORT}/`)
})

// Reload the browser when some file is edited
const reloadServer = livereload.createServer({exts: [ 'html', 'js', 'css', 'mjs']});
reloadServer.watch(__dirname + '/views');
reloadServer.watch(__dirname + '/public/css');
reloadServer.watch(__dirname + '/public/javascript');