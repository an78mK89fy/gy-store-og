<script setup>

</script>

<template>
    <div class="header">
        <el-avatar>
            <el-image v-if="false"></el-image>
            <RouterLink v-else to="/">登录</RouterLink>
        </el-avatar>
        <el-input placeholder="单据编号 enter搜索" clearable>
            <template #append><el-button>点击搜索</el-button></template>
        </el-input>
    </div>
</template>

<style scoped>
div.header {
    display: flex;
    align-items: center;
}

a {
    white-space: nowrap
}
</style>