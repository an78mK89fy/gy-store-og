<script setup>
import CreateOrders from '../components/orders/CreateOrders.vue';
import Headers from '../components/orders/Headers.vue'
import { ref } from 'vue';
import { request } from '../request/indexRequest.js';
import { isMobile } from '../utils/isMobile.js';

const origin = location.origin

const rows = ref([])
const state = ref([])
request.orders.list().then(res => {
    if (res.data.elMessage) { return ElMessage(request.data.elMessage) }
    rows.value = res.data.rows.reverse()
    state.value = res.data.state
})
function delOrders(row) {
    ElMessageBox.confirm(
        row.gjpId, '确认删除吗', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error',
    }).then(() => request.orders.delete(row.id).then(res => {
        if (res.data.elMessage) { return ElMessage(res.data.elMessage) }
        const index = rows.value.findIndex(item => item.id === row.id)
        rows.value.splice(index, 1)
    }))
}
function sendState(e, row) {
    let stateValue
    switch (e.target.textContent) {
        case '开切': stateValue = '进行中'; break
        case '撤销': stateValue = '新'; break
        case '切完': stateValue = '完成'; break
        default: stateValue = e.target.textContent; break
    }
    const _state = state.value.find(item => item.value === stateValue)
    if (row.id_prop_state.id === _state.id) { return ElMessage({ message: `已经是"${stateValue}"状态`, type: 'warning' }) }
    request.orders.state({ idOrders: row.id, idState: _state.id }).then(res => {
        if (res.data.elMessage) { return ElMessage(res.data.elMessage) }
        const row = rows.value.find(item => item.id === row.id)
        row.id_prop_state.value = _state.value
        row.timeLast = Date.now()
    })
}
</script>

<template>
    <el-container>
        <div class="main">
            <Headers v-if="isMobile"></Headers>
            <el-table :data="rows" row-key="id" :expand-row-keys="rows.map(row => row.id)" table-layout="auto"
                height="100%">
                <el-table-column label="序" type="index" width="10" />
                <el-table-column label="单据编号">
                    <template #default="scope">
                        <span class="nowrap" v-text="scope.row.gjpId"></span>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #header>
                        <el-tag type="info">客户</el-tag>
                    </template>
                    <template #default="scope">
                        <el-tag v-if="scope.row.client" tepe="warning" v-text="scope.row.client"></el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column :filters="state.map(item => ({ text: item.value, value: item.value }))"
                    :filter-method="(value, row) => value === row.id_prop_state.value">
                    <template #header>
                        <el-tag type="info">状态</el-tag>
                    </template>
                    <template #default="scope">
                        <el-tag>
                            <span class="nowrap" v-text="scope.row.id_prop_state.value"></span>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if="!isMobile">
                    <template #default="scope">
                        <el-button type="danger" plain @click="delOrders(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="详" type="expand" fixed="right" width="10">
                    <template v-slot="scope">
                        <div class="btn" v-if="isMobile">
                            <el-button type="info" @click="sendState($event, scope.row)">已阅</el-button>
                            <el-button type="primary" @click="sendState($event, scope.row)">开切</el-button>
                            <el-button type="success" @click="sendState($event, scope.row)">切完</el-button>
                            <el-button type="warning" @click="sendState($event, scope.row)">撤销</el-button>
                        </div>
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
            <Headers v-if="!isMobile" style="margin-bottom: 8px;"></Headers>
            <CreateOrders v-model="rows"></CreateOrders>
        </el-aside>
    </el-container>
</template>

<style scoped>
.el-container {
    gap: 8px;
}

div.main {
    display: flex;
    flex-direction: column;
    width: min(100%, max(50%, 500px));
    height: calc(100dvh - 16px);
}

img.cut {
    width: 100%;
}

span.nowrap {
    white-space: nowrap
}
</style>