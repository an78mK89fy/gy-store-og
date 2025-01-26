import express from 'express'
import jwt from 'jsonwebtoken'

import { User } from '../constructor/user.js'

const mwVerifyToken = express.Router()
mwVerifyToken.use((req, res, next) => {
    new Promise((resolve, reject) => {
        User.findByIdPromise(jwt.decode(req.cookies.token).id).then(row => {
            if (row) { jwt.verify(req.cookies.token, row.salt, err => err ? reject(err) : resolve()) }
            else { reject('找不到用户404') }
        }).catch(reject)
    }).then(next).catch(err => {
        res.cookie('token', null, { maxAge: 0 })
        res.send({
            elMessage: { message: `${'用户'}token无效,即将退出,${err}`, type: 'error' },
            state: { tokenLapse: 1, config: { timeout: 3000 } }
        })
    })
})

export { mwVerifyToken }