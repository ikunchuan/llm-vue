<template>
    <el-container>

        <el-main>
            <el-card class="card" shadow="hover">


                <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="communityType" label="社区类型" width="120" />
                    <el-table-column prop="communityName" label="社区名" width="120" />
                    <el-table-column prop="communityDescription" label="社区简介" width="200">
                        <template v-slot:default="{ row }">
                            <span class="ellipsis">{{ row.communityDescription }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" min-width="180">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.communityId)">
                                同意
                            </el-button>
                            <el-button link type="primary" size="small" @click="singleDelete(scope.row.communityId)">
                                拒绝
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>

                <br />

                <!-- 分页 -->
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[3, 5, 10, 20]" layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-card>
        </el-main>


    </el-container>
</template>

<script>
export default {
    data() {
        return {
            postData: [],
            dialogFormVisible: false,
            multipleSelection: [],
            tableData: [],
            pageInfo: {},
            pageSize: 5,
            pageNum: 1,
            form: {},
            formLabelWidth: "150px",
            title: "",
            btnName: "",
            selectedField: "",
        };
    },
    methods: {
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize);
        },
        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize);
        },
        getPageData(num, size, searchField, searchKeyword) {
            let communitySearch = {
                communityName: searchField === 'communityName' ? searchKeyword : '',
                userName: searchField === 'userName' ? searchKeyword : '',
                communityType: searchField === 'communityType' ? searchKeyword : ''
            };

            this.$http.post("/v1/communities/search?pageNum=" + num + "&pageSize=" + size, communitySearch)
                .then(response => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.list;
                })
                .catch(error => {
                    this.$message({
                        type: 'error',
                        message: '查询失败'
                    });
                });
        },



        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

    }
};
</script>

<style scoped>
.card {
    margin: 20px;
}

.header-actions {
    margin-bottom: 15px;
}

.ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.dialog-footer {
    text-align: right;
}

.el-header {
    font-size: 20px;
    padding: 15px 0;
}
</style>