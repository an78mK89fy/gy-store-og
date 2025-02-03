import { defineStore } from "pinia";
import { request } from '../request/request.js';
import { regEx } from "../../utils/regEx.js";

const alertPassword = Symbol('alertPassword')
export const useStoreAdmin = defineStore('admin', {
    state: () => ({
        table: [],
        drawerSave: { show: false, type: '', form: { id: '', phone: '', name: '' } },
        dialogPswd: { show: false, data: {} },
        dialogReback: { show: false, rows: [] }
    }),
    actions: {
        list(isReback) {
            request.admin.list(isReback).then(res => {
                if (!res.data.rows) { return }
                if (!isReback) { this.table = res.data.rows.reverse() }
                else { this.dialogReback.rows = res.data.rows.reverse() }
            })
        },
        [alertPassword](data) { this.dialogPswd.data = data; this.dialogPswd.show = true },
        forget(row) {
            ElMessageBox.confirm(row.name, '重置密码吗', {
                confirmButtonText: '重置', type: 'warning'
            }).then(() => request.admin.forget(row.id).then(res => this[alertPassword](res.data)))
        },
        delete(row) {
            ElMessageBox.confirm(row.name, '删除用户吗', {
                confirmButtonText: '删除', type: 'error'
            }).then(() => request.admin.delete(row.id).then(res => {
                if (res.data.elMessage?.type === 'success') {
                    const index = this.table.findIndex(item => item.id === row.id)
                    this.table.splice(index, 1)
                }
            })).catch(new Function)
        },
        showDrawerSave(show, row) {
            if (row) { for (let key in this.drawerSave.form) { this.drawerSave.form[key] = row[key] } }
            this.drawerSave.type = show
            this.drawerSave.show = !!show
        },
        save() {
            if (this.drawerSave.form.id) { // 检查是否有修改
                const row = this.table.find(row => row.id === this.drawerSave.form.id)
                if (row.phone === this.drawerSave.form.phone && row.name === this.drawerSave.form.name) {
                    return ElMessage({ message: '内容未发生变动', type: 'warning' })
                }
            } // 检查是否有填写
            if (this.drawerSave.form?.phone && this.drawerSave.form?.name) {
                if (this.drawerSave.form.phone.length !== 11) { return ElMessage({ message: '手机号为11位', type: 'warning' }) }
                request.admin.save(this.drawerSave.form).then(res => {
                    if (res.data.elMessage) { return }
                    ElMessage({ message: `用户"${res.data.user.name}"${this.drawerSave.type}成功`, type: 'success' })
                    if (res.data.lightPswd) { // 创建
                        this[alertPassword](res.data)
                        this.table.unshift(res.data.user)
                    } else { // 修改
                        const index = this.table.findIndex(row => row.id === res.data.user.id)
                        this.table[index] = res.data.user
                    }
                    this.drawerSave.show = false
                })
            } else { ElMessage({ message: '手机号或姓名不得为空', type: 'warning' }) }
        },
        resetSaveForm() { for (let key in this.drawerSave.form) { this.drawerSave.form[key] = '' } },
        reback(row) {
            const send = (result = { value: '00000000000' }) => {
                console.log(result)
                request.admin.reback({ id: row.id, phone: result.value }).then(res => {
                    this[alertPassword](res.data)
                    this.list(1)
                })
            }
            if (row.id === '00000000-0000-0000-0000-000000000000') { return send() }
            ElMessageBox.prompt(row.id, row.name, {
                inputType: 'number',
                inputPlaceholder: '11位手机号',
                confirmButtonText: '恢复',
                inputPattern: regEx.phone,
                inputErrorMessage: '"手机号"格式不正确'
            }).then(send).catch(new Function)
        }
    }
})