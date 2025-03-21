import { defineStore } from 'pinia'
import { request } from '../request/request.js'

let queryTimer
export const useStorePaper = defineStore('paper', {
    state: () => ({
        dialog: { show: false, paper: '' }
    }),
    actions: {
        query(value, cb) {
            clearTimeout(queryTimer)
            queryTimer = setTimeout(() => {
                request.paper.query(value).then(res => {
                    cb(res.data.list.map(item => ({ value: item.name })))
                }).catch(() => cb([]))
            }, 600);
        },
        add() { if (this.dialog.paper) { request.paper.add(this.dialog.paper).then(() => this.dialog.show = false) } }
    }
})