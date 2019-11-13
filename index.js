const bodyParser = require('body-parser')
const compression = require('compression')
const dotenv = require('dotenv')
const express = require('express')
const helmet = require('helmet')
const http = require('http')

const result = dotenv.config()

if (result.error) {
    throw result.error
}

// routes modules
const UserApiRoute = require('./routes/userApi')
const ItemApiRoute = require('./routes/itemApi')
const DevApiRoute = require('./routes/devApi')

const DB = require('./modules/db')
const Middleware = require('./modules/middleware')

const app = express()
// middleware
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.APP_PORT

// TODO-N: use a async logger to log out the reqest time and req body
app.use((req, res, next) => {
    console.info(`${req.originalUrl} req.body=${JSON.stringify(req.body)}`)
    next()
})

// routes
// for the health check api
app.get('/is-live/', (req, res) => {
    res.sendStatus(200).end()
})

app.use('/api/dev/', DevApiRoute)
app.use('/api/v1/user/', UserApiRoute)
// check the jwt
app.use(Middleware.verifyLoginToken)
app.use('/api/v1/item/', ItemApiRoute)

DB.init().then(() => {
    console.info('connected DB')
    http.createServer(app).listen(port, () => {
        console.info(`API Server listening on port ${port} in ${process.env.NODE_ENV}`)
    })
})
