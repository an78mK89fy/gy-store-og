import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { db } from '../database/dbConstructor.js'

class User extends (await db.constructorPromise('user')) {
    /**
    * @param {Object} params
    * @param {} params.id
    * @param {} params.phone
    * @param {} params.name
    * @param {} params.email
    * @param {} params.password
    * @param {} params.salt
    */
    constructor(params) {
        super(params)
    }
    static bcrypt(pswd) { return bcrypt.hashSync(pswd, 10) }
    static create(params) {
        const user = new User(params)
        return { user, lightPswd: user.forget() }
    }
    forget() {
        const lightPswd = parseInt(Date.now() * Math.random()).toString(16)
        this.password = User.bcrypt(lightPswd)
        this.salt = undefined
        return lightPswd
    }
    verify(pswd) {
        bcrypt.compareSync(pswd, result?.password || '')
        return
    }
    desensitization() {
        this.password = undefined
        this.salt = undefined
        return this
    }
    delete() { this.hidden = 1; this.phone = null }
    static login(req, res) {
        new Promise(resolve => {
            if (req.body.form) { // 账户登录
                User.findByColumnPromise('phone', req.body.form.phone).then(rows => {
                    // 邮箱存在，且密码正确
                    if (bcrypt.compareSync(req.body.form.password, rows[0]?.password || '')) {
                        const salt = crypto.randomUUID()
                        const user = new User({ ...rows[0], salt })
                        user.savePromise().then(() => {
                            const token = jwt.sign({ id: rows[0].id }, salt)
                            res.cookie('token', token, { maxAge: req.body.form.stay ? 3000000000 : undefined })
                            resolve(rows[0])
                        }).catch(err => res.send({ elMessage: { message: '加盐失败:' + err, type: 'error' } }))
                    }// 邮箱不存在
                    else { res.send({ elMessage: { message: '账号或密码错误', type: 'error' } }) }
                }).catch(err => { res.send({ elMessage: { message: err, type: 'error' } }) })
            } else if (req.cookies?.token) { //token登录
                User.findByIdPromise(jwt.decode(req.cookies.token).id).then(row => {
                    if (row) {
                        jwt.verify(req.cookies.token, row.salt, err => {
                            if (err) {
                                res.cookie('token', null, { maxAge: 0 })
                                res.send({
                                    elMessage: {
                                        message: `用户"${row.name}"的token无效, ` + err,
                                        type: 'error'
                                    }
                                })
                            } else { resolve(row) }
                        })
                    }
                })
            }
        }).then(row => res.send({ user: { name: row.name } }))
    }
    static logout(req, res) {
        if (req.cookies.token) {
            User.findByIdPromise(jwt.decode(req.cookies.token).id).then(row => {
                const user = new User(row)
                user.salt = undefined
                user.savePromise().then(() => {
                    res.cookie('token', null, { maxAge: 0 })
                    res.send({
                        elMessage: { message: `"${row.name}"注销成功,即将退出`, type: 'success' },
                        state: { logout: 1, config: { timeout: 1500 } }
                    })
                }).catch(err => res.send({ elMessage: { message: err, type: 'error' } }))
            })
        }
    }
}

export { User }