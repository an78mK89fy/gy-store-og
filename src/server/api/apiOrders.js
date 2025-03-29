import express from 'express'
import { db } from '../database/dbConstructor.js'
import { Orders } from '../constructor/orders.js'
import { apiState } from './orders/apiState.js'
import { apiTodo } from './orders/apiTodo.js'
import { wecom } from '../transmitter/wecom.js'

const apiOrders = express.Router()

const idFinish = (await Orders.getPropPromise('state', '完成')).id

apiOrders.get('/list', (req, res) => {
    function getFilters(query) {
        const filters1 = `("timeLast">${Date.now() - (6 * 3600000)} AND "id_prop_state"='${idFinish}')`
        const filters2 = `"id_prop_state"!='${idFinish}'`
        const filters = `${filters1} OR ${filters2}`
        if (query.key) { return `${filters} AND "${query.key}"='${query.value}'` }
        else { return filters }
    } try {
        Orders.listPromise(0, getFilters(req.query)).then(rows => {
            const orders = rows.map(row => new Orders(row))
            Promise.all(
                orders.map(row => row.replaceIdPromise('id_prop_state'))
            ).then(() => Promise.all(orders.map(row => row.getTodoPromise())).then(() => {
                Promise.all(orders.map(row => new Promise((resolve, reject) => {
                    db.get(`SELECT "name" FROM "user" WHERE "id"=?`, [row.id_user], (err, user) => {
                        if (err) { reject(err) } else { row.id_user = user ? user.name : undefined; resolve(row) }
                    })
                })).concat(Orders.getPropPromise('state'))).then(result => {
                    res.send({ rows: orders, state: result[orders.length] })
                })
            })).catch(result => res.send({ elMessage: { message: result.message, type: 'error' } }))
        })
    }
    catch ({ message }) { res.send({ elMessage: { message, type: 'error' } }) }
})

apiOrders.post('/save', (req, res) => {
    if (req.body.id) { // 修改
        if (!(req.files.length || req.body.note || req.body.self)) { return }
        Orders.findByIdPromise(req.body.id).then(row => {
            if ((+req.body.timeLast || null) !== row.timeLast) { return res.send({ elMessage: { message: '订单变动，刷新重试', type: 'error' } }) }
            const timeLint = Date.now()
            const orders = new Orders({ ...row, timeLast: timeLint })
            if (+req.body.self !== row.self) { orders.self = req.body.self }
            if (req.files.length) { orders.img = req.files[0].filename }
            if (req.body.note) { orders.note = req.body.note }
            orders.editLine.unshift({
                img: req.files.length ? row.img : undefined,
                note: req.body.note ? row.note : undefined,
                timeLint
            })
            orders.savePromise().then(() => orders.replaceIdPromise('id_prop_state').then(() => {
                db.get('SELECT "name" FROM "user" WHERE "id"=?', [orders.id_user], (err, user) => {
                    if (err) { return res.send({ elMessage: { message: err.message, type: 'error' } }) }
                    orders.id_user = user?.name; res.send({ row: orders })
                    wecom.news({
                        hooks: process.env.SEV_WECOM_HOOKS_OG_ORDERS,
                        title: `*变动: ${orders.client}`, path: `?${orders.id}#id`,
                        description: `[状态] ${orders.id_prop_state.value}; ${orders.note}`
                    })
                })
            })).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
        }).catch(({ message }) => { res.send({ elMessage: { message, type: 'error' } }) })
    } else { // 提交
        if (req.files?.length && req.body.client) {
            Orders.getPropPromise('state', '新').then(state => {
                if (!state) { return }
                db.get('SELECT * FROM "client" WHERE "name"=?', [req.body.client], (err, row) => {
                    if (err) { return res.send({ elMessage: { message: err.message, type: 'error' } }) }
                    if (!row) { return }
                    const orders = new Orders({ ...req.body, img: req.files[0].filename, id_prop_state: state.id })
                    orders.savePromise().then(() => orders.replaceIdPromise('id_prop_state').then(() => {
                        res.send({ orders, elMessage: { message: '成功', type: 'success' } })
                        wecom.img({ hooks: process.env.SEV_WECOM_HOOKS_OG_ORDERS, img: orders.img })
                    })).catch(result => res.send({ elMessage: { message: result, type: 'error' } }))
                })
            }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
        } else { res.send({ elMessage: { message: '"客户"和"切纸单"必填', type: 'error' } }) }
    }
})

apiOrders.delete('/del', (req, res) => {
    if (!req.query.id) { return }
    Orders.findByIdPromise(req.query.id).then(row => {
        if (!row) { return }
        const orders = new Orders({ ...row, timeLast: Date.now(), hidden: 1 })
        orders.savePromise().then(() => orders.replaceIdPromise('id_prop_state').then(() => {
            res.end(); wecom.news({
                hooks: process.env.SEV_WECOM_HOOKS_OG_ORDERS,
                title: `x取消: ${orders.client}`, path: `?${orders.id}#id`,
                description: `[状态] ${orders.id_prop_state.value}; ${orders.note}`
            })
        }))
    }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
})

apiOrders.get('/id', (req, res) => {
    if (!req.query.id) { return }
    Orders.findByIdPromise(req.query.id).then(row => res.send({ row: new Orders(row) }))
})

apiOrders.use('/state', apiState)
apiOrders.use('/todo', apiTodo)

export { apiOrders }