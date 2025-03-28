<script setup>
import { useStoreOrders } from '../../stores/useStoreOrders.js';
import { useStoreClient } from '../../stores/useStoreClient.js';
import { reactive } from 'vue';
import { request } from '../../request/request.js'
import { regEx } from '../../../utils/regEx.js';

const storeOrders = useStoreOrders(), { query } = useStoreClient()
// 用户
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
// 搜索
const formSearch = reactive({ key: 'client', value: '' })
// 改密码
const dialogPswd = reactive({ show: false, form: { old: '', new: '', password: '' } })
user.forget = form => {
    if (form.new !== form.password) { return ElMessage({ message: '新密码两次不一致', type: 'warning' }) }
    if (form.old === form.new) { return ElMessage({ message: '新密码与原密码相同', type: 'warning' }) }
    request.user.password({ ...form, new: undefined })
}
const rules = {
    old: [{ trigger: 'blur', required: true, message: '"当前密码"必填' }],
    new: [{ trigger: 'blur', required: true, message: '"设置密码"必填' }, {
        trigger: 'blur', validator: (rule, value, cb) => {
            if (7 < value.length && value.length < 19) { cb() }
            else { cb(new Error('"新密码"长度8~18位')) }
        }
    }, {
        trigger: 'blur', validator: (r, v, cb) => regEx.password.test(v) ? cb() : cb(new Error('"新密码"必须包含: 字母和数字'))
    }],
    password: [{ trigger: 'blur', required: true, message: '"验证密码"必填' }, {
        trigger: 'change', validator: (r, v, cb) => {
            if (dialogPswd.form.new === dialogPswd.form.password) { cb() }
            else { cb(new Error('"新密码"两次密码不一致')) }
        }
    }]
}
</script>

<template>
    <div>
        <div class="header">
            <!-- 头像 -->
            <el-avatar>
                <el-popconfirm v-if="user.name" hide-icon :title="`你好，${user.name}。`" confirm-button-text="注销"
                    confirm-button-type="danger" cancel-button-text="改密码" cancel-button-type="info"
                    @confirm="user.logout" @cancel="dialogPswd.show = true">
                    <template #reference>
                        <div class="userName" v-text="user.name.slice(-2)"></div>
                    </template>
                </el-popconfirm>
                <RouterLink v-else to="/">登录</RouterLink>
            </el-avatar>
            <!-- 搜索 -->
            <el-autocomplete v-model.trim="formSearch.value" :fetch-suggestions="query" :trigger-on-focus="false"
                @select="({ value }) => formSearch.value = value" @keyup.enter="storeOrders.search(formSearch)"
                placeholder="enter = 搜索 | 点击刷新 =>" clearable @clear="storeOrders.list">
                <template #prepend>客户</template>
                <template #append>
                    <el-button @click="storeOrders.search(formSearch)" v-loading="storeOrders.table.isLoading">
                        <el-icon color="#409eff">
                            <el-icon-refresh v-show="!formSearch.value" />
                            <el-icon-search v-show="formSearch.value" />
                        </el-icon>
                    </el-button>
                </template>
            </el-autocomplete>
        </div>
        <!-- 筛选时间 -->
        <div></div>
        <!-- 改密码 -->
        <el-dialog v-model="dialogPswd.show" :title="user.name" width="min(100dvw,420px)">
            <el-form label-position="top" :model="dialogPswd.form" :rules="rules">
                <el-form-item label="原密码" prop="old">
                    <el-input v-model.trim="dialogPswd.form.old" type="password" placeholder="当前密码" clearable
                        show-password minlength="8" maxlength="18" />
                </el-form-item>
                <el-form-item prop="new">
                    <template #label>新密码 <el-tag>@#$%^&*`~()-+=</el-tag></template>
                    <el-input v-model.trim="dialogPswd.form.new" type="password" placeholder="设置密码" clearable
                        show-password minlength="8" maxlength="18" :disabled="!dialogPswd.form.old" />
                </el-form-item>
                <el-form-item prop="password">
                    <template #label>
                        <el-text type="info" size="small">必含: 字母Aa-Zz、数字0-9, 可选: 特殊字符, 长度8~18</el-text>
                    </template>
                    <el-input v-model.trim="dialogPswd.form.password" type="password" placeholder="验证密码" clearable
                        show-password minlength="8" maxlength="18" :disabled="!dialogPswd.form.new" />
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="!(dialogPswd.form.old && dialogPswd.form.new && dialogPswd.form.password)"
                        type="danger" plain @click="user.forget(dialogPswd.form)">修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<style scoped>
div.header {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-avatar {
        color: #409eff;
        background-color: #ecf5ff;

        &:hover {
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
            all: inherit;
            border-bottom: 1px solid #409eff;
        }
    }

    .el-input {
        flex: 1;
    }
}
</style>