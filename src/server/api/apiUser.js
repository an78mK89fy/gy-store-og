import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from '../constructor/user.js'

const apiUser = express.Router()

apiUser.post('/login', (req, res) => {
    new Promise(resolve => {
        // 账户登录
        if (req.body.form) {
            User.findByColumnPromise('account', req.body.form.account).then(result => {
                // 邮箱存在，且密码正确
                if (bcrypt.compareSync(req.body.form.password, result?.password || '')) {
                    const token = jwt.sign({ id: result.id }, 'tempSalt')
                    res.cookie('token', token, { maxAge: req.body.form.stay ? 3000000000 : undefined })
                    resolve(result)
                }// 邮箱不存在
                else { res.send({ elMessage: { message: '账号或密码错误', type: 'warning' } }) }
            }).catch(result => { res.send({ elMessage: { message: result, type: 'error' } }) })
        } else if (req.cookies?.token) { //token登录
            jwt.verify(req.cookies.token, 'tempSalt', (err, decoded) => {
                if (err) {
                    res.send({
                        elMessage: {
                            message: `用户"${decoded?.name}"的token无效`,
                            type: 'error'
                        }
                    })
                } else {
                    User.findByIdPromise(decoded.id).then(result => {
                        if (result) { resolve(result) }
                    }).catch(result => res.send({ elMessage: { message: result, type: 'error' } }))
                }
            })
        }
    }).then(result => { res.send({ user: { name: result.account, avatar: result.avatar } }) })
})

export { apiUser }