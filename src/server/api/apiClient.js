import crypto from 'node:crypto'

import express from 'express'
import { pinyin } from 'pinyin-pro'
import { db } from '../database/dbConstructor.js'

const apiClient = express.Router()

apiClient.post('/add', (req, res) => {
    if (!req.body.client) { return }
    db.serialize(() => {
        req.body.client.split(' ').forEach(name => {
            const pyfl = pinyin(name, { pattern: 'first', separator: '', toneType: 'none' })
            db.run(
                `INSERT OR IGNORE INTO "client"("hidden","id","name","pyfl") VALUES(?,?,?,?)`,
                [0, crypto.randomUUID(), name, pyfl]
            )
        });
    })
    res.send({ elMessage: { message: '上传成功', type: 'success' } })
})

apiClient.get('/query', (req, res) => {
    if (!req.query?.pyfl) { return }
    db.get(`SELECT * FROM "client" WHERE "name"=?`, [req.query.pyfl], (err, row) => {
        if (err) { return res.send({ elMessage: { message: err.message, type: 'error' } }) }
        if (row) { res.send({ has: 1 }) } else {
            const isPyfl = pinyin(req.query.pyfl, { pattern: 'first', separator: '', toneType: 'none' }) === req.query.pyfl
            db.all(`SELECT * FROM "client" WHERE "${isPyfl ? 'pyfl' : 'name'}" LIKE ?`, [`%${req.query.pyfl}%`], (err, rows) => {
                if (err) { return res.send({ elMessage: { message: err.message, type: 'error' } }) }
                res.send({ list: rows, elMessage: rows.length ? undefined : { message: '无此客户', type: 'warning' } })
            })
        }
    })
})

export { apiClient }