const DB = require('./db')

const Item = {}

const availableSortList = [
    'title-asc',
    'title-desc',
    'cdate-asc',
    'cdate-desc',
    'qty-asc',
    'qty-desc'
]

Item.validateCreateItem = (data) => {
    const result = {
        isValid: false
    }

    if (typeof data !== 'object') {
        result.errMsg = 'invalid object'
        return result
    }

    if (typeof data.title !== 'string') {
        result.errMsg = 'title is not string'
        return result
    }

    if (data.title.length > 255) {
        result.errMsg = 'title length more than 255 characters'
        return result
    }

    if (isNaN(data.pointOfItems) !== false) {
        result.errMsg = 'point of items is not a number'
        return result
    }

    result.pointOfItems = parseFloat(data.pointOfItems)

    if (result.pointOfItems < 1) {
        result.errMsg = 'point of items is less than 1'
        return result
    }

    if (isNaN(data.qty) !== false) {
        result.errMsg = 'qty is not a number'
        return result
    }

    result.qty = parseInt(data.qty)

    if (result.qty !== parseFloat(data.qty)) {
        result.errMsg = 'qty is not a integer'
        return result
    }

    if (result.qty <= 0) {
        result.errMsg = 'qty is less then or equal 0'
        return result
    }

    result.isValid = true
    return result
}

Item.createItem = async (data) => {
    // map the input data and db attribute here if needed
    const dataForDB = {
        title: data.title,
        point_of_items: data.handledPointOfItems,
        uid: data.userId,
        qty: data.handledQty,
        location: data.location
    }

    const dbResult = DB.createItem(dataForDB)

    return dbResult
}

Item.validateGetItemList = (data) => {
    const result = {
        isValid: false
    }

    if (typeof data !== 'object') {
        result.errMsg = 'invalid object'
        return result
    }

    if (typeof data.uId !== 'string') {
        result.errMsg = 'userId invalid'
        return result
    }

    result.options = {}

    // optional
    if (isNaN(data.offset) === false) {
        const offsetInInt = parseInt(data.offset)
        if (offsetInInt === parseFloat(data.offset)) {
            if (offsetInInt >= 0) {
                result.options.skip = offsetInInt
            }
        }
    }

    if (isNaN(data.limit) === false) {
        const limitInInt = parseInt(data.limit)
        if (limitInInt === parseFloat(data.limit)) {
            if (limitInInt > 0) {
                result.options.limit = limitInInt
            }
        }
    }

    if (typeof data.sort === 'string') {
        const soryAry = data.sort.split(',')
        const sortQueryObj = {}
        soryAry.forEach((sortStr) => {
            const trimedSortStr = sortStr.trim()
            if (availableSortList.includes(sortStr)) {
                const sortStrAry = trimedSortStr.split('-')
                sortQueryObj[sortStrAry[0]] = (sortStrAry[1] === 'asc') ? 1 : -1
            }
        })
        result.options.sortQueryObj = sortQueryObj
    }

    result.isValid = true
    return result
}

// TODO-N: reduce the duplicate code in validateGetItemList
Item.validateGetFollowingUserItemList = (data) => {
    const result = {
        isValid: false
    }

    if (typeof data !== 'object') {
        result.errMsg = 'invalid object'
        return result
    }

    result.options = {}

    // optional
    if (isNaN(data.offset) === false) {
        const offsetInInt = parseInt(data.offset)
        if (offsetInInt === parseFloat(data.offset)) {
            if (offsetInInt >= 0) {
                result.options.skip = offsetInInt
            }
        }
    }
    if (isNaN(data.limit) === false) {
        const limitInInt = parseInt(data.limit)
        if (limitInInt === parseFloat(data.limit)) {
            if (limitInInt > 0) {
                result.options.limit = limitInInt
            }
        }
    }

    if (typeof data.sort === 'string') {
        const soryAry = data.sort.split(',')
        const sortQueryObj = {}
        soryAry.forEach((sortStr) => {
            const trimedSortStr = sortStr.trim()
            if (availableSortList.includes(sortStr)) {
                const sortStrAry = trimedSortStr.split('-')
                sortQueryObj[sortStrAry[0]] = (sortStrAry[1] === 'asc') ? 1 : -1
            }
        })
        result.options.sortQueryObj = sortQueryObj
    }

    result.isValid = true
    return result
}

Item.getItemListByUidList = async (uidList, options) => {
    // TODO-N: map the input data and db attribute here if needed
    const queryOpt = {
        skip: options.skip || 0,
        limit: options.limit || 100,
        sort: options.sortQueryObj || '-created_at'
    }

    const dbResult = await DB.getItemListByUidList(uidList, queryOpt)

    // Map the attribute for out to api
    return dbResult.map((item) => {
        return {
            userId: item.uid,
            itemId: item._id,
            title: item.title,
            potionOfItems: item.point_of_items,
            qty: item.qty,
            location: item.location || '',
            createdDate: item.created_at,
            updatedDate: item.updated_at
        }
    })
}

module.exports = Item
