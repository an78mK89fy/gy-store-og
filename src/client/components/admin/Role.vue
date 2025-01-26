<script setup>

</script>

<template>
    <el-table table-layout="auto">
        <el-table-column label="序" type="index"></el-table-column>
        <el-table-column label="角色"></el-table-column>
        <el-table-column>
            <template #header>
                <el-button type="primary" plain size="small">创建</el-button>
            </template>
            <el-button>查看</el-button>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>