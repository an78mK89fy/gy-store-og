<script setup>
import { useStoreTodo } from '../../../stores/orders/useStoreTodo.js'
import { useStorePaper } from '../../../stores/useStorePaper.js';
const storeTodo = useStoreTodo(), { cut, progress } = storeTodo, { query, dialog } = useStorePaper()
</script>

<template>
    <el-drawer v-model="cut.show" title="切纸任务" direction="btt" size="75dvh" destroy-on-close
        @close="storeTodo.closeEdit">
        <template #header v-if="cut.id">
            切纸任务
            <el-input-tag v-model="progress.todo.concatPaper" :max="1" tag-type="warning" size="small"
                @remove-tag="storeTodo.closeEdit" />
        </template>
        <el-image :src="storeTodo.src" />
        <el-form :inline="true" label-position="top">
            <input type="hidden" name="id">
            <el-form-item label="纸张">
                <template #label>
                    <el-space>纸张<el-button :type="cut.id ? 'warning' : 'primary'" link
                            @click="dialog.show = true">添加</el-button></el-space>
                </template>
                <el-autocomplete v-model="cut.form.paper" :fetch-suggestions="query" :debounce="0"
                    :trigger-on-focus="false" clearable placeholder="拼音首字母 = 搜索" />
            </el-form-item>
            <el-form-item label="克重">
                <el-input v-model="cut.form.grammage" type="number" clearable placeholder="g" />
            </el-form-item>
            <el-form-item label="宽幅">
                <el-input v-model="cut.form.width" type="number" clearable placeholder="mm" />
            </el-form-item>
            <el-form-item label="长度">
                <el-input v-model="cut.form.length" type="number" clearable placeholder="mm" />
            </el-form-item>
            <el-form-item label="张数">
                <el-input v-model="cut.form.count" type="number" clearable placeholder="张" />
            </el-form-item>
            <el-form-item label="操作">
                <el-button :type="cut.id ? 'warning' : 'primary'" @click="storeTodo.save"
                    v-text="cut.id ? '修改' : '提交'" />
                <el-button type="danger" round text bg @click="storeTodo.clearCut">清空</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<style scoped>
.el-form .el-form-item {
    width: calc(50% - 32px);
}
</style>
<style>
.el-drawer__body {
    padding-top: 0;
}
</style>