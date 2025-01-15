<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router'

import { request } from '../request/indexRequest.js'
const router = useRouter()

const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1'

// 登录表单
const formLogin = reactive({
    account: '',
    password: ''
})
// 登录
function userLogin(form) {
    new Promise(resolve => {
        if (form) { // 表单登录
            if (form.account && form.password) { resolve() } // 检测输入框
            else { ElMessage({ message: '账户和密码不得为空' }) }
        } else { resolve() } // 无表单token登陆验证
    }).then(() => {
        request.user.login(form).then(res => {
            if (res.data.user) { // 登陆成功
                sessionStorage.setItem('userName', res.data.user.name)
                console.log('11')
                router.push('main')
            } else { ElMessage(res.data.elMessage) } // 登陆失败
        }).catch(result => { if (form) ElMessage({ message: result, type: 'error' }) })
    })
}
userLogin()
</script>

<template>
    <h1 class="title">国友纸业<br>Order Manage System<br>Part.AoGuang</h1>
    <el-card>
        <h1>login</h1>
        <el-form :model="formLogin" label-width="auto" label-position="top">
            <el-form-item label="账户">
                <el-input v-model="formLogin.account" placeholder="手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formLogin.password" type="password" placeholder="大小写字母+数字" clearable
                    show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="userLogin(formLogin)">登录</el-button>
                <el-button type="info">忘记密码</el-button>
                <el-button v-if="isLocal" type="success">
                    <RouterLink to="admin">用户管理</RouterLink>
                </el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <div class="onlyRead">
        <RouterLink to="/main">
            <el-button>仅查看</el-button>
        </RouterLink>
    </div>
</template>

<style scoped>
h1.title {
    text-align: center;
}

.el-card {
    width: min(max(30%, 500px), 100%);
    margin: auto;
}

a {
    all: inherit;
}

div.onlyRead {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8em;
}
</style>