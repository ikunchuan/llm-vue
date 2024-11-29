<template>
    <el-card class="card">
        <div slot="header" class="card-header">
            <span>类型1</span>
        </div>

        <p>类型1显示内容</p>


    </el-card>
</template>

<script>
export default {
    name: 'Category1'
};
</script>

<style scoped>
.card {
    padding: 20px;
}

.card-header {
    font-size: 20px;
    font-weight: bold;
}
</style>
