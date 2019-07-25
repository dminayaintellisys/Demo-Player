const express = require('express')
const router = express.Router()
const fs = require('fs')
const bodyParse = require('body-parser')

router.use(express.static(process.cwd() + '/public'))
router.use('/videos/:video', bodyParse.urlencoded())

router.get('/', (req, res) => {

    const videos = fs.readdirSync(process.cwd() + "/videos")
    res.render(process.cwd() + '/view/index.html', { "videos": videos })
})

router.get('/videos/:video', (req, res) => {

    const path = process.cwd() + '/videos/' + req.params.video
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