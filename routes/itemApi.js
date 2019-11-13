var express = require('express')
var router = express.Router()

const ItemController = require('./../controllers/item')

// create item
router.post('/', async (req, res) => {
    console.log('entered')
    const resObj = {}
    try {
        await ItemController.createItem(res, req.body)
        res.status(200).end()
    } catch (e) {
        console.error(`${req.originalUrl} Err: ${e.message}`)
        // TODO-N: if you want to hidden the real error msg, set it here
        resObj.errMsg = e.message

        if (res.headersSent !== true) {
            res.status(400).send(resObj).end()
        }
    }
})

// get the item list by type
// type: all, uid, popular item(TODO), promotion item(TODO)
router.post('/user/', async (req, res) => {
    const resObj = {}

    try {
        const itemList = await ItemController.getItemListByUserId(req.body)
        resObj.data = itemList
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

router.post('/user/following/', async (req, res) => {
    const resObj = {}

    try {
        console.log(res.locals)
        const itemList = await ItemController.getFollowingUserItemList(res.locals.tokenData.id, req.body)
        resObj.data = itemList
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
