<script setup>
import { useStorePaper } from '../../../stores/useStorePaper.js';
const storePaper = useStorePaper(), { dialog } = storePaper
</script>

<template>
    <el-dialog v-model="dialog.show" destroy-on-close @close="dialog.paper = ''" width="min(726px,90%)">
        <template #header>
            <el-button type="primary" text @click="storePaper.add">添加</el-button>纸张
        </template>
        <el-form-item>
            <el-input v-model.trim="storePaper.dialog.paper" type="textarea" resize="none"
                :autosize="{ minRows: 3, minRows: 8 }" placeholder="添加多个用空格分隔" />
        </el-form-item>
    </el-dialog>
</template>

<style scoped></style>