import { defineStore } from "pinia"
import { request } from "../../request/request.js"
import { concatPaper } from "../../utils/concatPaper.js"
import { useStoreState } from "./useStoreState.js"

export const useStoreTodo = defineStore('todo', {
    state: () => ({
        cut: { show: false, orders: {}, id: '', form: { paper: '', grammage: '', width: '', length: '', count: '' } },
        progress: { show: false, isLoading: false, todo: {}, rows: [] }
    }),
    actions: {
        showCut(scope) {
            if (!scope.row.count) { return useStoreState().receive(scope) }
            this.cut.orders = scope.row; this.cut.show = true
        },
        clearCut() { for (let key in this.cut.form) { this.cut.form[key] = '' } },
        save() {
            const form = this.cut.form
            if (!(form.paper && form.grammage && form.width && form.length && form.count)) { return ElMessage({ message: '填写不完整', type: 'warning' }) }
            function getType(w, l) {
                if (w * l === 889 * 1194 && w === 889) { return '大度' }
                if (w * l === 889 * 1194 && l === 889) { return '大度反丝' }
                if (w * l === 787 * 1092 && w === 787) { return '正度' }
                if (w * l === 787 * 1092 && l === 787) { return '正度反丝' }
                return '特规'
            }
            ElMessageBox.confirm(
                `[${getType(+form.width, +form.length)}] ${form.count + '张'}
                重${(form.grammage * form.width * form.length * form.count / 1e12).toFixed(3)}吨`,
                concatPaper(form), { confirmButtonText: this.cut.id ? '修改' : '提交' }
            ).then(() => {
                request.orders.todo.save({ ...form, id_orders: this.cut.orders.id, id_todo: this.cut.id }).then(res => {
                    if (!res.data.todo) { return }
                    if (this.cut.id) { for (let key in this.progress.todo) { this.progress.todo[key] = res.data.todo[key] } }
                    else { this.cut.orders.todo.push(res.data.todo); this.cut.orders.id_prop_state = res.data.state }
                    this.clearCut()
                    this.cut.show = false
                })
            }).catch(() => { })
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
            this.progress.todo.concatPaper = [concatPaper(scope.row)]
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
                '确认删除吗', concatPaper(scope.row), {
                confirmButtonText: '删除', type: 'error'
            }).then(() => {
                request.orders.todo.delete(scope.row.id).then(res => {
                    if (res.data.elMessage) { return }; todo.splice(scope.$index, 1)
                })
            }).catch(() => { })
        }
    },
    getters: {
        paper: ({ progress: { todo } }) => [todo.paper, todo.grammage + 'g', todo.width, todo.length].join('*'),
        sum: ({ progress }) => progress.rows.map(row => row.count).reduce((p, c) => p + c, 0),
        src: ({ cut: { orders } }) => `${location.origin}/upload/${orders.img}`,
    }
})