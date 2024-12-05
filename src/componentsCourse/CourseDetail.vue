<template>
    <el-card class="card">
        <div slot="header" class="card-header"></div>
        <el-tabs v-model="activeTab">
            <el-tab-pane label="课程信息">

                <!-- 查询字段选择：用户输入查询内容 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入课程名称" />&nbsp;
                <el-button type="primary" @click="queryInfo">查询</el-button>
                <el-button type="warning" @click="openUpdateDialog">编辑</el-button>

                <!-- 显示课程信息 -->
                <el-descriptions direction="vertical" border style="margin-top: 20px">
                    <el-descriptions-item :rowspan="2" :width="140" label="课程封面" align="center">
                        <el-image style="width: 100px; height: 100px" :src="courseImage" />
                    </el-descriptions-item>
                    <el-descriptions-item label="课程名称">{{ form.courseName }}</el-descriptions-item>
                    <el-descriptions-item label="课程难度" >{{ form.courseDifficultyLevel}}</el-descriptions-item>
                    <el-descriptions-item label="课程评分" >{{form.courseRating}}</el-descriptions-item>
                    <el-descriptions-item label="课程价格" :span="2" >{{form.coursePrice}}</el-descriptions-item>
                    <el-descriptions-item label="所属类别">
                        <el-tag size="small" >计算机科学</el-tag>   <!-- 这里硬编码类别名称为 '计算机科学' -->
                    </el-descriptions-item>
                    <el-descriptions-item label="课程简介" >{{form.courseDescription}}</el-descriptions-item>
                </el-descriptions>
            </el-tab-pane>

            <el-tab-pane label="章节管理">
                <!-- 章节管理的内容 -->
            </el-tab-pane>

            <el-tab-pane label="选集管理">
                <!-- 选集管理的内容 -->
            </el-tab-pane>
        </el-tabs>
    </el-card>



            <el-drawer v-model="dialogFormVisible" :direction="direction" size="35%">
                <template #header>
                    <h3>{{ title }}</h3>
                </template>

                <el-form :model="form">
                    <el-form-item label="课程名称" :label-width="formLabelWidth">
                        <el-input v-model="form.courseName" type="text" autocomplete="off" />
                    </el-form-item>

                    <el-form-item label="课程难度" :label-width="formLabelWidth">
                        <el-select v-model="form.courseDifficultyLevel" placeholder="-- 请选择难度等级 --">
                            <el-option label="初级" value="初级" />
                            <el-option label="中级" value="中级" />
                            <el-option label="高级" value="高级" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="课程评分" :label-width="formLabelWidth">
                        <el-input v-model="form.courseRating" type="number" autocomplete="off" />
                    </el-form-item>

                    <el-form-item label="课程价格" :label-width="formLabelWidth">
                        <el-input v-model="form.coursePrice" type="number" autocomplete="off" />
                    </el-form-item>

                    <el-form-item label="课程简介" :label-width="formLabelWidth">
                        <el-input 
                        v-model="form.courseDescription" 
                        type="textarea" 
                        rows="10"
                        maxlength="100" 
                        show-word-limit />
                    </el-form-item>
                </el-form>

                <template #footer>
                    <div style="flex: auto">
                        <el-button @click="closeDrawer">取消</el-button>
                        <el-button type="primary" @click="updateCourse">保存</el-button>
                    </div>
                </template>
            </el-drawer>
</template>

<script>
import { ElMessageBox , ElMessage } from 'element-plus'; 

export default {
    data() {
        return {
            activeTab: '课程信息',  // 当前选中的标签页
            queryStr: "",  // 查询字段
            courseImage: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',  // 默认课程封面
            form: {},  // 存放课程信息
            dialogFormVisible: false,  // 控制添加/编辑弹窗显示
            title: '',  // 弹窗标题
            btnName: '',  // 弹窗按钮名称
            tableData: [], // 存储查询的数据
            queryData: [], // 存储原始数据
        };
    },

    mounted() {
            this.getPageData();  // 加载初始课程数据
    },

    methods: {
            // 加载数据
            getPageData(queryStr) {
                this.$http.get('/crs/searchParagraph/'+queryStr)
                    .then(response => {
                        console.log(response.data);  // 打印返回的数据
                        if (response.data && response.data.length === 1) {
                            const course = response.data[0];  // 获取单条课程信息
                            this.form = {
                                courseId: course.courseId,
                                courseName: course.courseName,
                                courseDifficultyLevel: course.courseDifficultyLevel,
                                courseRating: course.courseRating,
                                coursePrice: course.coursePrice,
                                courseDescription: course.courseDescription,
                            };  // 更新form对象的数据
                            this.queryData = response.data;  // 存储查询的数据
                        } else {
                            ElMessage({ message: '未找到相关课程信息,请重试', type: 'warning' });
                        }
                    })
                    .catch(() => {
                        ElMessage({ message: '数据加载失败，请重试', type: 'error' });
                    });
            },


            // 查询课程信息
            queryInfo() {
                if (this.queryStr.trim()) {
                    this.getPageData(this.queryStr.trim());
                } else {
                    ElMessage({ message: '请输入课程名称进行查询', type: 'warning' });
                }
            },
            // 打开编辑对话框
            openUpdateDialog(course) {
                this.title = '编辑课程信息';
                this.dialogFormVisible = true;  // 打开抽屉
            },

            // 更新课程信息
            updateCourse() {
                if (!this.form.courseName || !this.form.courseDifficultyLevel || !this.form.courseDescription) {
                    ElMessage({ message: '请填写完整的课程信息！', type: 'warning' });
                    return;
                }

                this.$http.put(`/crs/v1`, this.form).then((response) => {
                    if (response.data === 1) {
                        ElMessage({ message: '课程信息更新成功！', type: 'success' });
                        this.getPageData(this.queryStr);  // 刷新课程列表数据
                        this.dialogFormVisible = false;  // 关闭编辑抽屉
                    } else {
                        ElMessage({ message: '课程信息更新失败，请重试！', type: 'error' });
                    }
                }).catch(() => {
                    ElMessage({ message: '更新失败，请重试', type: 'error' });
                });
            },

            // 关闭编辑抽屉
            closeDrawer() {
                this.dialogFormVisible = false;
            },
    },
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

.header-actions {
    display: flex;
    align-items: center;
}
</style>
