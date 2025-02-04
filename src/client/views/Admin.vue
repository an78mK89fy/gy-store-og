<script setup>
import { useStoreAdmin } from '../stores/useStoreAdmin.js';
import { useRouter } from 'vue-router'
import { request } from '../request/request.js';
import { regEx } from '../../utils/regEx.js';
import CopyPswd from '../components/admin/CopyPswd.vue';
import RebackUser from '../components/admin/RebackUser.vue';
const router = useRouter()
const storeAdmin = useStoreAdmin(), { drawerSave, dialogReback } = storeAdmin
// tableUsers
storeAdmin.list()
// drawerSave
const rules = {
    phone: [{ trigger: 'blur', required: true, message: '"手机号"必填' }, {
        trigger: 'blur', validator: (r, v, cb) => regEx.phone.test(v) ? cb() : cb(new Error('"手机号"格式不正确'))
    }],
    name: [{ trigger: 'blur', required: true, message: '"姓名"必填' }, {
        trigger: 'change', validator: (r, v, cb) => regEx.name.test(v) ? cb() : cb(new Error('"姓名"格式不正确'))
    }]
}
</script>

<template>
    <el-table :data="storeAdmin.table" table-layout="auto" height="100%" stripe row-key="id">
        <el-table-column label="序" type="index" />
        <el-table-column prop="name">
            <template #header>姓名
                <el-button type="primary" @click="storeAdmin.showDrawerSave('创建')" size="small" plain>
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
                        <el-button type="primary" plain size="small" @click="dialogReback.show = true">恢复用户</el-button>
                        <el-popconfirm title="集体注销确认" confirm-button-text="注销" confirm-button-type="danger"
                            @confirm="request.admin.logout">
                            <template #reference>
                                <el-button type="danger" text size="small">集体注销</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-page-header>
            </template>
            <template #default="scope">
                <el-button type="info" plain @click="storeAdmin.showDrawerSave('修改', scope.row)">编辑</el-button>
                <el-button type="warning" plain @click="storeAdmin.forget(scope.row)">重置密码</el-button>
                <el-button type="danger" plain round @click="storeAdmin.delete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- drawerSave -->
    <el-drawer v-model="drawerSave.show" :title="drawerSave.type + '用户'" @closed="storeAdmin.resetSaveForm">
        <el-form :model="drawerSave.form" :rules="rules" label-width="auto" label-position="top">
            <el-form-item v-show="drawerSave.form.id" label="uid" label-position="left">
                <el-tag v-text="drawerSave.form.id" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model.trim="drawerSave.form.phone" placeholder="登录用" maxlength="11" show-word-limit
                    clearable />
            </el-form-item>
            <el-form-item label="员工" prop="name">
                <el-input v-model.trim="drawerSave.form.name" placeholder="姓名" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="storeAdmin.save" v-text="drawerSave.type"
                    :disabled="!drawerSave.form.phone && !drawerSave.form.name" />
                <el-button type="danger" plain v-show="drawerSave.form.phone && drawerSave.form.name"
                    @click="storeAdmin.resetSaveForm">清空</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
    <CopyPswd></CopyPswd>
    <RebackUser></RebackUser>
</template>

<style scoped></style>