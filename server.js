const express = require('express')
const livereload = require('livereload')

const app = express()

app.use(require('connect-livereload')({port: 35729}));

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html')
})

app.listen(8080, () => console.log("http://localhost:8080/"))

const reloadServer = livereload.createServer({
    exts: [ 'html', 'js', 'css'],
    debug: true
});

reloadServer.watch(__dirname + '/view');
reloadServer.watch(__dirname + '/public/css');
reloadServer.watch(__dirname + '/public/javascript');