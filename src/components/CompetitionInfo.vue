<template>
    <el-card style="max-width: auto">
        <template #header>
            <div class="card-header">
                <div class="query">
                    <el-input style="width: 220px" placeholder="请输入竞赛ID" />&nbsp;
                    <el-button class="button" type="primary" round>查询</el-button>
                </div>
                <div>
                    <el-button class="button" type="success" round >添加</el-button>
                    <el-button class="button" type="warning" round >删除</el-button>
                </div>
            </div>
        </template>
        <el-table style="width: 100%" >
            <el-table-column type="selection" width="55" />
            <el-table-column fixed prop="stuid" label="竞赛ID" width="70" />
            <el-table-column prop="stu_no" label="竞赛名称" width="120" />
            <el-table-column prop="stu_name" label="竞赛类别ID" width="200" />
            <el-table-column prop="stu_name" label="竞赛等级ID" width="200" />
            <el-table-column prop="stu_name" label="竞赛图片链接" width="200" />
            <el-table-column prop="stu_sex" label="竞赛状态" width="160">
                <template #default="scope">
                    {{ scope.row.stu_sex == 0 ? '激活' : '停用' }}
                </template>
            </el-table-column>
            <el-table-column prop="stu_sex" label="是否激活" width="160">
                <template #default="scope">
                    {{ scope.row.stu_sex == 0 ? '激活' : '停用' }}
                </template>
            </el-table-column>
        
        </el-table>
    </el-card>
</template>



<script>
export default {
    name: 'competitionInfo'
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
