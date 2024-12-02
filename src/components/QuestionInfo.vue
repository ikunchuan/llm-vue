<template>
    <el-card class="card">
        <div slot="header" class="card-header">
            {{ name }}
        </div><br>
        <el-card style="max-width: auto">
            <template #header>
                <div class="card-header">
                    <div class="query">
                        <el-input v-model="queryStr" style="width: 220px" placeholder="请输入学生姓名" />&nbsp;
                        <el-button class="button" type="primary" round @click="queryInfo">查询</el-button>
                    </div>
                    <div>
                        <el-button class="button" type="success" round @click="openAddDialog">添加</el-button>
                        <el-button class="button" type="warning" round @click="multipleDelete">多选删除</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column fixed prop="category_id" label="类别" width="120" />
                <el-table-column prop="question_title" label="题目标题" width="120" />
                <el-table-column prop="question_text" label="题目内容" width="120" />
                <el-table-column prop="correct_answer" label="正确答案" width="120" />
                <el-table-column prop="re_mark" label="备注" width="120" />
                <el-table-column prop="updated_time" label="更新时间" width="120" />
                <el-table-column prop="created_time" label="创建时间" width="120" />
                <el-table-column fixed="right" label="操作" min-width="140">
                    <!--  #default="scope"是给下面的方法设置一个"获取"的参数，让编辑这个按钮可以获取一行的数据 -->
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.stuid)">
                            详情
                        </el-button>
                        <el-button link type="primary" size="small"
                            @click="singleDelete(scope.row.stuid)">删除</el-button>
                        <el-button link type="primary" size="small" @click="openUpdateDialog(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <!-- 分页 -->
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                :background="true" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-card>
    </el-card>

    <!-- 对话框：添加修改功能 -->
    <el-dialog v-model="dialogFormVisible" :title="title" width="500">
        <el-form :model="form">
            <el-form-item label="类别" :label-width="formLabelWidth">
                <el-select v-model="form.category_id" placeholder="--请选择类别--">
                    <el-option v-for="cat in catInfoData" :key="cat.category_id" :label="cat.cat_name"
                        :value="cat.cat_id" />
                </el-select>
            </el-form-item>
            <!-- <el-table-column fixed prop="category_id" label="类别" width="120" />
                <el-table-column prop="question_title" label="题目标题" width="120" />
                <el-table-column prop="question_text" label="题目内容" width="120" />
                <el-table-column prop="correct_answer" label="正确答案" width="120" />
                <el-table-column prop="re_mark" label="备注" width="120" />
                <el-table-column prop="updated_time" label="更新时间" width="120" />
                <el-table-column prop="created_time" label="创建时间" width="120" /> -->
            <el-form-item label="题目标题" :label-width="formLabelWidth">
                <el-input v-model="form.question_title" autocomplete="off" />
            </el-form-item>

            <el-form-item label="性别" :label-width="formLabelWidth">
                <el-radio-group v-model="form.stu_sex">
                    <el-radio value='0'>男</el-radio>
                    <el-radio value='1'>女</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="出生日期" :label-width="formLabelWidth">
                <el-col :span="11">
                    <el-date-picker v-model="form.stu_birthday" type="date" placeholder="请选择时间" style="width: 100%" />
                </el-col>
            </el-form-item>

            <el-form-item label="学历" :label-width="formLabelWidth">
                <el-select v-model="form.stu_education" placeholder="--请选择学历--">
                    <el-option label="大专" value="大专" />
                    <el-option label="本科" value="本科" />
                    <el-option label="硕士" value="硕士" />
                </el-select>
            </el-form-item>

            <el-form-item label="联系方式" :label-width="formLabelWidth">
                <el-input v-model="form.stu_phone" autocomplete="off" />
            </el-form-item>

            <el-form-item label="电子邮件" :label-width="formLabelWidth">
                <el-input v-model="form.stu_email" type="email" autocomplete="off" />
            </el-form-item>

            <el-form-item label="家庭住址" :label-width="formLabelWidth">
                <el-input v-model="form.str_address" type="textarea" />
            </el-form-item>

            <el-form-item label="兴趣爱好" :label-width="formLabelWidth">
                <el-checkbox-group v-model="form.stu_interest">
                    <el-checkbox value="唱" name="type">
                        唱
                    </el-checkbox>
                    <el-checkbox value="跳" name="type">
                        跳
                    </el-checkbox>
                    <el-checkbox value="rap" name="type">
                        rap
                    </el-checkbox>
                    <el-checkbox value="篮球" name="type">
                        篮球
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="幸运数" :label-width="formLabelWidth">
                <el-input v-model="form.lucky_number" type="number" />
            </el-form-item>

            <el-form-item label="幸运色" :label-width="formLabelWidth">
                <el-input v-model="form.my_color" type="color" />
            </el-form-item>

            <el-form-item label="简介" :label-width="formLabelWidth">
                <el-input v-model="form.re_mark" type="textarea" />
            </el-form-item>
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

    <!-- 会话框：显示详情 -->
    <el-dialog v-model="dialogDetailVisible" title="学生信息详情页" width="500">
        <el-form :model="form">
            <el-form-item label="姓名：" :label-width="formLabelWidth">
                <el-form-item :label="form.stu_name" />
            </el-form-item>

            <el-form-item label="姓名：" :label-width="formLabelWidth">
                <el-form-item :label="form.stu_name" />
            </el-form-item>

            <el-form-item label="性别：" :label-width="formLabelWidth">
                <el-form-item>{{ form.stu_sex_s }}</el-form-item>
            </el-form-item>

            <el-form-item label="出生日期：" :label-width="formLabelWidth">
                <el-form-item :label="form.stu_birthday" type="date" />
            </el-form-item>

            <el-form-item label="学历：" :label-width="formLabelWidth">
                <el-form-item :label="form.stu_education" />
            </el-form-item>

            <el-form-item label="联系方式：" :label-width="formLabelWidth">
                <el-form-item :label="form.stu_phone" />
            </el-form-item>

            <el-form-item label="电子邮件：" :label-width="formLabelWidth">
                <el-form-item :label="form.stu_email" />
            </el-form-item>

            <el-form-item label="家庭住址：" :label-width="formLabelWidth">
                <el-form-item :label="form.str_address" />
            </el-form-item>

            <el-form-item label="兴趣爱好：" :label-width="formLabelWidth">
                <el-form-item :label="form.stu_interest" />
            </el-form-item>

            <el-form-item label="幸运数：" :label-width="formLabelWidth">
                <el-form-item :label="form.lucky_number" />
            </el-form-item>

            <el-form-item label="幸运色：" :label-width="formLabelWidth">
                <el-form-item :label="form.my_color" type="color" />
            </el-form-item>

            <el-form-item label="简介：" :label-width="formLabelWidth">
                <el-form-item :label="form.re_mark" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogDetailVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogDetailVisible = false">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>

