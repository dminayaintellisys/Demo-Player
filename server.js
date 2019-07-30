const express = require('express')
const livereload = require('livereload')
const router = require('./router/router')
const hbs = require('hbs')
const app = express()
const fs = require('fs')
const path = require('path');
const mongoose = require('mongoose')
const User = require('./models/User')
const Video = require('./models/Video')

const HOST = "localhost";
const PORT = 8080;
const DEV_PORT_LIVERELOAD = 35729;

/*
 * To use this module is necessary to install ffmpeg. On Mac OS, this can be installed 
 * with the command: brew install ffmpeg
 */
const extractFrames = require('ffmpeg-extract-frames')

// Settup the server
app.set('view engine', 'html')
app.engine('html', hbs.__express)
app.use(require('connect-livereload')({port: DEV_PORT_LIVERELOAD}))

// Settup the database
mongoose.connect(`mongodb://${HOST}/demoplayer`, {useNewUrlParser: true})

// Listen the http requests
app.use('/', router)
app.listen(PORT, HOST, async () =>  {
    console.log(`http://${HOST}:${PORT}/`)
    await fillDatabase();
})

// Reload the browser when some file is edited
const reloadServer = livereload.createServer({exts: [ 'html', 'js', 'css', 'mjs']});

reloadServer.watch(__dirname + '/views');
reloadServer.watch(__dirname + '/public/css');
reloadServer.watch(__dirname + '/public/javascript');

async function fillDatabase() {

    await User.deleteMany();
    await Video.deleteMany();

    const guestUser = await User.create({
        _id: new mongoose.Types.ObjectId(),
        name: "Jose", 
        email: "jose@example.com", 
        pass: "jose"
    })

    const files = fs.readdirSync(`${process.cwd()}/videos`)

    for (let file of files) {

        // Commit if the thumbnail exist. If exist, continue the execution of the bucle. 
        // If not exist create the thumbnail.
        const name = path.basename(`./videos/${file}`, '.mp4')
        const thumbnailPath = `./thumbnails/${name}.jpeg`;
        
        if (!fs.existsSync(thumbnailPath)) {

            // Create the thumbnail
            await extractFrames({
                input: `./videos/${file}`, 
                output: thumbnailPath, 
                offsets: [1000]
            })
        }

        await Video.create({
            name: name, 
            path: file, 
            thumbnail_path: thumbnailPath,
            user: guestUser._id
        })
    }
}