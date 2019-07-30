const express = require('express')
const router = express.Router()
const fs = require('fs')
const bodyParse = require('body-parser')
const Video = require('../models/Video')
const videos = require('../models/videos')

let currentUser = null;
let isInvalidUser = false;

// https://expressjs.com/en/guide/routing.html
router.use(express.static(process.cwd() + '/public'))
router.use('/login', bodyParse.urlencoded({ extended: true }))

router.get('/', async (req, res) => {

    if (currentUser) {
        res.render(process.cwd() + '/views/index.html', { "videos": videos.videos })
    } else {
        res.redirect('/login-form')
    }
})

router.get('/login-form', (req, res) => {
    res.render(process.cwd() + '/views/login.html', {isInvalidUser: isInvalidUser})
})

router.post('/login', (req, res) => {

    const email = req.body.email;
    const pass = req.body.pass;
    let user = {}

    for (let video of videos.videos) {
        
        if (video.user.email == email) {
            
            user = video.user;
            break;
        }
    }

    if (user.email == email && user.pass == pass) {
        currentUser = user;
        isInvalidUser = false;
    } else {
        isInvalidUser = true;
    }

    res.redirect('/')
})

router.get('/logout', (req, res) => {
    currentUser = null;
    res.redirect('/')
})

router.get('/thumbnails/:name', (req, res) => {
    res.sendFile(process.cwd() + `/thumbnails/${req.params.name}`)
})

router.get('/videos/:video', (req, res) => {

    // https://medium.com/better-programming/video-stream-with-node-js-and-html5-320b3191a6b6

    const path = process.cwd() +'/videos/'+ req.params.video
    const size = fs.statSync(path).size
    const range = req.header.range

    if (range) {

        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1]) : size - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, {start, end})

        const head = {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Lenght': chunksize,
            'Content-Type': 'video/mp4'
        }

        res.writeHead(206, head)
        file.pipe(res)

    } else {

        const head = {
            'Content-Length': size,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
})

module.exports = router;