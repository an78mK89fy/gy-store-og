import { defineStore } from 'pinia'
import { request } from '../request/request.js'

let queryTimer
export const useStoreClient = defineStore('client', {
    state: () => ({
        dialog: { show: false, client: '' }
    }),
    actions: {
        query(value, cb) {
            clearTimeout(queryTimer)
            queryTimer = setTimeout(() => {
                request.client.query(value).then(res => {
                    cb(res.data.list.map(item => ({ value: item.name })))
                }).catch(() => cb([]))
            }, 800);
        },
        add() {
            if (this.dialog.client) { request.client.add(this.dialog.client).then(() => this.dialog.show = false) }
        }
    }
})