import express from 'express'

import { User } from '../constructor/user.js'

const apiAdmin = express.Router()

apiAdmin.post('/save', (req, res) => {
    if (req.body.form?.phone && req.body.form?.name) {
        if (req.body.form?.id) { // 修改
            User.findByIdPromise(req.body.form.id).then(row => {
                if (!row) { return } // user不存在
                if (req.body.form.phone === row.phone && req.body.form.name === row.name) {
                    return res.send({ elMessage: { message: '未修改内容', type: 'error' } })
                }
                const user = new User({ ...row, ...(req.body.form) })
                user.savePromise().then(() => {
                    user.desensitization()
                    res.send({ user })
                }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
            })
        } else { // 创建
            const { user, lightPswd } = User.create(req.body.form)
            user.savePromise().then(() => {
                user.desensitization()
                res.send({ user, lightPswd })
            }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
        } // 手机号或姓名为空
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
    }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
})

apiAdmin.delete('/del/:id', (req, res) => {
    User.findByIdPromise(req.params.id).then(row => {
        const user = new User(row)
        user.delete()
        user.savePromise().then(() => {
            res.send({ elMessage: { message: `"${row.name}"删除成功`, type: 'success' } })
        }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
    })
})

apiAdmin.get('/list/:hidden', (req, res) => User.listPromise(req.params.hidden).then(rows => {
    res.send({ users: rows.map(row => (new User(row)).desensitization()) })
}))

apiAdmin.put('/reback', (req, res) => {
    User.findByIdPromise(req.body.form?.id).then(row => {
        const user = new User(row)
        const lightPswd = user.reback(req.body.form.phone)
        user.savePromise().then(() => res.send({ user, lightPswd })).catch(({ message }) => {
            res.send({ elMessage: { message, type: 'error' } })
        })
    })
})

export { apiAdmin }