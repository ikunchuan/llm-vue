<template>
    <div class="user-list">
        <el-card class="user-list-card">
            <div slot="header" class="card-header">
                <span>用户信息管理</span>
            </div>

            <!-- 用户列表 -->
            <el-table :data="users" style="width: 100%">
                <el-table-column prop="name" label="用户名" width="180"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
                <el-table-column prop="role" label="角色" width="100"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button @click="handleEdit(scope.row)" size="mini">编辑</el-button>
                        <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 模拟用户数据
            users: [
                { name: '张三', email: 'zhangsan@example.com', role: '管理员' },
                { name: '李四', email: 'lisi@example.com', role: '普通用户' },
                { name: '王五', email: 'wangwu@example.com', role: '审核员' },
            ],
        };
    },
    methods: {
        // 编辑用户信息
        handleEdit(user) {
            console.log('编辑用户:', user);
        },
        // 删除用户
        handleDelete(user) {
            this.$confirm('确定删除此用户?', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.users = this.users.filter(u => u !== user);
                this.$message.success('删除成功!');
            }).catch(() => {
                this.$message.info('取消删除');
            });
        }
    }
};
</script>

<style scoped>
.user-list-card {
    padding: 20px;
}

.card-header {
    font-size: 20px;
    font-weight: bold;
}

.el-table .cell {
    text-align: center;
}

.el-button {
    margin-right: 10px;
}
</style>
