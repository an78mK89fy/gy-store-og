import { pinyin } from 'pinyin-pro'
import { db } from '../database/dbConstructor.js'
class Orders extends (await db.constructorPromise('orders')) {
    /**
     * @param {object} params 
     * @param {string} params.id
     * @param {string} params.note
     * @param {number} params.timeCreate
     * @param {number} params.timeLast
     * @param {string} params.id_prop_state
     * @param {string} params.client
     * @param {string} params.hash
     */
    constructor(params) {
        super(params)
        this.timeCreate = params.timeCreate || Date.now()
    }
}

await Promise.all([
    // Orders.setPropPromise('type', ['整件', '分切']),
    Orders.setPropPromise('state', ['新', '已阅', '进行中', '完成'])
]).catch(err => { if (err) { console.error(err) } })

export { Orders }