<template>
    <el-card style="max-width: 100%">
        <template #header>

            <div class="card-header">

                <div class="query">
                    <el-input v-model="queryStr" placeholder="Please input" /> &nbsp; &nbsp;
                    <el-button class="button" type="primary" round @click="queryInfo">查询</el-button>
                </div>

                <div>
                    <el-button class="button" type="success" round @click="openAddDialog">添加</el-button>
                    <el-button class="button" type="warning" round @click="multiDelete">多选删除</el-button>
                </div>


            </div>

        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />

            <el-table-column prop="categoryId" label="社区类别" width="120" />
            <el-table-column prop="communityName" label="社区名" width="120" />
            <el-table-column prop="communityDescription" label="社区描述" width="120" />
            <el-table-column prop="createdBy" label="创建者" width="120" />

            <el-table-column fixed="right" label="操作" min-width="160">

                <template #default="scope">
                    <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.communityId)">
                        详情
                    </el-button>
                    <el-button link type="primary" size="small" @click="singleDelete(scope.row.communityId)">
                        删除
                    </el-button>
                    <el-button link type="primary" size="small" @click="openUpdateDialog(scope.row)">
                        编辑
                    </el-button>
                    <el-button link type="primary" size="small" @click="openUserDialog(scope.row.communityId)">
                        所有用户
                    </el-button>
                </template>

            </el-table-column>
        </el-table>

        <br />

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[2, 3, 4, 5]"
            :background="true" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    </el-card>

    <!-- 对话框:添加,修改功能 -->
    <el-dialog v-model="dialogFormVisible" :title="title" width="800">

        <el-form :rules="myrules" ref="" frmRef :model="form">
            <el-row :gutter="20">
                <el-col :span="16">

                    <el-form-item label="社区类别" :label-width="formLabelWidth">
                        <el-input v-model="form.categoryId" autocomplete="off" />
                    </el-form-item>

                    <el-form-item label="社区名" :label-width="formLabelWidth">
                        <el-input v-model="form.communityName" autocomplete="off" />
                    </el-form-item>

                    <el-form-item label="社区描述" :label-width="formLabelWidth">
                        <el-input v-model="form.communityDescription" autocomplete="off" />
                    </el-form-item>

                    <el-form-item label="创建者" :label-width="formLabelWidth">
                        <el-input v-model="form.createdBy" autocomplete="off" />
                    </el-form-item>

                </el-col>
            </el-row>
        </el-form>


        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="btnAddUpdate">
                    {{ btnName }}
                </el-button>
            </div>
        </template>
    </el-dialog>


    <!-- 详情对话框 -->
    <el-dialog v-model="dialogDetailVisible" title="社区详细信息显示" width="500">
        <el-form :model="form">
            <el-form-item label="社区类别" :label-width="formLabelWidth">
                <el-form-item :label="form.categoryId"></el-form-item>
            </el-form-item>

            <el-form-item label="社区名" :label-width="formLabelWidth">
                <el-form-item :label="form.communityName"></el-form-item>
            </el-form-item>

            <el-form-item label="社区描述" :label-width="formLabelWidth">
                <el-form-item :label="form.communityDescription"></el-form-item>
            </el-form-item>

            <el-form-item label="创建人" :label-width="formLabelWidth">
                <el-form-item :label="form.createdBy"></el-form-item>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogDetailVisible = false">取消</el-button>

            </div>
        </template>
    </el-dialog>


    <!-- 用户详细表 -->

        <el-dialog v-model="dialogUserInfoVisible" title="用户详细信息显示" width="600px">
            
            <el-table :data="users" style="width: 100%">
                <el-table-column prop="createTime" label="Date" width="180" />
                <el-table-column prop="createBy" label="Name" width="180" />
            </el-table>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogUserInfoVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>




</template>


