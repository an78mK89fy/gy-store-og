import express from 'express'

import { db } from '../database/dbConstructor.js'
import { Orders } from '../constructor/orders.js'
import { mwVerifyToken } from '../middleware/mwVerifyToken.js'

const apiOrders = express.Router()

const idFinish = (await Orders.getPropPromise('state', '完成')).id
function getFilters() {
    const filters1 = `("timeLast">${Date.now() - (6 * 3600000)} AND "id_prop_state"='${idFinish}')`
    const filters2 = `"id_prop_state"!='${idFinish}'`
    return `${filters1} OR ${filters2}`
}

apiOrders.get('/list', (req, res) => {
    Orders.listPromise(0, getFilters()).then(result => {
        const orders = result.map(row => new Orders(row))
        Promise.all(orders.map(row => row.replaceIdPromise('id_prop_state')).concat(Orders.getPropPromise('state')))
            .then(result => res.send({ rows: orders, state: result[orders.length] }))
            .catch(result => res.send({ elMessage: { message: result, type: 'error' } }))
    })
})

apiOrders.get('/search/:key/:value', (req, res) => {
    const filtersSearch = `${+req.params.key ? '"gjpId"' : '"client"'}='${req.params.value}'`
    Orders.listPromise(0, `(${getFilters()}) AND ${filtersSearch}`).then(rows => {
        if (!rows?.length) { return res.end() }
        const orders = rows.map(row => new Orders(row))
        Promise.all(orders.map(row => row.replaceIdPromise('id_prop_state')))
            .then(() => res.send({ rows: orders }))
            .catch(result => res.send({ elMessage: { message: result, type: 'error' } }))
    }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
})

apiOrders.use(mwVerifyToken) // => 限登陆后操作

apiOrders.post('/save', (req, res) => {
    if (req.files?.length && req.body.client) {
        Orders.getPropPromise('state', '新').then(row => {
            if (!row) { return }
            const orders = new Orders({ ...req.body, id: req.files[0].filename, id_prop_state: row.id, timeLast: null })
            orders.savePromise().then(() => orders.replaceIdPromise('id_prop_state').then(() => {
                res.send({ orders, elMessage: { message: '成功', type: 'success' } })
            })).catch(result => res.send({ elMessage: { message: result, type: 'error' } }))
        }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
    } else { res.send({ elMessage: { message: '"单据编号"和"客户"必填', type: 'error' } }) }
})

apiOrders.delete('/del/:id', (req, res) => {
    db.run(`UPDATE "orders" SET "hidden"=1,"timeLast"=? WHERE "id"=?`, [Date.now(), req.params.id], err => {
        err ? res.send({ elMessage: { message: err.message, type: 'error' } }) : res.end()
    })
})

apiOrders.put('/state', (req, res) => {
    Orders.findByIdPromise(req.body.orders.id).then(row => {
        if (!row) { return }
        if (!(req.body.orders.timeLast === row.timeLast)) {
            return res.send({ elMessage: { message: row.hidden ? '订单已删除，刷新重试' : '订单变动，刷新重试', type: 'error' } })
        } // 最后修改时间不一致
        const timeLast = Date.now()
        db.run(
            `UPDATE "orders" SET "id_prop_state"=?,"timeLast"=? WHERE "id"=?`,
            [req.body.orders.id_prop_state, timeLast, req.body.orders.id], err => {
                if (!err) { res.send({ timeLast }) }
                else { res.send({ elMessage: { message: err.message, type: 'error' } }) }
            }
        )
    }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
})

export { apiOrders }