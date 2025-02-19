<script setup>
import Save from '../components/orders/Save.vue';
import Headers from '../components/orders/Headers.vue'
import Menu from '../components/orders/Menu.vue'
import Client from '../components/orders/menu/Client.vue';
import State from '../components/orders/State.vue'
import EditLine from '../components/orders/EditLine.vue';
import { useStoreOrders } from '../stores/useStoreOrders.js';
import { isState } from '../utils/isState.js';
import { toLocaleTime } from '../utils/toLocalTime.js';

const origin = location.origin
const storeOrders = useStoreOrders(), { table } = storeOrders
storeOrders.list()
</script>

<template>
    <el-container>
        <div class="main">
            <Headers v-if="isState.mobile" />
            <el-table :data="table.rows" row-key="id" :expand-row-keys="table.rows.map(row => row.id)"
                table-layout="auto" height="100%">
                <el-table-column label="序" type="index" />
                <el-table-column>
                    <template #header><el-tag type="info">客户</el-tag></template>
                    <template #default="scope">
                        <el-tag tepe="warning" v-text="scope.row.client" type="warning" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #header><el-tag type="info">创建时间</el-tag></template>
                    <template #default="scope"><el-tag v-text="toLocaleTime(scope.row.timeCreate)" /></template>
                </el-table-column>
                <el-table-column :filters="table.state.map(item => ({ text: item.value, value: item.value }))"
                    :filter-method="(value, row) => value === row.id_prop_state.value">
                    <template #header><el-tag type="info">状态</el-tag></template>
                    <template #default="scope"><el-tag v-text="scope.row.id_prop_state.value" /></template>
                </el-table-column>
                <el-table-column label="操作" v-if="!isState.mobile">
                    <template #default="scope">
                        <el-space>
                            <el-button type="warning" plain :disabled="!isState.login"
                                @click="storeOrders.edit(scope)">修改</el-button>
                            <el-button type="danger" plain round :disabled="!isState.login" size="small"
                                @click="storeOrders.delete(scope.row)">删除</el-button>
                        </el-space>
                    </template>
                </el-table-column>
                <el-table-column label="详" type="expand" fixed="right">
                    <template #header><el-tag v-text="storeOrders.count" type="info" /></template>
                    <template #default="scope">
                        <el-space direction="vertical" alignment="normal">
                            <el-space>
                                <State :scope="scope"></State>
                                <el-button type="warning" plain @click="storeOrders.showEditLine(scope.row)"
                                    v-if="scope.row.editLine.length">
                                    切纸单修改记录<br v-if="isState.mobile">{{
                                        toLocaleTime(scope.row.editLine[0]?.timeLint) }}
                                </el-button>
                            </el-space>
                            <div v-if="scope.row.note">
                                <el-tag type="danger" style="display: inline-flex;">留言</el-tag>&nbsp;<span
                                    v-text="scope.row.note"></span>
                            </div>
                            <el-image class=" cut" :src="origin + '/upload/' + scope.row.img" :alt="scope.row.img"/>
                        </el-space>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-aside width="380px" v-if="!isState.mobile">
            <Headers v-if="!isState.mobile" style="margin-bottom: 8px;" />
            <el-scrollbar>
                <Save v-if="isState.login" />
                <Menu></Menu>
            </el-scrollbar>
        </el-aside>
        <Client></Client>
        <EditLine></EditLine>
    </el-container>
</template>

<style scoped>
.el-container {
    gap: 8px;

    div.main {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: calc(100dvh - 16px);
    }

    .el-aside {
        height: calc(100dvh - 16px);
        display: flex;
        flex-direction: column;
    }
}
</style>