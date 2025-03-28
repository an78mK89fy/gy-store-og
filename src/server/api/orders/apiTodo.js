import express from 'express'
import { db } from '../../database/dbConstructor.js'
import { apiCommit } from './apiCommit.js'
import { Orders } from '../../constructor/orders.js'
import { Todo } from '../../constructor/todo.js'

const apiTodo = express.Router()
apiTodo.use('/commit', apiCommit)

apiTodo.post('/save', (req, res) => {
    try {
        const form = req.body.form
        console.log(form)
        if (!(form.id_orders && form.index && form.count)) { return }
        if (form.id_todo) { // 修改
            Todo.findByIdPromise(form.id_todo).then(row => {
                const todo = new Todo({ ...row, ...form })
                todo.savePromise().then(() => res.send({ todo, elMessage: { message: '修改成功', type: 'success' } }))
            })
        } else { // 创建
            const todo = new Todo({ ...form, state: '进行中' })
            todo.savePromise().then(() => {
                Orders.getPropPromise('state', '进行中').then(row => {
                    db.run('UPDATE "orders" SET "id_prop_state"=? WHERE "id"=?', [row.id, todo.id_orders], err => {
                        if (err) { throw new Error("orders状态修改失败") }
                        res.send({ todo, state: row, elMessage: { message: '提交成功', type: 'success' } })
                    })
                })
            }).catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
        }
    } catch ({ message }) { res.send({ elMessage: { message, type: 'error' } }) }
})

apiTodo.put('/state', (req, res) => {
    db.run('UPDATE "todo" SET "state"=? WHERE "id"=?', [req.body.state.data, req.body.state.id], err => {
        if (err) { return res.send({ elMessage: { message: err.message, type: 'error' } }) }
        res.end()
    })
})

apiTodo.delete('/delete', (req, res) => {
    if (!req.query.id) { return }
    db.run('UPDATE "todo" SET "hidden"=1 WHERE "id"=?', [req.query.id],
        err => err ? res.send({ elMessage: { message: err.message, type: 'error' } }) : res.end())
})

apiTodo.get('/progress', (req, res) => {
    if (!req.query.id) { return }
    Todo.getCommitPromise(req.query.id).then(rows => res.send({ rows }))
        .catch(({ message }) => res.send({ elMessage: { message, type: 'error' } }))
})

export { apiTodo }