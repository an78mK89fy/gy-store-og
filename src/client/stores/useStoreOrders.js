import { defineStore } from 'pinia'
import { request } from '../request/request.js'

export const useStoreOrders = defineStore('orders', {
    state: () => ({
        table: {
            state: [],
            rows: [],
            isLoading: false,
        },
        create: {
            form: { gjpId: '', client: '', file: {}, fileList: [], note: '' },
            isLoading: false
        }
    }),
    actions: {
        save(elForm) {
            if (this.create.form.gjpId && this.create.form.fileList.length) {
                if (this.create.form.gjpId.length !== 19) { return ElMessage({ message: '"单据编号"长度为19位', type: 'warning' }) }
                const formData = new FormData(elForm.$el)
                if (!formData.get('file').name) { formData.set('file', this.create.form.file) }
                this.create.isLoading = true
                request.orders.save(formData).then(res => {
                    this.create.isLoading = false
                    if (!res.data.orders) { return } // 没返回orders
                    this.table.rows.unshift(res.data.orders)
                    this.create.form.fileList.length = 0
                    elForm.resetFields()
                }).catch(() => this.create.isLoading = false)
            } else { ElMessage({ message: '"单据编号"或"切纸单"不得为空', type: 'warning' }) }
        },
        delete(row) {
            ElMessageBox.confirm(
                row.gjpId, '确认删除吗', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'error',
            }).then(() => {
                this.table.isLoading = true
                request.orders.delete(row.id).then(res => {
                    if (res.data.elMessage) { return }
                    const index = this.table.rows.findIndex(item => item.id === row.id)
                    this.table.rows.splice(index, 1)
                    this.table.isLoading = false
                }).catch(() => this.table.isLoading = false)
            })
        },
        state(event, row) {
            let stateValue
            switch (event.target.textContent) {
                case '开切': stateValue = '进行中'; break
                case '撤销': stateValue = '新'; break
                case '切完': stateValue = '完成'; break
                default: stateValue = event.target.textContent; break
            }
            const state = this.table.state.find(item => item.value === stateValue)
            if (row.id_prop_state.id === state.id) { return ElMessage({ message: `已经是"${stateValue}"状态`, type: 'warning' }) }
            this.table.isLoading = true
            request.orders.state({ id: row.id, timeLast: row.timeLast, id_prop_state: state.id }).then(res => {
                this.table.isLoading = false
                if (!res.data.timeLast) { return }
                row.hash = res.data.hash
                row.id_prop_state = state
                row.timeLast = res.data.timeLast
            }).catch(() => this.table.isLoading = false)
        },
        list(isRefresh) {
            this.table.isLoading = true
            request.orders.list().then(res => {
                if (!res.data.rows) { return this.table.isLoading = false } // 返回rows为空
                if (isRefresh) { ElMessage({ message: '刷新成功', type: 'success', duration: 1000 }) }
                this.table.rows = res.data.rows.reverse()
                this.table.isLoading = false
                if (!this.table.state.length) { this.table.state = res.data.state }
            })
        },
        search(form) {
            if (!form.value) { return this.list(true) }
            this.table.isLoading = true
            request.orders.search(form).then(res => {
                this.table.isLoading = false
                if (!res.data.rows) { return }
                this.table.rows = res.data.rows.reverse()
            })
        }
    },
    getters: {
        count: state => state.table.rows.length
    }
})