import { db } from '../database/dbConstructor.js'

class Orders extends (await db.constructorPromise('orders')) {
    /**
     * @param {Object} params 
     * @param {string} params.id
     * @param {string} params.gjpId
     * @param {string} params.note
     * @param {number} params.timeCreate
     * @param {number} params.state
     */
    constructor(params) {
        super(params)
    }
}

await Promise.all([
    Orders.setPropPromise('type', ['整件', '分切']),
    Orders.setPropPromise('state', ['新', '已阅', '进行中', '完成'])
]).catch(err => { if (err) { console.log(err) } })


export { Orders }