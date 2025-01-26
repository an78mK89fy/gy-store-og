<script setup>
import { request } from '../../request/indexRequest.js'
import { reactive } from 'vue';

const user = {
    name: sessionStorage.getItem('userName'),
    logout() {
        ElMessageBox.confirm(
            '确定注销吗', user.name, {
            confirmButtonText: '注销',
            cancelButtonText: '取消',
            type: 'error',
        }).then(request.user.logout)
    }
}
const formSearch = reactive({ key: '0', value: '' })
function search() {
    if (!formSearch.value) { return ElMessage({ message: '搜索内容为空', type: 'warning' }) }
    request.orders.search(formSearch).then(res => {

    })
}
</script>

<template>
    <div class="header">
        <el-avatar>
            <el-popconfirm v-if="user.name" hide-icon :title="`你好，${user.name}。`" confirm-button-text="注销"
                confirm-button-type="danger" cancel-button-text="改密码" cancel-button-type="info" @confirm="user.logout"
                @cancelEvent="">
                <template #reference>
                    <div class="userName" v-text="user.name.slice(-2)"></div>
                </template>
            </el-popconfirm>
            <RouterLink v-else to="/">登录</RouterLink>
        </el-avatar>
        <el-input v-model="formSearch.value" placeholder="enter = 搜索 | 点击=>" clearable>
            <template #prepend>
                <el-select v-model="formSearch.key" style="width: 115px">
                    <el-option label="客户名称" value="0" />
                    <el-option label="单据编号" value="1" />
                </el-select>
            </template>
            <template #append><el-button @click="search">搜索</el-button></template>
        </el-input>
    </div>
</template>

<style scoped>
div.header {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-avatar:hover {
        cursor: pointer;
    }

    .userName {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    a {
        white-space: nowrap
    }
}
</style>