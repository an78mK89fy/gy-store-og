<script setup>
import { useStoreOrders } from '../../stores/useStoreOrders.js';
import { reactive } from 'vue';
import { request } from '../../request/request.js'

const storeOrders = useStoreOrders()
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
const formSearch = reactive({ key: '0', value: '' })
function search(form) {
    if (!form.value) { return storeOrders.list(true) }
    request.orders.search(form).then(res => {

    })
}
// 改密码
const dialogPswd = reactive({ show: false, form: { old: '', new: '', password: '' } })
user.forget = form => {
    if (form.new !== form.password) { return ElMessage({ message: '新密码两次不一致', type: 'warning' }) }
    if (form.old === form.new) { return ElMessage({ message: '新密码与原密码相同', type: 'warning' }) }
    request.user.password({ ...form, new: undefined })
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
            <el-input v-model.trim="formSearch.value" placeholder="enter = 搜索 | 点击刷新 =>" clearable>
                <template #prepend>
                    <el-select v-model="formSearch.key" style="width: 100px">
                        <el-option label="客户名称" value="0" />
                        <el-option label="单据编号" value="1" />
                    </el-select>
                </template>
                <template #append>
                    <el-button @click="search(formSearch)">
                        <el-icon color="#409eff">
                            <el-icon-refresh v-show="!formSearch.value" />
                            <el-icon-search v-show="formSearch.value" />
                        </el-icon>
                    </el-button>
                </template>
            </el-input>
        </div>
        <!-- 改密码 -->
        <el-dialog v-model="dialogPswd.show" :title="user.name" style="width: min(100dvw,420px);">
            <el-form label-position="top">
                <el-form-item label="原密码" required>
                    <el-input v-model.trim="dialogPswd.form.old" type="password" placeholder="当前密码" clearable
                        show-password />
                </el-form-item>
                <el-form-item required>
                    <template #label>新密码 <el-tag>@#$%^&*`~()-+=</el-tag></template>
                    <el-input v-model.trim="dialogPswd.form.new" type="password" placeholder="设置密码" clearable
                        show-password />
                    <el-text type="info" size="small">必含: 字母Aa-Zz、数字0-9, 可选: 特殊字符, 长度8~18</el-text>
                    <el-input v-model.trim="dialogPswd.form.password" type="password" placeholder="验证密码" clearable
                        show-password />
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" plain @click="user.forget(dialogPswd.form)">修改</el-button>
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