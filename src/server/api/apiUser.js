import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { User } from '../constructor/user.js'
import { mwVerifyToken } from '../middleware/mwVerifyToken.js'

const apiUser = express.Router()
const tokenTimeout = process.env.TOKTEN_TIMEOUT || 129600000

apiUser.post('/login', (req, res) => {
    new Promise(resolve => {
        if (req.body.form) { // 账户登录
            if (req.body.form?.phone?.length !== 11) { return }
            User.findByColumnPromise('phone', req.body.form.phone).then(rows => {
                // 邮箱存在，且密码正确
                if (bcrypt.compareSync(req.body.form.password, rows[0]?.password || '')) {
                    const salt = crypto.randomUUID()
                    const user = new User({ ...rows[0], salt })
                    user.savePromise().then(() => {
                        const token = jwt.sign({ id: rows[0].id, stay: req.body.form.stay }, salt)
                        res.cookie('token', token, { maxAge: req.body.form.stay ? tokenTimeout : undefined })
                        resolve(rows[0])
                    }).catch(err => res.send({ elMessage: { message: '加盐失败:' + err, type: 'error' } }))
                }// 邮箱不存在
                else { res.send({ elMessage: { message: '账号或密码错误', type: 'error' } }) }
            }).catch(({ message }) => { res.send({ elMessage: { message, type: 'error' } }) })
        } else if (req.cookies.token) { //token登录
            User.findByIdPromise(jwt.decode(req.cookies.token)?.id).then(row => {
                if (row) {
                    jwt.verify(req.cookies.token, row.salt, (err, decode) => {
                        if (err) {
                            res.cookie('token', null, { maxAge: 0 })
                            res.send({
                                elMessage: { message: `用户"${row.name}"的token无效, ` + err, type: 'error' },
                                route: { type: 'tokenTimeout', timeout: 1200 }
                            })
                        } else {
                            if (decode.stay) {
                                const token = jwt.sign({ id: row.id }, row.salt)
                                res.cookie('token', token, { maxAge: tokenTimeout })
                            }
                            resolve(row)
                        }
                    })
                } else { res.cookie('token', null, { maxAge: 0 }).end() }
            }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
        }
    }).then(row => res.send({
        user: { name: row.name }, route: { path: 'main' }
    }))
})

apiUser.delete('/logout', (req, res) => {
    if (req.cookies.token) {
        User.findByIdPromise(jwt.decode(req.cookies.token).id).then(row => {
            const user = new User(row)
            user.salt = undefined
            user.savePromise().then(() => {
                res.cookie('token', null, { maxAge: 0 })
                res.send({
                    elMessage: { message: `"${row.name}" 注销成功`, type: 'success' },
                    route: { type: 'logout', path: '/', timeout: 1200 }
                })
            }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
        })
    }
})

apiUser.post('/forget', (req, res) => {

})

apiUser.put('/password', [mwVerifyToken, (req, res) => {
    if (req.body.form.new === req.body.form.password) { return }
    User.findByIdPromise(jwt.decode(req.cookies.token).id).then(row => {
        if (bcrypt.compareSync(req.body.form.old, row.password || "")) { // 密码正确
            const user = new User(row)
            user.password = User.bcrypt(req.body.form.password)
            user.salt = undefined
            user.savePromise().then(() => {
                res.cookie('token', null, { maxAge: 0 })
                res.send({
                    elMessage: { message: '修改成功,请重新登录', type: 'success' },
                    route: { type: 'pswdOut', path: '/', timeout: 1200 }
                })
            }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
        } else { res.send({ elMessage: { message: '原密码错误', type: 'warning' } }) } // 密码错误
    })
}])


export { apiUser }