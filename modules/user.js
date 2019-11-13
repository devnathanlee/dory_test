const jwt = require('jsonwebtoken')
const DB = require('./db')

const User = {}

// check the username in database
// return true or false
User.isUserNameExisting = async (username) => {
    const dbResult = await DB.isExitingUser(username)

    if (dbResult !== null) {
        return true
    }

    return false
}

// TODO-N: make all the min or max num setting in the config
User.validateCreateUser = (data) => {
    const result = {
        isValid: false
    }

    if (typeof data !== 'object') {
        result.errMsg = 'invalid object'
        return result
    }

    if (typeof data.username !== 'string') {
        result.errMsg = 'username is not a string'
        return result
    }

    if (data.username.length < 4) {
        result.errMsg = 'username length less than 4 characters'
        return result
    }

    if (data.username.length > 20) {
        result.errMsg = 'username length more than 20 characters'
        return result
    }

    if (typeof data.pwd !== 'string') {
        result.errMsg = 'pwd is not a string'
        return result
    }

    if (data.pwd.length < 8) {
        result.errMsg = 'pwd length less than 8 characters'
        return result
    }

    if (data.pwd.length > 12) {
        result.errMsg = 'pwd length more 12 characters'
        return result
    }

    result.isValid = true
    return result
}

// TODO-N: make all the min or max num setting in the config
User.validateUserLogin = (data) => {
    const result = {
        isValid: false
    }

    if (typeof data !== 'object') {
        result.errMsg = 'invalid object'
        return result
    }

    if (typeof data.username !== 'string' ||
        data.username.length < 4 ||
        data.username.length > 20
    ) {
        result.errMsg = 'username is invalid'
        return result
    }

    if (typeof data.pwd !== 'string' ||
        data.pwd.length < 8 ||
        data.pwd.length > 12
    ) {
        result.errMsg = 'pwd is invalid'
        return result
    }

    result.isValid = true
    return result
}

User.createUser = async (data) => {
    // TODO-N: map the input data and db attribute here if needed
    const dbResult = await DB.createUser(data)
    return dbResult._id
}

User.getFollowingUserListByUserId = async (userId) => {
    const dbResult = await DB.getFollowingUserListByUserId(userId)
    return dbResult.following_list
}

User.login = async (uname, pwd) => {
    // TODO-N: map the input data and db attribute here if needed
    const dbResult = await DB.login(uname, pwd)
    return dbResult
}

User.getLoginToken = (data) => {
    const loginToken = jwt.sign(
        {
            data: data
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    )

    return loginToken
}

User.verifyLoginToken = (res, token) => {
    const result = {}

    try {
        result.data = jwt.verify(token, process.env.JWT_SECRET)

        res.locals.tokenData = result.data.data
        result.isValidToken = true
    } catch (err) {
        console.error(err)
        result.isValidToken = false
    }

    return result
}

User.getUserTokenInReq = (data) => {
    if (typeof data !== 'object') {
        return undefined
    }

    if (typeof data.token !== 'string') {
        return undefined
    }

    return data.token
}

module.exports = User
