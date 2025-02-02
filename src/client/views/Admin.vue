<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router'
import { request } from '../request/request.js';
import CopyPswd from '../components/admin/CopyPswd.vue';
import RebackUser from '../components/admin/RebackUser.vue';
const router = useRouter()
// tableUsers
const tableUsers = ref([])
function listTableUser() { request.admin.list().then(res => tableUsers.value = res.data.users.reverse()) }
listTableUser()
const dialogPswd = reactive({ show: false, data: {} })
function alertPassword(data) {
    dialogPswd.data = data
    dialogPswd.show = true
}
function forgetPassword(row) {
    ElMessageBox.confirm(row.name, '重置密码吗', {
        confirmButtonText: '重置', type: 'warning'
    }).then(() => request.admin.forget(row.id).then(res => alertPassword(res.data)))
}
function deleteUser(row) {
    ElMessageBox.confirm(row.name, '删除用户吗', {
        confirmButtonText: '删除', type: 'error'
    }).then(() => request.admin.delete(row.id).then(res => {
        if (res.data.elMessage?.type === 'success') {
            const index = tableUsers.value.findIndex(item => item.id === row.id)
            tableUsers.value.splice(index, 1)
        }
    }))
}
// drawerSaveUser
const drawerSaveUser = reactive({ show: false, type: '', form: { id: '', phone: '', name: '' } })
function resetFormSaveUser() { for (let key in drawerSaveUser.form) { drawerSaveUser.form[key] = '' } }
const user = {
    show(show, row) {
        if (row) { for (let key in drawerSaveUser.form) { drawerSaveUser.form[key] = row[key] } }
        drawerSaveUser.type = show
        drawerSaveUser.show = !!show
    },
    save() {
        if (drawerSaveUser.form.id) { // 检查是否有修改
            const row = tableUsers.value.find(row => row.id === drawerSaveUser.form.id)
            if (row.phone === drawerSaveUser.form.phone && row.name === drawerSaveUser.form.name) {
                return ElMessage({ message: '内容未发生变动', type: 'warning' })
            }
        } // 检查是否有填写
        if (drawerSaveUser.form?.phone && drawerSaveUser.form?.name) {
            if (drawerSaveUser.form.phone.length !== 11) { return ElMessage({ message: '手机号为11位', type: 'warning' }) }
            request.admin.save(drawerSaveUser.form).then(res => {
                if (res.data.elMessage) { return }
                ElMessage({ message: `用户"${res.data.user.name}"${drawerSaveUser.type}成功`, type: 'success' })
                if (res.data.lightPswd) { // 创建
                    alertPassword(res.data)
                    tableUsers.value.unshift(res.data.user)
                } else { // 修改
                    const index = tableUsers.value.findIndex(row => row.id === res.data.user.id)
                    tableUsers.value[index] = res.data.user
                }
                drawerSaveUser.show = false
            })
        } else { ElMessage({ message: '手机号或姓名不得为空', type: 'warning' }) }
    }
}
// RebackUser
const dialogRebackUser = ref(false)
</script>

<template>
    <el-table :data="tableUsers" table-layout="auto" height="100%" stripe row-key="id">
        <el-table-column label="序" type="index" />
        <el-table-column prop="name">
            <template #header>姓名
                <el-button type="primary" @click="user.show('创建')" size="small" plain>
                    创建
                </el-button type="primary">
            </template>
        </el-table-column>
        <el-table-column label="手机" prop="phone" />
        <el-table-column label="uid" prop="id"></el-table-column>
        <el-table-column>
            <template #header>
                <el-page-header @back="router.push('/')">
                    <template #content>
                        <el-button type="primary" plain size="small" @click="dialogRebackUser = true">恢复用户</el-button>
                        <el-button type="danger" text size="small" @click="dialogRebackUser = true">集体注销</el-button>
                    </template>
                </el-page-header>
            </template>
            <template #default="scope">
                <el-button type="info" plain @click="user.show('修改', scope.row)">编辑</el-button>
                <el-button type="warning" plain @click="forgetPassword(scope.row)">重置密码</el-button>
                <el-button type="danger" plain round @click="deleteUser(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- drawerSaveUser -->
    <el-drawer v-model="drawerSaveUser.show" :title="drawerSaveUser.type + '用户'" @closed="resetFormSaveUser">
        <el-form v-model="drawerSaveUser.form" label-width="auto" label-position="top">
            <el-form-item v-show="drawerSaveUser.form.id" label="uid" label-position="left">
                <el-tag v-text="drawerSaveUser.form.id" />
            </el-form-item>
            <el-form-item label="手机号" required>
                <el-input v-model.trim="drawerSaveUser.form.phone" placeholder="登录用" maxlength="11" show-word-limit />
            </el-form-item>
            <el-form-item label="员工" required>
                <el-input v-model.trim="drawerSaveUser.form.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="user.save" v-text="drawerSaveUser.type" />
                <el-button type="danger" plain @click="resetFormSaveUser">清空</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
    <CopyPswd v-model="dialogPswd"></CopyPswd>
    <RebackUser v-model="dialogRebackUser" :fn="{ alertPassword, listTableUser }" />
</template>

<style scoped></style>