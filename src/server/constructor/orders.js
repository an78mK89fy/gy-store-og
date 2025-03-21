import { db } from '../database/dbConstructor.js'

class Orders extends (await db.constructorPromise('orders')) {
    constructor(params) {
        super(params)
        this.timeCreate = params.timeCreate || Date.now()
        if (typeof (params.editLine || undefined) === 'string') { this.editLine = JSON.parse(params.editLine) }
        else { this.editLine = [] }
    }
    img2obj() { this.editLine = JSON.parse(this.editLine); return this }
    img2json() { this.editLine = JSON.stringify(this.editLine); return this }
    savePromise() {
        if ((typeof this.editLine) === 'object') { this.img2json() }
        this.timeLast = Date.now()
        return super.savePromise(() => { if ((typeof this.editLine) === 'string') { this.img2obj() } })
    }
    getTodoPromise() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM "todo" WHERE "id_orders"=? AND "hidden"=0`, [this.id], (err, rows) => {
                if (err) { reject(err) } else { this.todo = rows; resolve(rows) }
            })
        })
    }
}

await Promise.all([
    // Orders.setPropPromise('type', ['整件', '分切']),
    Orders.setPropPromise('state', ['新', '已阅', '进行中', '完成'])
]).catch(err => { if (err) { console.error(err) } })

export { Orders }