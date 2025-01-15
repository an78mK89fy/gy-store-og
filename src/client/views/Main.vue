<script setup>
import CreateOrders from '../components/CreateOrders.vue';
import Headers from '../components/Headers.vue'
import { ref } from 'vue';
import { request } from '../request/indexRequest.js';
import { isMobile } from '../utils/isMobile.js';
import { ElMessage } from 'element-plus';

const isServer = location.hostname === 'localhost'
const origin = location.origin

const rows = ref([])
const state = ref([])
request.orders.list().then(res => {
    if (res.data.elMessage) { return ElMessage(request.data.elMessage) }
    rows.value = res.data.rows.reverse()
    state.value = res.data.state
}).catch(err => ElMessage({ message: err, type: 'error' }))
function delOrders(id) {
    request.orders.delete(id).then(res => {
        if (res.data.elMessage) { return ElMessage(res.data.elMessage) }
        const index = rows.value.findIndex(item => item.id === id)
        rows.value.splice(index, 1)
    }).catch(err => ElMessage({ message: err, type: 'error' }))
}
function sendState(e, idOrders) {
    let stateValue
    switch (e.target.textContent) {
        case '开切':
            stateValue = '进行中'
            break;
        case '撤销':
            stateValue = '新'
            break
        case '切完':
            stateValue = '完成'
            break
        default:
            stateValue = e.target.textContent
            break;
    }
    const _state = state.value.find(item => item.value === stateValue)
    request.orders.state({ idOrders, idState: _state.id }).then(res => {
        if (res.data.elMessage) { return ElMessage(res.data.elMessage) }
        const row = rows.value.find(item => item.id === idOrders)
        row.id_prop_state.value = _state.value
        row.timeLast = Date.now()

    }).catch(err => { ElMessage({ message: err, type: 'error' }) })
}
</script>

<template>
    <el-container>
        <div class="main">
            <Headers></Headers>
            <el-table :data="rows" row-key="id" :expand-row-keys="rows.map(row => row.id)" stripe table-layout="auto">
                <el-table-column label="序" type="index" width="10" />
                <el-table-column label="单据编号">
                    <template #default="scope">
                        <span class="nowrap" v-text="scope.row.gjpId"></span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template #default="scope">
                        <span class="nowrap" v-text="scope.row.id_prop_state.value"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if="isServer">
                    <template #default="scope">
                        <el-button type="danger" plain @click="delOrders(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="详" type="expand" fixed="right" width="10">
                    <template v-slot="scope">
                        <el-button type="info" @click="sendState($event, scope.row.id)">已阅</el-button>
                        <el-button type="primary" @click="sendState($event, scope.row.id)">开切</el-button>
                        <el-button type="success" @click="sendState($event, scope.row.id)">切完</el-button>
                        <el-button type="warning" @click="sendState($event, scope.row.id)">撤销</el-button>
                        <div v-text="'创建时间:' + new Date(scope.row.timeCreate).toLocaleString()"></div>
                        <div v-text="'最后修改:' + new Date(scope.row.timeLast).toLocaleString()" v-if="scope.row.timeLast">
                        </div>
                        <div v-text="'留言:' + scope.row.note" v-if="scope.row.note"></div>
                        <img class="cut" :src="origin + '/upload/' + scope.row.id" :alt="scope.row.id">
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-aside width="380px" v-if="!isMobile">
            <CreateOrders v-model="rows"></CreateOrders>
        </el-aside>
    </el-container>
</template>

<style scoped>
.el-container {
    height: 100%;
}

div.main {
    display: flex;
    flex-direction: column;
    width: 100%;
}

img.cut {
    width: 100%;
}

span.nowrap {
    white-space: nowrap
}
</style>