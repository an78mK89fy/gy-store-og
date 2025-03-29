import { defineStore } from 'pinia'
import { request } from '../request/request.js'

export const useStoreOrders = defineStore('orders', {
    state: () => ({
        table: { state: [], rows: [], isLoading: false }, dialogPreview: { show: false, url: '' },
        formSave: { isLoading: false, form: { index: [], id: false, client: '', file: {}, fileList: [], note: '', self: false } },
        dialogEditLine: { show: false, row: {} },
    }),
    actions: {
        save(elForm) {
            this.formSave.isLoading = true
            const formData = new FormData(elForm.$el)
            if (this.formSave.form.id) { // 修改
                const index = this.formSave.form.index[0].split(' ')[1] - 1
                if (this.table.rows[index].note === this.formSave.form.note
                    && !this.formSave.form.fileList.length
                    && !!this.table.rows[index].self === this.formSave.form.self
                ) { return ElMessage({ message: '内容无修改', type: 'warning' }) }
                formData.set('id', this.formSave.form.id)
                if (this.formSave.form.fileList.length && !formData.get('file')?.name) {
                    formData.set('file', this.formSave.form.file)
                }
                if (!!this.table.rows[index].self !== this.formSave.form.self) { formData.set('self', this.formSave.form.self ? '1' : '0') }
                if (this.table.rows[index].note === this.formSave.form.note) { formData.delete('note') }
                if (this.table.rows[index].timeLast) { formData.set('timeLast', this.table.rows[index].timeLast) }
                request.orders.save(formData).then(res => {
                    this.formSave.isLoading = false
                    if (!res.data.row) { return } // 没返回row
                    this.table.rows[index] = res.data.row
                    this.formSave.form.fileList.length = 0
                    elForm.resetFields()
                }).catch(() => this.formSave.isLoading = false)
            } else { // 创建
                if (this.formSave.form.client && this.formSave.form.fileList.length) {
                    request.client.has(this.formSave.form.client).then(res => {
                        if (!res.data.has) { return this.formSave.isLoading = false }
                        if (!formData.get('file').name) { formData.set('file', this.formSave.form.file) }
                        request.orders.save(formData).then(res => {
                            this.formSave.isLoading = false
                            if (!res.data.orders) { return } // 没返回orders
                            this.table.rows.unshift(res.data.orders)
                            this.formSave.form.fileList.length = 0
                            elForm.resetFields()
                        }).catch(() => this.formSave.isLoading = false)
                    })
                } else { ElMessage({ message: '"客户"或"切纸单"不得为空', type: 'warning' }) }
            }
        },
        edit(scope) {
            this.formSave.form.fileList.length = 0
            this.formSave.form.index = [`序号: ${scope.$index + 1}`]
            this.formSave.form.id = scope.row.id
            this.formSave.form.client = scope.row.client
            this.formSave.form.note = scope.row.note
            this.formSave.form.self = !!scope.row.self
        },
        delete(scope) {
            ElMessageBox.confirm(
                '确认删除吗', scope.row.client, {
                confirmButtonText: '删除',
                type: 'error',
            }).then(() => {
                this.table.isLoading = true
                request.orders.delete(scope.row.id).then(res => {
                    if (res.data.elMessage) { return }
                    const index = this.table.rows.findIndex(item => item.id === scope.row.id)
                    this.table.rows.splice(scope.$index, 1)
                    this.table.isLoading = false
                }).catch(() => this.table.isLoading = false)
            }).catch(() => { })
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
            request.orders.list(form).then(res => {
                this.table.isLoading = false
                if (!res.data.rows) { return }
                this.table.rows = res.data.rows.reverse()
            })
        },
        preview() {
            this.dialogPreview.show = true
            this.dialogPreview.url = document.querySelector('img.el-upload-list__item-thumbnail').src
        },
        showEditLine(row) { this.dialogEditLine.row = row; this.dialogEditLine.show = true },
        getType(value) {
            switch (value) {
                case '新': return 'danger'
                case '已阅': return 'warning'
                case '完成': return 'success'
                default: return 'primary'
            }
        }
    },
    getters: { count: state => state.table.rows.filter(row => row.id_prop_state.value !== '完成').length }
})