const express = require('express')
const livereload = require('livereload')
const router = require('./router/router')
const hbs = require('hbs')
const app = express()
const fs = require('fs')
const path = require('path');
const mongoose = require('mongoose')

/*
 * To use this module is necessary to install ffmpeg. On Mac OS, this can be installed 
 * with the command: brew install ffmpeg
 */
const extractFrames = require('ffmpeg-extract-frames')

// Settup the server
app.set('view engine', 'html')
app.engine('html', hbs.__express)

// Settup the database
mongoose.connect('mongodb://10.0.1.166/demoplayer', {useNewUrlParser: true})

// Listen the http requests
app.use('/', router)
app.listen(8080, '10.0.1.166', async () =>  {
    console.log('http://10.0.1.166:8080/')
    await createThumbnails();
})

// Reload the browser when some file is edited
app.use(require('connect-livereload')({port: 35729}))
const reloadServer = livereload.createServer({exts: [ 'html', 'js', 'css'], debug: true});

reloadServer.watch(__dirname + '/view');
reloadServer.watch(__dirname + '/public/css');
reloadServer.watch(__dirname + '/public/javascript');

async function createThumbnails() {

    const files = fs.readdirSync(`${process.cwd()}/videos`)

    for (let file of files) {

        // Commit if the thumbnail exist. If exist, continue the execution of the bucle. 
        // If not exist create the thumbnail.
        const name = path.basename(`./videos/${file}`, '.mp4')
        if (fs.existsSync(`./thumbnails/${name}.jpeg`)) continue

        // Create the thumbnail
        await extractFrames({
            input: `./videos/${file}`, 
            output: `./thumbnails/${name}.jpeg`, 
            offsets: [1000]
        })
    }
}