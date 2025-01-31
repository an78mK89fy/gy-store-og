<script setup>
import { ref } from 'vue'
import { request } from '../../request/request.js';
import { regEx } from '../../../utils/regEx.js';
import { toLocaleTime } from '../../utils/toLocalTime.js';
const isShow = defineModel()
const props = defineProps(['fn'])
const tableUsers = ref([])
function listReback() {
    request.admin.list(1).then(res => {
        if (res.data.elMessage) { return }
        tableUsers.value = res.data.users.reverse()
    })
}
function rebackUser(row) {
    ElMessageBox.prompt(row.id, row.name, {
        inputPlaceholder: '11位手机号',
        confirmButtonText: '恢复',
        inputPattern: regEx.phone,
        inputErrorMessage: '11位手机号'
    }).then(({ value: phone }) => {
        request.admin.reback({ id: row.id, phone }).then(res => {
            props.fn.alertPassword(res.data)
            listReback()
            props.fn.listTableUser()
        })
    })
}

</script>

<template>
    <el-dialog v-model="isShow" title="恢复用户" destroy-on-close @open="listReback">
        <el-table :data="tableUsers" table-layout="auto" height="100%">
            <el-table-column label="序" type="index"></el-table-column>
            <el-table-column label="名字" prop="name"></el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="success" plain size="small" @click="rebackUser(scope.row)">恢复</el-button>
                </template>
            </el-table-column>
            <el-table-column label="uid">
                <template #default="scope">
                    <el-tag v-text="scope.row.id" />
                </template>
            </el-table-column>
            <el-table-column label="删除时间">
                <template #default="scope">
                    <el-tag type="danger" v-text="toLocaleTime(+scope.row.phone)" />
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<style scoped></style>