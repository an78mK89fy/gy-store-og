<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router'
import { request } from '../request/indexRequest.js';
import RebackUser from '../components/admin/RebackUser.vue';
import CopyPswd from '../components/admin/CopyPswd.vue';
const router = useRouter()
const isShow = reactive({ dialog: { rebackUser: false }, drawer: { createUser: false } })
const dialogPswd = reactive({ show: false, data: {} })
const formCreateUser = reactive({ phone: '', name: '', role: '' })
const tableUsers = ref([])
request.admin.list().then(res => tableUsers.value = res.data.users.reverse())
function resetFormCreateUser() { for (let key in formCreateUser) { formCreateUser[key] = '' } }
function alertPassword(res) {
    dialogPswd.data = res.data
    dialogPswd.show = true
}
function createUser(form) {
    if (formCreateUser.phone && formCreateUser.name) {
        if (formCreateUser.phone.length !== 11) { return ElMessage({ message: '手机号为11位', type: 'warning' }) }
        request.admin.create(form).then(res => {
            if (res.data.elMessage) { return }
            alertPassword(res)
            ElMessage({ message: `用户"${res.data.user.name}"创建成功`, type: 'success' })
            tableUsers.value.unshift(res.data.user)
            isShow.drawer.createUser = false
            resetFormCreateUser()
        })
    } else { ElMessage({ message: '手机号或姓名不得为空', type: 'warning' }) }
}
function editUser() { }
function forgetPassword(row) {
    ElMessageBox.confirm(row.name, '重置密码吗', {
        confirmButtonText: '重置', type: 'warning'
    }).then(() => request.admin.forget(row.id).then(alertPassword))
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
</script>

<template>
    <el-table :data="tableUsers" table-layout="auto" height="100%" stripe row-key="id">
        <el-table-column label="序" type="index" />
        <el-table-column prop="name">
            <template #header>姓名
                <el-button type="primary" @click="isShow.drawer.createUser = true" size="small" plain>
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
                        <el-button type="primary" plain size="small"
                            @click="isShow.dialog.rebackUser = true">恢复用户</el-button>
                    </template>
                </el-page-header>
            </template>
            <template #default="scope">
                <el-button type="info" plain @click="alertPassword">编辑</el-button>
                <el-button type="warning" plain @click="forgetPassword(scope.row)">重置密码</el-button>
                <el-button type="danger" plain round @click="deleteUser(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-drawer v-model="isShow.drawer.createUser" title="创建用户">
        <el-form v-model="formCreateUser" label-width="auto" label-position="top">
            <el-form-item label="手机号" required>
                <el-input v-model.trim="formCreateUser.phone" placeholder="登录用" maxlength="11" show-word-limit />
            </el-form-item>
            <el-form-item label="员工" required>
                <el-input v-model.trim="formCreateUser.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="createUser(formCreateUser)">创建</el-button>
                <el-button type="danger" plain @click="resetFormCreateUser">清空</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
    <CopyPswd v-model="dialogPswd"></CopyPswd>
    <RebackUser v-model="isShow.dialog.rebackUser"></RebackUser>
</template>

<style scoped></style>