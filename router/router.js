const express = require('express')
const router = express.Router()
const bodyParse = require('body-parser')
const User = require('../models/User')
const Video = require('../models/Video')

let currentUser = null;
let isInvalidUser = false;

// https://expressjs.com/en/guide/routing.html
router.use(express.static(process.cwd() + '/public'))
router.use('/login', bodyParse.urlencoded({ extended: true }))

router.get('/', async (req, res) => {

    if (currentUser) {
        const videos = await Video.find();
        res.render(process.cwd() + '/views/index.html', { "videos": videos })
    } else {
        res.redirect('/login')
    }
})

router.get('/login', (req, res) => {
    res.render(process.cwd() + '/views/login.html', {isInvalidUser: isInvalidUser})
})

router.post('/login', async (req, res) => {
    
    const email = req.body.email;
    const pass = req.body.pass;
    
    const user = await User.findOne({email: email}) || {}

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

module.exports = router;