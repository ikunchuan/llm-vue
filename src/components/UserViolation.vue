<template>
    <el-card class="card">
        <div slot="header" class="card-header">
            <span>违规用户处理</span>
        </div>
        <!-- 这里可以放置违规用户处理的相关内容 -->
        <p>显示违规用户处理内容</p>
    </el-card>
</template>

<script>
export default {
    name: 'UserViolation'
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
