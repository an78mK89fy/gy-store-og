import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../constructor/user.js'
import { Orders } from '../../constructor/orders.js'

const apiState = express.Router()

apiState.put('/print', (req, res) => {
    Orders.findByIdPromise(req.body.id).then(row => {
        const orders = new Orders(row)
        Orders.getPropPromise('state', '已阅').then(row => {
            orders.id_prop_state = row.id
            orders.savePromise().then(() => {
                res.send({ state: row })
            }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
        })
    })
})

apiState.put('/receive', (req, res) => {
    try {
        if (!(req.body.state?.count >= 0)) { return }
        const decode = jwt.decode(req.cookies.token)
        User.findByIdPromise(decode.id).then(user => {
            Orders.findByIdPromise(req.body.state.id).then(row => {
                const orders = new Orders(row)
                orders.count = req.body.state.count
                const b = row.id_user !== decode.id
                if (b) { orders.id_user = decode.id }
                orders.savePromise().then(() => b ? res.send({ user: user.name }) : res.end())
            })
        }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
    } catch ({ message }) { res.send({ elMessage: { message, type: 'error' } }) }
})

apiState.put('/over', (req, res) => {
    Orders.getPropPromise('state', '完成').then(state => {
        console.log(state)
        Orders.findByIdPromise(req.body.id).then(row => {
            const orders = new Orders(row)
            orders.id_prop_state = state.id
            orders.savePromise().then(() => res.send({ state, timeLast: orders.timeLast }))
        })
    }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
})

apiState.put('/back', (req, res) => {
    Orders.getPropPromise('state', '进行中').then(state => {
        Orders.findByIdPromise(req.body.id).then(row => {
            const orders = new Orders(row)
            orders.id_prop_state = state.id
            orders.savePromise().then(() => res.send({ elMessage: { message: '退回成功', type: 'success' }, state }))
        })
    }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
})

export { apiState }