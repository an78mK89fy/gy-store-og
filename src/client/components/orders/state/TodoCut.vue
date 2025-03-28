<script setup>
import { useStoreTodo } from '../../../stores/orders/useStoreTodo.js'
const storeTodo = useStoreTodo(), { cut, progress } = storeTodo
</script>

<template>
    <el-dialog v-model="cut.show" :title="cut.orders.client" destroy-on-close @close="storeTodo.closeEdit" width="100%"
        top="10dvh">
        <el-image :src="storeTodo.src" />
        <el-form :inline="true" label-position="top">
            <input type="hidden" name="id">
            <el-form-item label="序号">
                <el-input-number v-model="cut.form.index" controls-position="right" :min="1" :max="cut.orders.count"
                    size="large" />
            </el-form-item>
            <el-form-item label="张数">
                <el-input v-model="cut.form.count" type="number" clearable placeholder="张" size="large" />
            </el-form-item>
        </el-form>
        <template #footer="">
            <el-button :type="cut.id ? 'warning' : 'primary'" @click="storeTodo.save" v-text="cut.id ? '修改' : '提交'"
                :disabled="!cut.form.count" />
        </template>
    </el-dialog>
</template>

<style scoped>
.el-form .el-form-item {
    width: calc(50% - 32px);
}
</style>