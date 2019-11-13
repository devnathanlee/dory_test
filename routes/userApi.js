const express = require('express')
const router = express.Router()

const UserController = require('./../controllers/user')

// Create user
// is the username aleady exising
router.post('/', async (req, res) => {
    const resObj = {}
    console.log(req.body)
    try {
        resObj.token = await UserController.createUser(req.body)
        res.status(200).end()
    } catch (e) {
        console.log('enter 3')
        console.error(`${req.originalUrl} Err: ${e.message}`)
        // TODO-N: if you want to hidden the real error msg, set it here
        resObj.errMsg = e.message

        if (res.headersSent !== true) {
            res.status(400).send(resObj).end()
        }
    }
    console.log('enter 4')
})

// user login
router.post('/login/', async (req, res) => {
    const resObj = {}
    console.log(req.body)
    try {
        resObj.token = await UserController.login(req.body)
        res.status(200).send(resObj).end()
    } catch (e) {
        console.error(`${req.originalUrl} Err: ${e.message}`)
        // TODO-N: if you want to hidden the real error msg, set it here
        resObj.errMsg = e.message

        if (res.headersSent !== true) {
            res.status(400).send(resObj).end()
        }
    }
})

module.exports = router
