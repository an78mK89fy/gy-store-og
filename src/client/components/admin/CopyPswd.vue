<script setup>
import { useStoreAdmin } from '../../stores/useStoreAdmin';
const { dialogPswd } = useStoreAdmin()
let clickTimer
function copyPassword(e) {
    clearTimeout(clickTimer)
    clickTimer = setTimeout(() => {
        const text = e.type === 'dblclick'
            ? dialogPswd.data.lightPswd
            : `员工：${dialogPswd.data.user.name}\n`
            + `账户：${dialogPswd.data.user.phone}\n`
            + `临时密码：${dialogPswd.data.lightPswd}\n`
            + '*请登陆后点击头像修改密码！'
        navigator.clipboard.writeText(text).then(() => ElMessage({ message: '复制成功', type: 'success' }))
    }, 300)
}
</script>

<template>
    <el-dialog v-model="dialogPswd.show" :title="dialogPswd.data.user?.name" @close="dialogPswd.data = {}"
        destroy-on-close width="min(100%,300px)">
        <el-form-item label="明文密码">
            <el-input :modelValue="dialogPswd.data.lightPswd" type="password" show-password>
                <template #append>
                    <el-button @click="copyPassword" @dblclick="copyPassword">复制</el-button>
                </template>
            </el-input>
        </el-form-item>
    </el-dialog>
</template>

<style scoped></style>