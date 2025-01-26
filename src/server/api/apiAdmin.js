import express from 'express'

import { User } from '../constructor/user.js'

const apiAdmin = express.Router()

apiAdmin.post('/create', (req, res) => {
    if (req.body.form?.phone && req.body.form?.name) {
        const { user, lightPswd } = User.create(req.body.form)
        user.savePromise().then(() => {
            user.desensitization()
            res.send({ user, lightPswd })
        }).catch(err => {
            res.send({ elMessage: { message: err, type: 'error' } })
        })
    } else { res.send({ elMessage: { message: '手机号或姓名不得为空', type: 'error' } }) }
})

apiAdmin.put('/forget', (req, res) => {
    User.findByIdPromise(req.body.id).then(row => {
        if (row) {
            const user = new User(row)
            const lightPswd = user.forget()
            user.savePromise().then(() => {
                user.desensitization()
                res.send({ user, lightPswd })
            })
        } else { res.send({ elMessage: { message: 'id用户不存在', type: 'error' } }) }
    }).catch(err => res.send({ elMessage: { message: err, type: 'error' } }))
})

apiAdmin.delete('/del/:id', (req, res) => {
    User.findByIdPromise(req.params.id).then(row => {
        const user = new User(row)
        user.delete()
        user.savePromise().then(() => {
            res.send({ elMessage: { message: `"${row.name}"删除成功`, type: 'success' } })
        }).catch(err => res.send({ elMessage: { message: err, type: 'error' } }))
    })
})

apiAdmin.get('/list/:hidden', (req, res) => User.listPromise(req.params.hidden).then(rows => {
    res.send({ users: rows.map(row => (new User(row)).desensitization()) })
}))

export { apiAdmin }