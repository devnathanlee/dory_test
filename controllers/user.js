const User = require('./../modules/user')

const UserController = {}

// vaildate the user input
// check the username is exising
// insert data recrod
// send back the jwt
// TODO-N: make the password encryption
UserController.createUser = async (data) => {
    const validResult = User.validateCreateUser(data)

    if (validResult.isValid !== true) {
        throw new Error(validResult.errMsg)
    }

    const isExisingUName = await User.isUserNameExisting(data.username)

    if (isExisingUName) {
        throw new Error('username aleady exist')
    }

    const userId = await User.createUser(data)

    const tokenData = {
        id: userId
    }

    return User.getLoginToken(tokenData)
}

UserController.login = async (data) => {
    const validResult = User.validateUserLogin(data)

    if (validResult.isValid !== true) {
        throw new Error(validResult.errMsg)
    }

    const userData = await User.login(data.username, data.pwd)

    if (userData === null) {
        throw new Error('invalid user/password')
    }

    const tokenData = {
        id: userData._id
    }

    return User.getLoginToken(tokenData)
}

module.exports = UserController
