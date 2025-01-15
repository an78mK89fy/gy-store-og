import express from 'express'

import { db } from '../database/dbConstructor.js'
import { Orders } from '../constructor/orders.js'

const apiOrders = express.Router()

apiOrders.post('/save', (req, res) => {
    console.log('b', req.body, 'fs', req.files, 'f', req.file)
    if (req.files.length && req.body.id) {
        Orders.getPropPromise('state', '新').then(row => {
            const orders = new Orders({
                id: req.files[0].filename,
                gjpId: req.body.id,
                note: req.body.note,
                timeCreate: Date.now(),
                id_prop_state: row.id
            })
            orders.savePromise().then(() => {
                orders.replaceIdPromise('id_prop_state').then(() => res.send({ orders }))
            }).catch(result => res.send({ elMessage: { message: result, type: 'error' } }))
        }).catch(err => res.send({ elMessage: { message: err.message, type: 'error' } }))
    } else { res.send({ elMessage: { message: '"单据编号"和"切纸单"必填', type: 'warning' } }) }
})

apiOrders.get('/list', async (req, res) => {
    const idFinish = (await Orders.getPropPromise('state', '完成')).id
    const filters1 = `("timeLast">${Date.now() - (6 * 3600000)} AND "id_prop_state"='${idFinish}')`
    const filters2 = `"id_prop_state"!='${idFinish}'`
    Orders.listPromise(`${filters1} OR ${filters2}`).then(result => {
        const reRows = result.map(row => new Orders(row))
        Promise.all(reRows.map(row => row.replaceIdPromise('id_prop_state')).concat(Orders.getPropPromise('state')))
            .then(result => res.send({ rows: reRows, state: result[reRows.length] }))
            .catch(result => res.send({ elMessage: { message: result, type: 'error' } }))
    })
})

apiOrders.delete('/del/:id', (req, res) => {
    db.run(`UPDATE "orders" SET "hidden"=1 WHERE "id"=?`, [req.params.id],
        err => err ? res.send({ elMessage: { message: err, type: 'error' } }) : res.end()
    )
})

apiOrders.post('/state', (req, res) => {
    db.run(
        `UPDATE "orders" SET "id_prop_state"=?,"timeLast"=? WHERE "id"=?`,
        [req.body.id.idState, Date.now(), req.body.id.idOrders], err => {
            if (err) { res.send({ elMessage: { message: err, type: 'error' } }) }
            else { res.end() }
        }
    )
})

export { apiOrders }