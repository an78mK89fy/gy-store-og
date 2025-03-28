<script setup>
import Save from '../components/orders/Save.vue';
import Headers from '../components/orders/Headers.vue'
// import Menu from '../components/orders/Menu.vue'
import State from '../components/orders/State.vue'
import { useStoreOrders } from '../stores/useStoreOrders.js';
import { isState } from '../utils/isState.js';
// import { toLocaleTime } from '../utils/toLocalTime.js';
const storeOrders = useStoreOrders(), { table, getType } = storeOrders
storeOrders.list(0)
</script>

<template>
    <el-container>
        <div class="main">
            <Headers v-if="isState.mobile" />
            <el-table ref="elOrdersRef" :data="table.rows" row-key="id" table-layout="auto" height="100%"
                :expand-row-keys="table.rows.map(row => { if (row.id_prop_state.value !== '完成') { return row.id } })">
                <el-table-column label="序" type="index" />
                <el-table-column label="客户" prop="client" />
                <el-table-column :filters="table.state.map(item => ({ text: item.value, value: item.value }))"
                    :filter-method="(value, row) => value === row.id_prop_state.value">
                    <template #header><el-tag type="info">状态</el-tag></template>
                    <template #default="scope">
                        <el-tag v-text="scope.row.id_prop_state.value" :type="getType(scope.row.id_prop_state.value)" />
                    </template>
                </el-table-column>
                <!-- <el-table-column label="创建时间" align="center">
                    <template #default="scope">
                        <el-tag class="t" type="info" v-text="toLocaleTime(scope.row.timeCreate)" />
                    </template>
                </el-table-column> -->
                <el-table-column label="自提" align="center" v-if="!isState.mobile">
                    <template #default="scope"><el-text v-text="scope.row.self ? '是' : '否'" /></template>
                </el-table-column>
                <!-- <el-table-column label="操作" align="center" v-if="!isState.mobile">
                    <template #default="scope">
                        <el-space>
                            <el-button type="warning" plain :disabled="!isState.login"
                                @click="storeOrders.edit(scope)">修改</el-button>
                            <el-button type="danger" plain round :disabled="!isState.login" size="small"
                                @click="storeOrders.delete(scope)">删除</el-button>
                        </el-space>
                    </template>
                </el-table-column> -->
                <el-table-column type="expand">
                    <template #header>
                        <el-tooltip content="待办">
                            <el-tag v-text="storeOrders.count" :type="storeOrders.count ? 'success' : 'info'" />
                        </el-tooltip>
                    </template>
                    <template #default="scope">
                        <State :scope="scope"></State>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-aside width="380px" v-if="!isState.mobile">
            <Headers v-if="!isState.mobile" style="margin-bottom: 8px;" />
            <el-scrollbar>
                <Save v-if="isState.login" />
                <!-- <Menu></Menu> -->
            </el-scrollbar>
        </el-aside>
    </el-container>
</template>

<style scoped>
.el-container {
    gap: 8px;

    div.main {
        display: flex;
        flex-direction: column;
        width: min(500px, 100%);
        height: calc(100dvh - 16px);

        .el-tag.t {
            font-family: Arial;
        }
    }

    .el-aside {
        height: calc(100dvh - 16px);
        display: flex;
        flex-direction: column;
    }
}
</style>