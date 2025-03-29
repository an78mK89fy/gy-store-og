import { defineStore } from "pinia"
import { request } from "../../request/request.js"
import { useStoreState } from "./useStoreState.js"

export const useStoreTodo = defineStore('todo', {
    state: () => ({
        cut: { show: false, orders: {}, id: '', form: { index: 1, count: '' } },
        progress: { show: false, isLoading: false, todo: {}, rows: [] }
    }),
    actions: {
        showCut(scope) {
            if (!scope.row.count) { return useStoreState().receive(scope) }
            this.cut.orders = scope.row; this.cut.show = true
        },
        clearCut() { for (let key in this.cut.form) { { this.cut.form[key] = key === 'index' ? 1 : '' } } },
        save() {
            request.orders.todo.save({
                ...this.cut.form, id_orders: this.cut.orders.id, id_todo: this.cut.id || undefined
            }).then(res => {
                if (!res.data.todo) { return }
                if (this.cut.id) { for (let key in this.progress.todo) { this.progress.todo[key] = res.data.todo[key] } }
                else { this.cut.orders.todo.push(res.data.todo); this.cut.orders.id_prop_state = res.data.state }
                this.cut.count = ''
                this.cut.show = false
            })
        },
        state(id, state) {
            request.orders.todo.state({ id, data: state }).then(res => {
                if (res.data.elMessage) { return }
                this.progress.todo.state = state
                if (state === '完成') { this.progress.show = false }
            })
        },
        showProgress(todo, orders) {
            this.progress.todo = todo
            this.cut.orders = orders
            this.progress.isLoading = true
            request.orders.todo.progress(todo.id).then(res => {
                if (!res.data.rows) { return }
                this.progress.rows = res.data.rows.reverse()
                this.progress.isLoading = false
            }).catch(() => this.progress.isLoading = false)
            if (!this.progress.show) { this.progress.show = true }
        },
        edit(orders, scope) {
            this.cut.orders = orders.row
            this.progress.todo = scope.row
            this.cut.id = scope.row.id
            for (let key in this.cut.form) { this.cut.form[key] = scope.row[key] }
            this.showCut(orders)
        },
        closeEdit() {
            this.cut.show = false
            this.cut.orders = {}
            this.progress.todo = {}
            this.clearCut()
            this.cut.id = ''
        },
        delete(scope, todo) {
            ElMessageBox.confirm(
                '确认删除吗', `${scope.row.count}张`, {
                confirmButtonText: '删除', type: 'error'
            }).then(() => {
                request.orders.todo.delete(scope.row.id).then(res => {
                    if (res.data.elMessage) { return }; todo.splice(scope.$index, 1)
                })
            }).catch(() => { })
        }
    },
    getters: {
        sum: ({ progress }) => progress.rows.map(row => row.count).reduce((p, c) => p + c, 0),
        src: ({ cut: { orders } }) => `${location.origin}/upload/${orders.img}`,
    }
})