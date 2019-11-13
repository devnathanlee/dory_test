const mongoose = require('mongoose')

const UserSchema = require('./../dbSchema/user')
const ItemSchema = require('./../dbSchema/item')

const DB = {}
const dbPath = `${process.env.DB_FIRST_PATH}://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/${process.env.DB_SCHEMA}`

DB.init = async () => {
    await mongoose.connect(dbPath, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10
    })

    DB.User = mongoose.model('Users', UserSchema)
    DB.Item = mongoose.model('Items', ItemSchema)
}

DB.isExitingUser = (username) => {
    const queryObj = {
        username: username
    }

    return DB.User.findOne(queryObj, (err, data) => {
        if (err) {
            console.error(err)
        }

        return data
    })
}

DB.createUser = (data) => {
    const newUser = new DB.User(data)
    return newUser.save((err, data) => {
        if (err) {
            console.error(err)
        }

        return data
    })
}

DB.login = (uname, pwd) => {
    const queryObj = {
        username: uname,
        pwd: pwd
    }
    return DB.User.findOne(queryObj, (err, data) => {
        if (err) {
            console.error(err)
        }

        return data
    })
}

DB.createItem = (data) => {
    const newItem = new DB.Item(data)
    return newItem.save((err, data) => {
        if (err) {
            console.error(err)
        }
    })
}

DB.getItemListByUidList = (uidList, options) => {
    const query = DB.Item.find().where('uid').in(uidList)
        .skip(options.skip).limit(options.limit).sort(options.sort)

    return new Promise((resolve, reject) => {
        query.exec((err, data) => {
            if (err) {
                console.error(err)
            }

            resolve(data)
        })
    })
}

DB.getFollowingUserListByUserId = (userId) => {
    const queryObj = {
        _id: userId
    }

    return DB.User.findOne(queryObj, (err, data) => {
        if (err) {
            console.error(err)
        }

        return data
    })
}
// TODO-N: development only
DB.devOnlyDropCollectionsAndCreateThedemoData = async () => {
    const result = {}

    await DB.User.remove({}, (err, data) => {
        if (err) {
            console.error(err)
        }

        result.noOfdeletedUserRecord = data.deletedCount
    })

    await DB.Item.remove({}, (err, data) => {
        if (err) {
            console.error(err)
        }

        result.noOfdeletedUserRecord = data.deletedCount
    })

    // paulho don't follow to any user
    // marychu followed paulho
    // peterchan followed marychu and paulho
    const user1 = { username: 'paul_ho', pwd: 12345678 }
    const user2 = { username: 'maryChu', pwd: 12345678 }
    const user3 = { username: 'peterchan', pwd: 12345678 }

    const userPaulHo = new DB.User(user1)

    let paulHoUId, maryChuUId, peterChanUId

    await new Promise((resolve, reject) => {
        userPaulHo.save((err, data) => {
            if (err) {
                console.error(err)
            }
            paulHoUId = data._id
            resolve()
        })
    })

    user2.following_list = [paulHoUId]
    const userMaryChu = new DB.User(user2)

    await new Promise((resolve, reject) => {
        userMaryChu.save((err, data) => {
            if (err) {
                console.error(err)
            }
            maryChuUId = data._id
            resolve()
        })
    })

    user3.following_list = [paulHoUId, maryChuUId]
    const userPeterChan = new DB.User(user3)

    await new Promise((resolve, reject) => {
        userPeterChan.save((err, data) => {
            if (err) {
                console.error(err)
            }
            peterChanUId = data._id
            resolve()
        })
    })

    const locationList = ['Kennedy Town', 'Sai Ying Pun', 'Shek Tong Tsui',
        'Fortress Hill', 'Heng Fa Chuen', 'Siu Sai Wan', 'Deep Water Bay',
        'Pok Fu Lam', 'Tin Wan', undefined
    ]

    const userItemList = []

    for (let i = 0; i < 30; i++) {
        const tempItem1 = {
            title: `item ${(i + 1)} - Paul Ho`,
            point_of_items: (Math.random() * (1000.0 - 1) + 0.200).toFixed(1),
            uid: paulHoUId,
            location: locationList[Math.floor(Math.random() * 10)],
            qty: Math.floor(Math.random() * 10 + 1)
        }

        const tempItem2 = {
            title: `item ${(i + 1)} - Mary Chu`,
            point_of_items: (Math.random() * (1000.0 - 1) + 0.200).toFixed(1),
            uid: maryChuUId,
            location: locationList[Math.floor(Math.random() * 10)],
            qty: Math.floor(Math.random() * 10 + 1)
        }

        const tempItem3 = {
            title: `item ${(i + 1)} - Peter Chan`,
            point_of_items: (Math.random() * (1000.0 - 1) + 0.200).toFixed(1),
            uid: peterChanUId,
            location: locationList[Math.floor(Math.random() * 10)],
            qty: Math.floor(Math.random() * 10 + 1)
        }

        userItemList.push(tempItem1)
        userItemList.push(tempItem2)
        userItemList.push(tempItem3)
    }

    await new Promise((resolve, reject) => {
        DB.Item.insertMany(userItemList, (err, data) => {
            if (err) {
                console.error(err)
            }
        })
    })
}

mongoose.connection.on('error', err => {
    console.error(err)
})

module.exports = DB
