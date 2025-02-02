import express from 'express'
import { pinyin } from 'pinyin-pro'

import { db } from '../database/dbConstructor.js'
import { Orders } from '../constructor/orders.js'
import { mwVerifyToken } from '../middleware/mwVerifyToken.js'

const apiOrders = express.Router()

apiOrders.get('/list', async (req, res) => {
    const idFinish = (await Orders.getPropPromise('state', '完成')).id
    const filters1 = `("timeLast">${Date.now() - (6 * 3600000)} AND "id_prop_state"='${idFinish}')`
    const filters2 = `"id_prop_state"!='${idFinish}'`
    Orders.listPromise(0, `${filters1} OR ${filters2}`).then(result => {
        const orders = result.map(row => new Orders(row))
        Promise.all(orders.map(row => row.replaceIdPromise('id_prop_state')).concat(Orders.getPropPromise('state')))
            .then(result => res.send({ rows: orders, state: result[orders.length] }))
            .catch(result => res.send({ elMessage: { message: result, type: 'error' } }))
    })
})

apiOrders.get('/search/:key/:value', (req, res) => {
    if (+req.params.key) { // 单据编号
        Orders.listPromise(0,).then(rows => {
            console.log(rows)
            res.end()
        }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
    } else { // 客户名称

    }
})

apiOrders.use(mwVerifyToken) // => 限登陆后操作

apiOrders.post('/save', (req, res) => {
    if (req.files.length && req.body.gjpId) {
        Orders.getPropPromise('state', '新').then(row => {
            const orders = new Orders({
                ...req.body, id: req.files[0].filename, timeCreate: Date.now(), id_prop_state: row.id
            })
            orders.savePromise().then(() => orders.replaceIdPromise('id_prop_state').then(() => res.send({
                orders, elMessage: { message: '成功', type: 'success' }
            }))).catch(result => res.send({ elMessage: { message: result, type: 'error' } }))
        }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
    } else { res.send({ elMessage: { message: '"单据编号"和"切纸单"必填', type: 'error' } }) }
})

apiOrders.delete('/del/:id', (req, res) => {
    db.run(`UPDATE "orders" SET "hidden"=1 WHERE "id"=?`, [req.params.id], err => {
        err ? res.send({ elMessage: { message: err.message, type: 'error' } }) : res.end()
    })
})

apiOrders.put('/state', (req, res) => {
    Orders.findByIdPromise(req.body.orders.id).then(row => {
        if (!(req.body.orders.timeLast === row.timeLast)) {
            return res.send({ elMessage: { message: '订单变动，刷新重试', type: 'warning' } })
        } // 最后修改时间不一致
        const timeLast = Date.now()
        db.run(
            `UPDATE "orders" SET "id_prop_state"=?,"timeLast"=? WHERE "id"=?`,
            [req.body.orders.id_prop_state, timeLast, req.body.orders.id], err => {
                if (!err) { res.send({ timeLast }) }
                else { res.send({ elMessage: { message: err.message, type: 'error' } }) }
            }
        )
    })
})

export { apiOrders }