import express from 'express'
import jwt from 'jsonwebtoken'

// import { apiUser } from './apiUser.js'
// import { apiList } from './apiList.js'
import { apiOrders } from './apiOrders.js'

const api = express.Router()

// api.use('/user', apiUser)
api.use('/orders', [(req, res, next) => {
    // jwt.verify(
    //     req.cookies.token,
    //     'tempSalt',
    //     (err, decoded) => {
    //         if (err) {
    //             res.send({
    //                 message: `用户"${decoded.name}"的token无效`,
    //                 type: 'error'
    //             })
    //         } else { next() }
    //     })
    next()
}, apiOrders])

export { api }