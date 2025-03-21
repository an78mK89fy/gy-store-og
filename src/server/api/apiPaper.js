import crypto from 'node:crypto'

import express from 'express'
import { pinyin } from 'pinyin-pro'
import { db } from '../database/dbConstructor.js'

const apiPaper = express.Router()

apiPaper.post('/add', (req, res) => {
    if (!req.body.paper) { return }
    db.serialize(() => {
        req.body.paper.split(' ').forEach(name => {
            const pyfl = pinyin(name, { pattern: 'first', separator: '', toneType: 'none' })
            db.run(
                `INSERT OR IGNORE INTO "paper"("hidden","id","name","pyfl") VALUES(?,?,?,?)`,
                [0, crypto.randomUUID(), name, pyfl]
            )
        });
    })
    res.send({ elMessage: { message: '上传成功', type: 'success' } })
})

apiPaper.get('/query', (req, res) => {
    if (!req.query?.pyfl) { return }
    db.all(`SELECT * FROM "paper" WHERE "pyfl" LIKE ?`, [`%${req.query.pyfl}%`], (err, rows) => {
        if (err) { return res.send({ elMessage: { message: err.message, type: 'error' } }) }
        res.send({ list: rows, elMessage: rows.length ? undefined : { message: '无此纸张', type: 'warning' } })
    })
})

export { apiPaper }