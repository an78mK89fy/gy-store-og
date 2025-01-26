<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router'

import { request } from '../request/indexRequest.js'
const router = useRouter()

const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1'

// 登录表单
const formLogin = reactive({
    phone: '',
    password: '',
    stay: false
})
// 登录
function userLogin(form) {
    new Promise((resolve, reject) => {
        if (form) { // 表单登录
            if (form.phone && form.password) { resolve() } // 检测输入框
            else { ElMessage({ message: '账户和密码不得为空' }) }
        } else { // 无表单token登陆验证
            const cookies = document.cookie ? document.cookie.split('; ') : [];
            const cookieToken = cookies.find(cookie => cookie.startsWith('token='));
            cookieToken ? resolve() : reject()
        }
    }).then(() => request.user.login(form).then(res => {
        if (res.data.user) { // 登陆成功
            sessionStorage.setItem('userName', res.data.user.name)
            router.push('main')
        }
    })).catch(new Function)
}
userLogin()
</script>

<template>
    <h1 class="title">国友纸业<br>Order Manage System<br>Part.AoGuang</h1>
    <el-card>
        <h1>login</h1>
        <el-form :model="formLogin" label-width="auto" label-position="top">
            <el-form-item label="账户" required>
                <el-input v-model="formLogin.phone" placeholder="手机号" clearable maxlength="11" show-word-limit />
            </el-form-item>
            <el-form-item label="密码" required>
                <el-input v-model="formLogin.password" type="password" placeholder="字母+数字(6~11)" clearable
                    show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="formLogin.stay" label="保持登录" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="userLogin(formLogin)">登录</el-button>
                <el-button type="info" @click="request.user.forget">忘记密码</el-button>
                <RouterLink to="admin" v-if="isLocal" style="margin-left: 36px;">
                    <el-button type="success">用户管理</el-button>
                </RouterLink>
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