import { ElMessage, ElMessageBox, } from 'element-plus';

export default {
    data() {
        return {
            name: 'QuestionInfo',
            dialogDetailVisible: false,      //详情对话框默认隐藏
            dialogFormVisible: false,       //增加修改对话框默认隐藏
            queryStr: "",//查询条件
            multipleSelection: [],  //多选框
            tableData: [],      //数据表
            queryData: [],       //备份后台数据
            clsInfoData: [],       //班级数据

            pageInfo: {},  //页面数据
            pageSize: 5,  //页面数据数量
            currentPage: 1,    //页面当前页

            form: {},       //对话框表单数据,
            formLabelWidth: "150px",    //对话框label宽度
            title: "",      //对话框标题
            btnName: "",
        };
    },

    methods() {
        //==========处理页面==============//
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize);
            console.log("size:", pageSize);
        },

        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize);
            console.log("num:", pageNum);
        },

        //=============获取分页数据================//
        getPageData(num, size) {
            this.$http.get("/stu/v1/stuInfo", { params: { pageNum: num, pageSize: size } })
                .then((response) => { //如果使用箭头函数就可以在这里面使用this
                    // this.tableData = response.data;
                    // this.queryData = response.data;
                    console.log(response.data.list);
                    this.pageInfo = response.data
                    this.tableData = this.pageInfo.list
                })
        },

        //==========打开添加会话框===========//
        openAddDialog() {
            try {
                this.btnName = "添加";  //动态修改名称
                this.title = "添加学生信息";
                this.dialogFormVisible = true;  //点击添加按钮，会话框设置为显示
                if (this.form != null) { this.form = {}; }  //处理"点击编辑，取消"之后残留的表单信息。表单初始化
                console.log("opneAddDialog() ...");
            } catch (error) {
                console.error("Error in handleButtonClick:", error);
            }
        },

        //========添加============//
        addStudent() {
            var _this = this;
            //因为多选框选中的兴趣在前端是一个数组Array，而后端接收需要一个字符串String
            // 确保 stu_interest 处理
            if (Array.isArray(this.form.stu_interest)) {
                this.form.stu_interest = this.form.stu_interest.join(','); // 将数组用逗号连接成字符串
            } else if (this.form.stu_interest === null || this.form.stu_interest === '') {
                this.form.stu_interest = ''; // 如果是 null 或空字符串，设置为 ''
            } else if (typeof this.form.stu_interest === 'undefined') {
                this.form.stu_interest = ''; // 如果是 undefined，设置为 ''
            }
            //连接后台进行添加操作，使用post接口
            this.$http.post("/stu/v1/stuS", this.form).then(function (response) {
                console.log(response.data); //添加操作默认返回1，是受影响的行数
                if (response.data == 1) {
                    ElMessage({  //消息弹窗
                        message: '学生信息添加成功！',
                        type: 'success',
                    })
                } else {
                    ElMessage({
                        message: '学生信息添加失败',
                        type: 'warning',
                    })
                }
            })
            //消息弹窗的使用========================================//
            //     ElMessage('This is a message.')
            //     ElMessage({
            //         message: 'Congrats, this is a success message.',
            //         type: 'success',
            //     })
            //     ElMessage({
            //         message: 'Warning, this is a warning message.',
            //         type: 'warning', 
            //     })
            //     ElMessage.error('Oops, this is a error message.')
        },

        //========打开修改会话框=============//
        openUpdateDialog(row) {
            try {
                this.btnName = "修改";
                this.title = "修改学生信息";
                this.dialogFormVisible = true;
                console.log(row);   //控制台输出获取到的数据
                this.form = row;    //在这个会话框的表单显示出来，但是有单选框和多选框显示不了。
                //因为单选做了值的转换，多选需要一个字符串数组
                // 确保 stu_interest 处理 null 和其他类型
                if (this.form.stu_interest === null) {
                    this.form.stu_interest = [];
                } else {
                    this.form.stu_interest = this.form.stu_interest.split(','); // 将获取到的多选框内容改为数组
                }
                // 处理 stu_sex为字符型
                console.log("opneUpdateDialog() ...");
            } catch (error) {
                console.error("Error in handleButtonClick:", error);
            }
        },

        //=========修改==============//
        updateStudent() {
            var _this = this;
            //因为多选框选中的兴趣在前端是一个数组Array，而后端接收需要一个字符串String
            if (Array.isArray(this.form.stu_interest)) {
                this.form.stu_interest = this.form.stu_interest.join(','); // 用逗号将数组中的字符连成字符串
            } else if (this.form.stu_interest === null) {
                this.form.stu_interest = ''; // 如果是 null，将其赋值为空字符串
            }
            //连接后台进行修改操作，使用put接口
            this.$http.put("/stu/v1/stuS", this.form).then(function (response) {
                console.log(response.data); //修改操作默认返回1,是受影响的行数
                if (response.data == 1) {
                    ElMessage({  //消息弹窗
                        message: '学生信息修改成功！',
                        type: 'success',
                    })
                } else {
                    ElMessage({
                        message: '学生信息修改失败',
                        type: 'warning',
                    })
                }
            })
        },

        //=========按钮确认添加修改操作=============//
        btnAddUpdate() {
            if (this.btnName == "添加") {
                this.dialogFormVisible = false  //确认添加后，会话框设置为隐藏
                this.addStudent();  //确认添加
                console.log(this.form); //控制台返回表单
                console.log("添加操作 ...");    //控制台返回消息
            }
            if (this.btnName == "修改") {
                this.dialogFormVisible = false
                this.updateStudent();  //确认修改
                console.log(this.form);  //返回表单
                console.log("修改操作 ...");
            }
        },

        //=========打开详情会话框=============//
        openDetailDialog(stuid) {
            this.dialogDetailVisible = true;
            var _this = this;
            this.$http.get("/stu/v1/stuS/" + stuid).then(function (response) {   //axios跨域访问后台数据
                console.log(response.data);     //控制台输出后台连接到的内容
                _this.form = response.data;
                //如果这个性别是0就变成男，因为我的详情页不显示0
                if (_this.form.stu_sex === 0) {
                    _this.form.stu_sex_s = '男'; // 男
                } else if (_this.form.stu_sex === 1) {
                    _this.form.stu_sex_s = '女'; // 女
                }
            })
        },

        //=================搜索查询=================//
        queryInfo() {
            if (this.queryStr.trim().length > 0) {  //.trim()去掉空格再判断空值
                this.tableData = this.queryData
                this.tableData = this.tableData.filter(  //将值把
                    item => item.stu_name && item.stu_name.match(this.queryStr.trim())
                ) // 确保 stu_name 不为 null
            } else {
                this.tableData = this.queryData
            }
            console.log("queryInfo() ...")
        },

        //============单选删===================//
        singleDelete(stuid) {
            try {
                ElMessageBox.confirm(
                    '是否将该数据将被永久删除?',  //弹窗内容
                    '警告',  //弹窗标题
                    {
                        confirmButtonText: '确认',  //确认按钮
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                    .then(() => {
                        var _this = this;
                        //连接后台进行删除操作，使用delete接口,删除时需要看一下传值的路径，条件查询也是这样
                        this.$http.delete("/stu/v1/stuS/" + stuid).then(function (response) {
                            console.log(response.data); //修改操作默认返回1,是受影响的行数
                            if (response.data == 1) {
                                ElMessage({  //消息弹窗
                                    message: '删除成功！',
                                    type: 'success',
                                })
                            } else {
                                ElMessage({
                                    message: '删除失败',
                                    type: 'warning',
                                })
                            }
                        })
                    })
                    .catch(() => {
                        ElMessage({
                            type: 'info',
                            message: '已取消删除',
                        })
                    })
                console.log("singleDelete() ...");
            } catch (error) {
                console.error("Error in handleButtonClick:", error);
            }
        },

        //=============多选删=======================//
        multipleDelete() {
            ElMessageBox.confirm(
                '是否将选中的多条数据将被永久删除?',  //弹窗内容
                '警告',  //弹窗标题
                {
                    confirmButtonText: '确认',  //确认按钮
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(() => {
                    var num = 0;
                    console.log("mutipleDelete() ...");
                    this.multipleSelection.forEach(element => {
                        var _this = this;
                        var stuid = element.stuid;
                        //连接后台进行删除操作，使用delete接口,删除时需要看一下传值的路径，条件查询也是这样
                        this.$http.delete("/stu/v1/stuS/" + stuid).then(function (response) {
                            console.log(response.data); //修改操作默认返回1,是受影响的行数
                            if (response.data == 1) {
                                num = num + 1;
                                ElMessage({  //消息弹窗
                                    message: '成功删除' + num + '记录!',
                                    type: 'success',
                                })
                            } else {
                                ElMessage({
                                    message: '删除失败',
                                    type: 'warning',
                                })
                            }
                        })
                    })
                })
                .catch(() => {
                    ElMessage({
                        message: '已取消删除',
                        type: 'info',
                    })
                })
        },

        //==========复选框多选处理===============//
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(this.multipleSelection);
        },
    },

    mounted() {
        this.getPageData(1, 5);
        var _this = this;

        this.$http.get("/cat/v1/catInfo").then((response) => {
            console.log(response.data);
            _this.clsInfoData = response.data;
        })

    },

    // computed() {},

    // components: {},
}
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
