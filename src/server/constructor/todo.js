import { db } from '../database/dbConstructor.js'

class Todo extends (await db.constructorPromise('todo')) {
    constructor(params) {
        super(params)
    }
    reFinishPromise() {
        return new Promise((resolve, reject) => {
            db.get(`SELECT SUM("count") AS "sum" FROM "commit" WHERE "id_todo"=?`,
                [this.id], (err, finish) => {
                    if (err) { return reject(err) }
                    this.finish = finish?.sum; resolve(finish?.sum)
                })
        })
    }
    static getCommitPromise(id_todo) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM "commit" WHERE "id_todo"=? AND "hidden"=0', [id_todo], (err, rows) => {
                if (err) { reject(err) } else { resolve(rows) }
            })
        })
    }
}

export { Todo }