const Item = require('./../modules/item')
const User = require('./../modules/user')

const ItemController = {}

ItemController.createItem = async (res, data) => {
    const validResult = Item.validateCreateItem(data)

    if (validResult.isValid !== true) {
        throw new Error(validResult.errMsg)
    }

    data.handledPointOfItems = validResult.pointOfItems
    data.handledQty = validResult.qty
    data.userId = res.locals.tokenData.id

    await Item.createItem(data)
}

ItemController.getItemListByUserId = async (data) => {
    const validResult = Item.validateGetItemList(data)

    if (validResult.isValid !== true) {
        throw new Error(validResult.errMsg)
    }

    const itemList = await Item.getItemListByUidList([data.uId], validResult.options)
    return itemList
}

ItemController.getFollowingUserItemList = async (userId, data) => {
    const followingUserList = await User.getFollowingUserListByUserId(userId)

    if (followingUserList.length === 0) {
        return null
    }

    const validResult = Item.validateGetFollowingUserItemList(data)

    if (validResult.isValid !== true) {
        throw new Error(validResult.errMsg)
    }

    const itemList = await Item.getItemListByUidList(followingUserList, validResult.options)
    return itemList
}

module.exports = ItemController
