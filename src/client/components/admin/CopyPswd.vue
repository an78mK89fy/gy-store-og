<script setup>
const dialogPswd = defineModel()
function copyPassword() {
    const text = `员工：${dialogPswd.value.data.user.name}\n`
        + `账户：${dialogPswd.value.data.user.phone}\n`
        + `临时密码：${dialogPswd.value.data.lightPswd}\n`
        + '*请登陆后点击头像修改密码！'
    navigator.clipboard.writeText(text).then(() => ElMessage({ message: '复制成功', type: 'success' }))
}
</script>

<template>
    <el-dialog v-model="dialogPswd.show" :title="dialogPswd.data.user?.name" @close="dialogPswd.data = {}"
        destroy-on-close>
        <el-form-item label="明文密码">
            <el-input :modelValue="dialogPswd.data.lightPswd" type="password" show-password>
                <template #append>
                    <el-button @click="copyPassword">复制</el-button>
                </template>
            </el-input>
        </el-form-item>
    </el-dialog>
</template>

<style scoped></style>