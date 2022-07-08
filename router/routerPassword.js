const express = require('express')
const router  = express.Router()
const control = require('../controllers/control')

router.get('/signup', control.get_signup)
router.post('/signup', control.post_signup)
router.get('/login',control.get_login)
router.post('/login',control.post_login)
router.get('/logout' , control.logout)

module.exports = router
