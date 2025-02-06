<script setup>
import Save from '../components/orders/Save.vue';
import Headers from '../components/orders/Headers.vue'
import Menu from '../components/orders/Menu.vue'
import Client from '../components/orders/menu/Client.vue';
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
                <el-table-column label="序" type="index" width="40px" />
                <el-table-column prop="gjpId">
                    <template #header>单据编号 <el-tag v-text="storeOrders.count" type="info" /></template>
                </el-table-column>
                <el-table-column width="68px">
                    <template #header><el-tag type="info">客户</el-tag></template>
                    <template #default="scope">
                        <el-tag tepe="warning" v-text="scope.row.client || '-'" type="warning" />
                    </template>
                </el-table-column>
                <el-table-column :filters="table.state.map(item => ({ text: item.value, value: item.value }))"
                    :filter-method="(value, row) => value === row.id_prop_state.value" width="83px">
                    <template #header><el-tag type="info">状态</el-tag></template>
                    <template #default="scope"><el-tag v-text="scope.row.id_prop_state.value" /></template>
                </el-table-column>
                <el-table-column label="操作" v-if="!isState.mobile">
                    <template #default="scope">
                        <!-- <el-button type="warning" plain @click="delOrders(scope.row)">修改</el-button> -->
                        <el-button type="danger" plain :disabled="!isState.login"
                            @click="storeOrders.delete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="详" type="expand" fixed="right" width="40px">
                    <template #default="scope">
                        <el-space direction="vertical" alignment="normal">
                            <el-space>
                                <el-space v-if="(isState.mobile || isState.dev) && isState.login">
                                    <el-button type="info" @click="storeOrders.state($event, scope.row)">已阅</el-button>
                                    <el-button type="primary"
                                        @click="storeOrders.state($event, scope.row)">开切</el-button>
                                    <el-button type="success"
                                        @click="storeOrders.state($event, scope.row)">切完</el-button>
                                    <el-button type="warning"
                                        @click="storeOrders.state($event, scope.row)">撤销</el-button>
                                </el-space>
                                <el-space wrap size="small">
                                    <el-tooltip content="创建时间">
                                        <el-tag v-text="toLocaleTime(scope.row.timeCreate)" />
                                    </el-tooltip>
                                    <el-tooltip content="最后修改" v-if="scope.row.timeLast">
                                        <el-tag v-text="toLocaleTime(scope.row.timeLast)" type="warning" />
                                    </el-tooltip>
                                </el-space>
                            </el-space>
                            <div v-if="scope.row.note">
                                <el-tag type="danger" style="display: inline-flex;">留言</el-tag>&nbsp;<span
                                    v-text="scope.row.note"></span>
                            </div>
                            <img class="cut" :src="origin + '/upload/' + scope.row.id" :alt="scope.row.id">
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

        img.cut {
            width: 100%;
        }
    }

    .el-aside {
        height: calc(100dvh - 16px);
        display: flex;
        flex-direction: column;
    }
}
</style>