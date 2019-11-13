const User = require('./user')

const Middleware = {}

Middleware.verifyLoginToken = (req, res, next) => {
    const token = User.getUserTokenInReq(req.body)

    if (typeof token === 'undefined') {
        if (res.headersSent !== true) {
            res.status(400).send('invalid session').end()
            return
        }
    }

    const verifyResult = User.verifyLoginToken(res, token)

    if (verifyResult.isValidToken === false) {
        if (res.headersSent !== true) {
            res.status(400).send('session expired').end()
            return
        }
    }

    next()
}

module.exports = Middleware
