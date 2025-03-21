import express from 'express'
import { db } from '../../database/dbConstructor.js'
import { Todo } from '../../constructor/todo.js'
import { Commit } from '../../constructor/commit.js'

const apiCommit = express.Router()

apiCommit.post('/save', (req, res) => {
    if (!(+req.body.count > 0 && req.body.id_todo)) { return }
    Todo.findByIdPromise(req.body.id_todo).then(row => {
        if (row.state !== '进行中') { return }
        if (req.body.id) { // 修改
            Commit.findByIdPromise(req.body.id).then(row => {
                const commit = new Commit(row)
                commit.count = +req.body.count
                console.log(req.files)
                if (req.files) { commit.img = req.files[0].filename }
                commit.savePromise().then(() => {
                    res.send({ elMessage: { message: '修改成功', type: 'success' } })
                }).catch((message) => res.send({ elMessage: { message, type: 'error' } }))
            }).catch((message) => res.send({ elMessage: { message, type: 'error' } }))
        } else { // 创建
            const img = req.files ? req.files[0].filename : null
            const commit = new Commit({ id_todo: req.body.id_todo, count: req.body.count, img, timeCreate: Date.now() })
            commit.savePromise().then(() => res.send({ elMessage: { message: '上传成功', type: 'success' } }))
                .catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
        }
    }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
})

apiCommit.delete('/delete', (req, res) => {
    if (!req.query.id) { return }
    db.run(`UPDATE "commit" SET "hidden"=1 WHERE "id"=?`, [req.query.id], err => {
        err ? res.send({ elMessage: { message: err.message, type: 'error' } }) : res.end()
    })
})

export { apiCommit }