<script setup>
import { isState } from '../../utils/isState.js';
</script>

<template>
    <el-card v-if="!isState.mobile">
        <template #header>
            <el-icon><el-icon-guide /></el-icon>功能
        </template>
        <div class="box" v-if="isState.login">
            <div class="app">
                <el-avatar size="large">
                    <el-icon size="32px"><el-icon-notebook /></el-icon>
                </el-avatar>
                <el-tag>排车计划</el-tag>
            </div>
            <div class="app">
                <el-avatar size="large">
                    <el-icon size="32px"><el-icon-money /></el-icon>
                </el-avatar>
                <el-tag>切纸统计</el-tag>
            </div>
        </div>
        <b v-else>仅浏览模式</b>
    </el-card>
</template>

<style scoped>
div.box {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    border: 1px;

    div.app {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        padding: 8px;
        transition: all 300ms;

        &:hover {
            cursor: pointer;
            border-radius: 8px;
            box-shadow: #d6d7d8 0 0 3px;
        }

        .el-avatar {
            color: #409eff;
            background-color: #ecf5ff;
            box-shadow: #d6d7d8 0 0 3px;
        }
    }
}
</style>