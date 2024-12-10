<template>
            <el-card class="card">
                <el-tabs title="社区模块管理" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="帖子" name="first">

                    <div class="header-actions">
                        <!-- 查询字段选择：让用户选择查询的字段 -->
                        <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;">
                            <el-option label="社区名" value="communityName"></el-option>
                            <el-option label="用户名" value="userName"></el-option>
                            <el-option label="帖子标题" value="postTitle"></el-option>
                            <el-option label="帖子内容" value="postContent"></el-option>
                        </el-select>&nbsp;

                        <!-- 输入框：输入查询内容 -->
                        <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" />&nbsp;

                        <!-- <el-input v-model="queryStr" style="width: 220px" placeholder="请输入课程名称" />&nbsp; -->
                        <el-button type="primary" @click="queryInfo">查询</el-button>
                        <el-button class="button" type="warning" @click="multipleDelete">多选删除</el-button>
                    </div>

                <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="communityName" label="社区名" width="160" />
                    <el-table-column prop="userName" label="发帖用户" width="120" />
                    <el-table-column prop="postTitle" label="帖子标题" width="200" />
                    <el-table-column prop="postContent" label="帖子内容" width="200">
                        <template v-slot:default="{ row }">
                            <span class="ellipsis">{{ row.postContent }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdTime" label="发帖时间" width="120">
                        <template v-slot:default="{ row }">
                            <span>{{ formatDate(row.createdTime) }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" min-width="180">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.postId)">
                                详情
                            </el-button>
                            <el-button link type="primary" size="small" @click="singleDelete(scope.row.communityId)">
                                删除
                            </el-button>
                            <el-button link type="primary" size="small" @click="openUpdateDialog(scope.row)">
                                编辑
                            </el-button>
                        </template>

                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="帖子评论" name="second"></el-tab-pane>
                        </el-tabs>
                <br />
                <!-- 分页 -->
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[3, 5, 10, 20]" layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
 </el-card>


    <!-- 对话框:添加,修改功能 -->
    <el-drawer v-model="dialogFormVisible" :title="title" size="40%" direction="rtl">
    <el-form :model="form" label-width="150px">
        <el-form-item label="社区名">
            <el-input v-model="form.communityName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="发帖用户">
            <el-input v-model="form.userName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="帖子标题">
            <el-input v-model="form.postTitle" autocomplete="off" />
        </el-form-item>
        <el-form-item label="帖子内容">
            <el-input v-model="form.postContent" type="textarea" autocomplete="off" />
        </el-form-item>
    </el-form>
    <template #footer>
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
    </template>
</el-drawer>


    <!-- 详情抽屉 -->
<el-drawer v-model="dialogDetailVisible" :title="'帖子详情'" size="35%" direction="rtl">
    <el-descriptions title="帖子详情信息" :column="1" border>
        <el-descriptions-item label="帖子标题">
            <span>{{ form.postTitle }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="帖子内容">
            <span>{{ form.postContent }}</span>
        </el-descriptions-item>
    </el-descriptions>

    <template #footer>
        <div class="drawer-footer">
            <el-button @click="dialogDetailVisible = false">关闭</el-button>
        </div>
    </template>
</el-drawer>


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

            isPostSelected: false, // 控制表格显示
            activeName: 'first', // 当前 Tab

            postData: [],
            dialogUserInfoVisible: false,
            dialogDetailVisible: false,   //详细对话框
            dialogFormVisible: false,  //对话框是否展示,默认为不展示

            queryStr: "",                   //查询条件
            multipleSelection: [],       //多选删除
            tableData: [],    //帖子信息数据
            userData: [],        //用户信息数据
            queryData: [],
            pageInfo: {},       //分页信息对象
            pageSize: 5,        //当前页条数
            pageNum: 1,     //当前页号
            users: {},
            commentform: {},        //专门用来显示帖子的评论
            form: {},                       //对话框表单数据
            formLabelWidth: "150px",    //对话框label宽度
            title: "",                           //对话框标题
            btnName: "",                     //对话框按钮文字
            // claInfoData: [],                  //加载到下拉框的班级信息
            imageUrl: "",                     //图片URL
            catInfoData: [
                { categoryId: 1, catName: '计算机科学' },
                { categoryId: 2, catName: '数学' },
                { categoryId: 3, catName: '物理' },
            ],
            selectedField: "",  // 选择的查询字段
            formatDate(date) {
                const d = new Date(date);
                return d.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // 24小时制
                }).replace(/\//g, '-'); // 将日期中的“/”替换为“－”
            },
        };
    },


    methods: {

        handleClick(tab) {
        if (tab.name === 'second') {
            this.fetchComments();
        }
    },
    // fetchComments() { 第二层处理
    //     if (!this.selectedPostId) {
    //         ElMessage.warning("请先选择一个帖子！");
    //         return;
    //     }
    //     this.$http.get(`/v1/posts/${this.selectedPostId}/comments`).then((response) => {
    //         this.commentsData = response.data;
    //     }).catch(() => {
    //         ElMessage.error("加载评论失败");
    //     });
    // },
        // handleSuccess(response) {            //图片上传成功后的回调函数
        //     console.log(response);
        //     // this.imageUrl = response
        //     this.form.stu_image_url = response
        // },

        handleSizeChange(pageSize) {            //选择每一页显示的记录数
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr)
            console.log("size:", pageSize);
        },

        handleCurrentChange(pageNum) {      //切换页号时得到当时页号
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr)
            console.log("num:", pageNum);
            
        },

        getPageData(num, size, searchField, searchKeyword) {
            // 构建查询条件对象，假设你希望根据 communityName 和 userName 搜索
            let communitySearch = {
                communityName: searchField === 'communityName' ? searchKeyword : '',
                userName: searchField === 'userName' ? searchKeyword : '',
                postTitle: searchField === 'postTitle' ? searchKeyword : '',
                postContent: searchField === 'postContent' ? searchKeyword : ''
            };

            // 发送POST请求到后端
            this.$http.post("/v1/posts/search?pageNum=" + num + "&pageSize=" + size, communitySearch)
                .then(response => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.list;
                    console.log("查询结果:", this.tableData);
                })
                .catch(error => {
                    console.error("查询出错:", error);
                    ElMessage({
                        type: 'error',
                        message: '查询失败'
                    });
                });
        },

        closeDialog() {
            this.form = []
            console.log("closeDialog.....")
        },

        //点击"帖子详情",弹出抽屉,里面是帖子的详细内容
        openDetailDialog(postid) {
            var _this = this
            this.$http.get("/v1/posts/post/" + postid).then(function (response) {
                console.log(response.data);
                _this.form = response.data
            })

            this.$http.get("/v1/posts/post/comment/" + postid).then(function (response) {
                console.log(response.data);
                _this.commentform = response.data
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
            this.form = row         //得到要修改的数据,并回显到对话框的表单上
            console.log("openUpdateDialog....");
        },

        updateCmn() {        //修改功能
            console.log(this.form);
            var _this = this;
            // this.form.stu_interest = this.form.stu_interest.join(',')              //将数据转为字符串
            this.$http.put("v1/posts/post", this.form).then(function (response) {
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
            this.$http.post("v1/posts/post", this.form).then(function (response) {
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
                    this.$http.delete("v1/posts/post" + cmnid).then(function (response) {
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
                        this.$http.delete("v1/posts/post/" + cmnid).then(function (response) {
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
            console.log("查询内容:", this.queryStr);
            // 检查当前页码,如果未定义则使用默认值1
            let num = this.currentPage || 1;
            // 检查每页大小,如果未定义则使用默认值3 
            let size = this.pageSize || 5;

            // 构建查询参数
            let field = this.selectedField || '';
            let keyword = this.queryStr || '';


            // 调用getPageData并传入所有参数
            this.getPageData(num, size, field, keyword);
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
        this.getPageData(1, 5)
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



<style scoped>
.card {
    width: 100%;
    margin: 20px 0;
}

.card-header {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.header-actions {
    display: flex;
    align-items: center;
}

.header-actions .el-input {
    margin-right: 10px;
}

.button {
    margin-left: 10px;
}

.dialog-footer {
    text-align: center;
}

.ellipsis {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>