<template>
    <el-card style="max-width: auto">
        <template #header>
            <h2>competitioninfo</h2>
            <div class="card-header">
                <div class="query">
                    <el-input v-model="competitionId" style="width: 220px" placeholder="请输入竞赛ID" />&nbsp;
                    <el-button class="button" type="primary" round @click="fetchData">查询</el-button>
                </div>
                <div>
                    <el-button class="button" type="success" round >添加</el-button>
                    <el-button class="button" type="warning" round >删除</el-button>
                </div>
            </div>
        </template>
        <el-table :data="competitions" style="width: 100%" >
            <el-table-column type="selection" width="55" />
            <el-table-column fixed prop="competitionId" label="竞赛ID" width="70" />
            <el-table-column prop="competitionName" label="竞赛名称" width="120" />
            <el-table-column prop="categoryId" label="竞赛类别ID" width="120" />
            <el-table-column prop="levelId" label="竞赛等级ID" width="120" />
            <el-table-column prop="competitionImgUrl" label="竞赛图片链接" width="120" />
            <el-table-column prop="competitionStatus" label="竞赛状态" width="120" />
            <el-table-column prop="status" label="是否激活" width="100">
                <template #default="scope">
                    {{ scope.row.status == 0 ? '激活' : '停用' }}
                </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="创建时间" width="300" />
            <el-table-column prop="updatedTime" label="最后更新时间" width="300" />
            <el-table-column  fixed="right" label="操作" width="240">
                <template #default="scope">
                    <el-button size="mini" type="primary" @click="editCompetition(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteCompetition(scope.row)">删除</el-button>
                    <el-button size="mini" type="info" @click="viewCompetition(scope.row)">详情</el-button>
                </template>
            </el-table-column>
            <br/>
        </el-table>
        <!--分页功能-->
        <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[10, 20, 50, 100]" 
        :size="size"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />

    </el-card>




</template>

<script>
import axios from 'axios';

export default {
    name: 'competitionInfo',
    data() {
        return {
            competitions: [],
            competitionId: '',
            pageInfo:{},
        };
    },
    methods: {
        handleSizeChange(pageSize){            //选择每一页显示的记录数
            this.pageSize = pageSize
            this.getPageData(this.currentPage,this.pageSize)
            console.log("size",pageSize);

            },
        handleCurrentChange(pageNum){          //切换当前页号
            this.currentPage = pageNum
            this.getPageData(this.currentPage,this.pageSize)
            console.log("num",pageNum);

            },
            getPageData(num,size){     //得到分页数据

            this.$http.get("http://localhost:10086/comp/v1/v1",{params:{pageNum:num,pageSize:size}}).then((response)=>{
            this.pageInfo  = response.data
            this.competitions =  this.pageInfo.list
            console.log(this.tableData);
            })
            },

        fetchData() {
            axios.get(`http://localhost:10086/comp/v1/compe`)
                .then(response => {
                    this.competitions = response.data;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        editCompetition(row) {
            console.log('Edit competition:', row);
            // 在这里添加编辑逻辑
        },
        deleteCompetition(row) {
            console.log('Delete competition:', row);
            // 在这里添加删除逻辑
        },
        viewCompetition(row) {
            console.log('View competition details:', row);
            // 在这里添加查看详情的逻辑
        }
    },
    mounted() {
       // this.getPageData(1,3)
        this.fetchData();
    }
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

.card-header h2 {
    margin: 0;
}
</style>