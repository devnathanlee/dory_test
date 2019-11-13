const express = require('express')
const router = express.Router()

const DB = require('./../modules/db')

router.get('/', async (req, res) => {
    try {
        await DB.devOnlyDropCollectionsAndCreateThedemoData()
        res.status(200).send('ok').end()
    } catch (e) {
        res.status(400).send({ errMsg: e.message }).end()
    }
})

module.exports = router
