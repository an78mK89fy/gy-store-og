import { defineStore } from 'pinia'
import { request } from '../request/request.js'

export const useStoreOrders = defineStore('orders', {
    state: () => ({
        table: { state: [], rows: [], isLoading: false }, dialogPreview: { show: false, url: '' },
        formSave: { isLoading: false, form: { index: [], id: false, client: '', file: {}, fileList: [], note: '' } },
        dialogEditLine: { show: false, row: {} }
    }),
    actions: {
        save(elForm) {
            this.formSave.isLoading = true
            const formData = new FormData(elForm.$el)
            if (this.formSave.form.id) { // 修改
                formData.set('id', this.formSave.form.id)
                if (this.formSave.form.fileList.length && !formData.get('file')?.name) {
                    formData.set('file', this.formSave.form.file)
                }
                const index = this.formSave.form.index[0].split(' ')[1] - 1
                if (this.table.rows[index].note === this.formSave.form.note) { formData.delete('note') }
                if (this.table.rows[index].timeLast) { formData.set('timeLast', this.table.rows[index].timeLast) }
                if (this.table.rows[index].note === this.formSave.form.note && !this.formSave.form.fileList.length) {
                    return ElMessage({ message: '内容无修改', type: 'warning' })
                }
                request.orders.save(formData).then(res => {
                    this.formSave.isLoading = false
                    if (!res.data.row) { return } // 没返回row
                    this.table.rows[index] = res.data.row
                    this.formSave.form.fileList.length = 0
                    elForm.resetFields()
                }).catch(() => this.formSave.isLoading = false)
            } else { // 创建
                if (this.formSave.form.client && this.formSave.form.fileList.length) {
                    request.client.query(this.formSave.form.client).then(res => {
                        if (!res.data.has) { ElMessage({ message: '"客户"不存在' }); return this.formSave.isLoading = false }
                        if (!formData.get('file').name) { formData.set('file', this.formSave.form.file) }
                        request.orders.save(formData).then(res => {
                            this.formSave.isLoading = false
                            if (!res.data.orders) { return } // 没返回orders
                            this.table.rows.unshift(res.data.orders)
                            console.log(res.data.orders)
                            this.formSave.form.fileList.length = 0
                            elForm.resetFields()
                        }).catch(() => this.formSave.isLoading = false)
                    })
                } else { ElMessage({ message: '"单据编号"或"切纸单"不得为空', type: 'warning' }) }
            }
        },
        edit(scope) {
            this.formSave.form.fileList.length = 0
            this.formSave.form.index = [`序号: ${scope.$index + 1}`]
            this.formSave.form.id = scope.row.id
            this.formSave.form.client = scope.row.client
            this.formSave.form.note = scope.row.note
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
        },
        preview() {
            this.dialogPreview.show = true
            this.dialogPreview.url = document.querySelector('img.el-upload-list__item-thumbnail').src
        },
        showEditLine(row) {
            this.dialogEditLine.row = row
            this.dialogEditLine.show = true
        },
    },
    getters: { count: state => state.table.rows.length }
})