<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { handleCurrentChange } from 'element-plus/es/components/tree/src/model/util.mjs';
import { Plus } from '@element-plus/icons-vue';
export default {
    data() {
        return {
            // cmnsInfoData:[],
            dialogUserInfoVisible: false,
            dialogDetailVisible: false,   //详细对话框
            dialogFormVisible: false,  //对话框是否展示,默认为不展示

            queryStr: "",                   //查询条件
            multipleSelection: [],       //多选删除
            tableData: [],    //社区信息数据
            userData: [],        //用户信息数据
            queryData: [],
            pageInfo: {},       //分页信息对象
            pageSize: 3,        //当前页条数
            pageNum: 1,     //当前页号
            users: {},
            form: {},                       //对话框表单数据
            formLabelWidth: "140px",    //对话框label宽度
            title: "",                           //对话框标题
            btnName: "",                     //对话框按钮文字
            // claInfoData: [],                  //加载到下拉框的班级信息
            imageUrl: ""                     //图片URL
        };
    },


    methods: {
        // handleSuccess(response) {            //图片上传成功后的回调函数
        //     console.log(response);
        //     // this.imageUrl = response
        //     this.form.stu_image_url = response
        // },

        handleSizeChange(pageSize) {            //选择每一页显示的记录数
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize)
            console.log("size:", pageSize);
        },
        handleCurrentChange(pageNum) {      //切换页号时得到当时页号
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize)
            console.log("num:", pageNum);
        },

        getPageData(num, size) {
            this.$http.get("cmns/v1/cmn", { params: { pageNum: num, pageSize: size } })
                .then(response => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.records;

                    // 初始化或保护原始数据缓存
                    if (!this.queryData || this.queryData.length === 0) {
                        this.queryData = [...this.tableData];
                    }

                    console.log(this.tableData);
                });
        },

        openUserDialog(cmnid) {
            var _this = this
            this.$http.get("/ucmns/v1/ucmn/user/" + cmnid).then(function (response) {
                console.log(response.data);
                _this.users = response.data
            })

            this.dialogUserInfoVisible = true;
            console.log("打开用户详细页面")
        },

        closeDialog() {
            this.form = []
            console.log("closeDialog.....")
        },

        openDetailDialog(cmnid) {
            var _this = this
            this.$http.get("/cmns/v1/cmn/" + cmnid).then(function (response) {
                console.log(response.data);
                _this.form = response.data
            })

            this.dialogDetailVisible = true;
        },

        openAddDialog() {
            this.btnName = "添加";
            this.title = "添加社区信息";
            this.dialogFormVisible = true;
            console.log("openAddDialog....");
        },

        openUpdateDialog(row) {                 //打开修改对话框,修改数据回显
            this.btnName = "修改"
            this.title = "修改社区信息"
            this.dialogFormVisible = true
            //console.log(row)
            this.form = row         //得到要修改的数据,并回显到对话框的表单上
            // this.form.stu_interest = this.form.stu_interest.split(',')
            // this.form.stu_sex = this.form.stu_sex.toString()
            console.log("openUpdateDialog....");
        },

        updateCmn() {        //修改功能
            console.log(this.form);
            var _this = this;
            // this.form.stu_interest = this.form.stu_interest.join(',')              //将数据转为字符串
            this.$http.put("/cmns/v1/cmn", this.form).then(function (response) {
                console.log(response.data);

                if (response.data == 1) {
                    ElMessage({
                        message: '学生信息修改成功',
                        type: 'success',
                    })
                } else {
                    ElMessage({
                        message: '学生信息修改失败',
                        type: 'warning',
                    })
                }

            })
            this.form = []
        },

        addCmn() {           //添加功能
            var _this = this;
            // this.form.stu_interest = this.form.stu_interest.join(',');
            this.$http.post("/cmns/v1/cmn", this.form).then(function (response) {
                console.log(response.data);

                if (response.data == 1) {
                    ElMessage({
                        message: '社区添加成功',
                        type: 'success',
                    })
                } else {
                    ElMessage({
                        message: '社区添加失败',
                        type: 'warning',
                    })
                }

            })
            this.form = []
        },


        //--------------------------------------------------------
        btnAddUpdate() {
            if (this.btnName == "添加") {
                this.addCmn()
                console.log("添加操作......")
                console.log(this.form)
            }
            if (this.btnName == "修改") {
                this.updateCmn()
                console.log(this.form)
                console.log("修改操作......")
            }
            this.dialogFormVisible = false
        },

        singleDelete(cmnid) {
            console.log("singleDelete().....")

            ElMessageBox.confirm(
                '您确定要删除本条数据吗?',
                'Warning',
                {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                }
            )
                .then(() => {
                    var _this = this;
                    this.$http.delete("cmns/v1/cmn/" + cmnid).then(function (response) {
                        console.log(response.data);
                    })
                    if (response.data == 1) {
                        ElMessage({
                            type: 'success',
                            message: '删除成功',
                        })
                    } else {
                        ElMessage({
                            type: 'warning',
                            message: '删除失败',
                        })
                    }


                })
                .catch(() => {

                })
        },

        multiDelete() {
            console.log("multiDelete()...")

            ElMessageBox.confirm(
                '您确定要删除当前选中的多条数据吗?',
                'Warning',
                {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                }
            )
                .then(() => {
                    var _this = this;
                    var num = 0;
                    this.multipleSelection.forEach(item => {
                        var _this = this;
                        var cmnid = item.communityId
                        this.$http.delete("/cmns/v1/cmn/" + cmnid).then(function (response) {
                            console.log(response.data);
                            if (response.data == 1) {
                                num = num + 1
                            }

                        })
                    })

                    ElMessage({
                        type: 'success',
                        message: '你成功删除' + num + '条记录',
                    })

                })
                .catch(() => {

                })

        },

        queryInfo() {

            if (this.queryStr.trim().length > 0) {
                this.tableData = this.queryData.filter(item =>
                    item.communityName.includes(this.queryStr.trim())
                );
            } else {
                this.tableData = [...this.queryData];
            }

            console.log(this.tableData);
        },

        handleSelectionChange(val) {            //多行选择
            this.multipleSelection = val;
            console.log(this.multipleSelection);

        }
    },
    components: {
        Plus
    },

    mounted() {
        this.getPageData(1, 3)

        // this.$http.get("/cmns/v1/cmn").then((response) => {
        //     this.cmnsInfoData = response.data
        //     console.log(this.cmnsInfoData)
        // })

        this.$http.get("/cmns/v1/cmn").then((response) => {
            this.cmnsInfoData = response.data;
            console.log('cmnsInfoData:', this.cmnsInfoData);
            console.log("huhuhu")
            // 确保这里的 tableData 被正确赋值
            // this.tableData = this.cmnsInfoData;
            // console.log('tableData:', this.tableData);
        });

    }

}
</script>



<style>
.card-header {
    display: flex;
    justify-content: space-between;
}

.query {
    display: flex;
    justify-content: space-between;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px 20px;
}

.el-table {
    margin-top: 20px;
}
</style>