<script setup>
import { ref } from 'vue'
import { request } from '../../request/indexRequest';
const isShow = defineModel()
const tableUsers = ref([])
request.admin.list(1).then(res => {
    if (res.data.elMessage) { return }
    tableUsers.value = res.data.users.reverse()
})
</script>

<template>
    <el-dialog v-model="isShow" title="恢复用户" destroy-on-close>
        <el-table :data="tableUsers" table-layout="auto" height="100%">
            <el-table-column label="序" type="index"></el-table-column>
            <el-table-column label="名字" prop="name"></el-table-column>
            <el-table-column label="操作">
                <el-button type="success" plain size="small">恢复</el-button>
            </el-table-column>
            <el-table-column label="uid">
                <template #default="scope">
                    <el-tag v-text="scope.row.id" />
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<style scoped></style>