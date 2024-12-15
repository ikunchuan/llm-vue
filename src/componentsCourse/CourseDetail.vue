<template>
    <el-card class="card">
        <div slot="header" class="card-header">课程信息</div>

        <!-- 查询字段选择：用户输入查询内容 -->
        <el-input v-model="queryStr" style="width: 220px" placeholder="请输入课程名称" />&nbsp;
        <el-button type="primary" @click="queryInfo">查询</el-button>
        <!-- 课程编辑按钮 -->
        <el-button type="warning" @click="openCourseUpdateDialog">编辑课程</el-button>

        <!-- 显示课程信息 -->
        <el-descriptions direction="vertical" border style="margin-top: 20px">
            <el-descriptions-item :rowspan="2" :width="140" label="课程封面" align="center">
                <el-image style="width: 100px; height: 100px" :src="courseImage" />
            </el-descriptions-item>
            <el-descriptions-item label="课程名称">{{ form.courseName }}</el-descriptions-item>
            <el-descriptions-item label="课程难度">{{ form.courseDifficultyLevel }}</el-descriptions-item>
            <el-descriptions-item label="课程评分">{{ form.courseRating }}</el-descriptions-item>
            <el-descriptions-item label="课程价格" :span="2">{{ form.coursePrice }}</el-descriptions-item>
            <el-descriptions-item label="所属类别">
                <el-tag size="small">{{ isCorrectId() }}</el-tag> <!-- 显示类别名称 -->
            </el-descriptions-item>
            <el-descriptions-item label="课程简介">{{ form.courseDescription }}</el-descriptions-item>
        </el-descriptions>

        <!-- 章节管理部分,显示章节信息 -->
        <el-divider></el-divider> <!-- 分隔线 -->
        <el-button type="primary" @click="openAddChapterDialog">添加章节</el-button>
        <p />

        <!-- 只有在查询课程信息后，才显示章节信息表v-if="tableData.length > 0" -->
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="chapterName" label="章节名称" width="100" />
            <el-table-column prop="chapterDescription" label="章节简介" width="150">
                <template #default="{ row }">
                    <div class="truncate-text">{{ row.chapterDescription }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="创建时间" width="100">
                <template #default="{ row }">
                    <span>{{ formatDate(row.createdTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updatedTime" label="更新时间" width="100">
                <template #default="{ row }">
                    <span>{{ formatDate(row.updatedTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button link size="small" @click="openChapterUpdateDialog(scope.row)">编辑</el-button>
                    <el-button link size="small" @click="singleDelete(scope.row.chapterId)">删除</el-button>
                    <el-button type="primary" size="small" @click="viewLessons(scope.row.chapterId)">查看分集</el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-card>

    <!-- 编辑课程信息的抽屉 -->
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
                <el-input v-model="form.courseDescription" type="textarea" rows="10" maxlength="100" show-word-limit />
            </el-form-item>
        </el-form>

        <template #footer>
            <div style="flex: auto">
                <el-button @click="closeDrawer">取消</el-button>
                <el-button type="primary" @click="updateCourse">保存</el-button>
            </div>
        </template>
    </el-drawer>

    <!-- 编辑章节弹窗 -->
    <el-drawer v-model="editChapterDrawerVisible" size="30%" direction="rtl">
        <template #header>
            <h3>编辑章节</h3>
        </template>
        <el-form :model="chapterForm">
            <el-form-item label="章节名称" :label-width="formLabelWidth">
                <el-input v-model="chapterForm.chapterName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="章节简介" :label-width="formLabelWidth">
                <el-input v-model="chapterForm.chapterDescription" type="textarea" rows="4" />
            </el-form-item>
            <el-form-item>
                <el-button @click="closeEditChapterDrawer">取消</el-button>
                <el-button type="primary" @click="updateChapter">保存</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

    <!-- 新增章节弹窗 -->
    <el-drawer v-model="addChapterDrawerVisible" size="30%" direction="rtl">
        <template #header>
            <h3>添加章节</h3>
        </template>
        <el-form :model="chapterForm">
            <el-form-item label="章节名称" :label-width="formLabelWidth">
                <el-input v-model="chapterForm.chapterName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="章节简介" :label-width="formLabelWidth">
                <el-input v-model="chapterForm.chapterDescription" type="textarea" />
            </el-form-item>
            <el-form-item>
                <el-button @click="closeAddChapterDrawer">取消</el-button>
                <el-button type="primary" @click="addChapter">保存</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

    <!-- 章节选集抽屉 -->
    <el-drawer v-model="dialogLessonVisible" title="选集详情" direction="rtl" size="50%">
        <el-table :data="lessons" style="width: 100%" border>
            <el-table-column prop="lessonName" label="选集名称" />

            <el-table-column prop="createdTime" label="上传时间">
                <template v-slot:default="{ row }">
                    <span>{{ formatDate(row.createdTime) }}</span>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <el-button @click="dialoglessonVisible = false">关闭</el-button>
        </template>
    </el-drawer>
</template>


<script>
import { ElMessageBox, ElMessage } from 'element-plus';

export default {
    data() {
        return {
            loading: true,
            queryStr: "",  // 查询字段
            courseImage: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',  // 默认课程封面

            form: {},  // 存放课程信息
            dialogFormVisible: false,  // 控制添加/编辑课程弹窗显示

            chapterForm: {},
            editChapterDrawerVisible: false,  // 控制编辑章节弹窗
            addChapterDrawerVisible: false,  // 控制添加章节弹窗

            dialogLessonVisible: false,// 控制选集抽屉

            title: '',  // 弹窗标题
            btnName: '',  // 弹窗按钮名称
            tableData: [], // 存储查询的章节数据
            queryData: [], // 存储原始课程数据
            catIdAndName: [], // 分类数据
        };
    },

    mounted() {
        this.getPageData();  // 加载初始课程数据

        // 获取所有分类信息
        this.$http.get('/api/cat/v1/all').then((response) => {
            this.catIdAndName = response.data;
        });
    },

    methods: {
        // 查询课程信息
        queryInfo() {
            const trimmedQuery = this.queryStr.trim();
            if (trimmedQuery) {
                this.getPageData(trimmedQuery);
            } else {
                ElMessage({ message: '请输入课程名称进行查询', type: 'warning' });
            }
        },
        // 加载课程数据
        getPageData(queryStr) {
            if (!queryStr) {
                ElMessage({ message: '请输入课程名称进行查询', type: 'warning' });
                return;
            }
            this.$http.get('/api/crs/searchParagraph/' + queryStr)  // 查询课程信息
                .then(response => {
                    console.log("查询到的课程信息", response);
                    const data = response.data;
                    if (data && data.length > 0) {
                        this.form = data[0];  // 直接展示课程信息，如果查到多条只显示第一条
                        this.queryData = data;  // 存储查询数据
                        this.courseName = data[0].courseName;
                        console.log("要查询章节的课程名称", this.courseName);
                        this.queryChapterInfo();  // 查询章节信息
                    } else {
                        ElMessage({ message: '未查询到相关课程', type: 'warning' });
                    }
                });
        },

        // 查询章节信息
        queryChapterInfo() {
            const courseName = { courseName: this.courseName }; // 根据课程名称查询
            this.$http.post('/api/crs/search/chapter', courseName) // 发送POST请求，将courseName作为请求体
                .then(response => {
                    console.log("查询到的章节信息", response);
                    const chapters = response.data;
                    if (chapters && chapters.length > 0) {
                        this.tableData = chapters; // 更新章节数据
                    } else {
                        ElMessage({ message: '没有查到该课程的章节信息', type: 'warning' }); // 提示没有查到章节信息
                        this.tableData = []; // 确保tableData为空数组，避免显示旧数据
                    }
                })
                .catch(error => {
                    ElMessage({ message: '章节信息加载失败', type: 'error' }); // 提示章节信息加载失败
                });
        },

        // 格式化日期
        formatDate(time) {
            let d = new Date(time);
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        },

        // 判断并返回正确的类别ID
        isCorrectId() {
            const category = this.catIdAndName.find(item => item.categoryId === this.form.categoryId);
            return category ? category.categoryName : '未知类别';
        },

        // 打开编辑课程信息的抽屉
        openCourseUpdateDialog() {
            this.isEditingCourse = true;
            this.title = '编辑课程';
            this.form = JSON.parse(JSON.stringify(this.queryData[0])); // 复制课程数据以编辑
            this.dialogFormVisible = true;
        },
        // 关闭编辑课程的抽屉
        closeDrawer() {
            this.dialogFormVisible = false;
        },

        // 打开编辑章节弹窗
        openChapterUpdateDialog(chapter) {
            this.chapterForm = { ...chapter };  // 复制章节信息
            this.editChapterDrawerVisible = true;
        },

        // 关闭编辑章节弹窗
        closeEditChapterDrawer() {
            this.editChapterDrawerVisible = false;
        },

        // 打开添加章节弹窗
        openAddChapterDialog() {
            this.chapterForm = {};  // 清空表单数据
            this.addChapterDrawerVisible = true;
        },

        // 关闭添加章节弹窗
        closeAddChapterDrawer() {
            this.addChapterDrawerVisible = false;
        },

        // 更新章节信息
        updateChapter() {
            if (!this.chapterForm.chapterName || !this.chapterForm.chapterDescription) {
                ElMessage({ message: '请填写完整的章节信息！', type: "warning" });
                return;
            }
            this.$http.put(`/api/chap/v1`, this.chapterForm).then(response => {
                if (response.data == 1) {
                    ElMessage({ message: '章节更新成功', type: 'success' });
                    this.fetchChapters();  // 重新加载章节数据
                    this.closeEditChapterDrawer();  // 关闭编辑章节弹窗
                } else {
                    ElMessage({ message: '更新失败', type: "error" });
                }
            }).catch((err) => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        // 添加新章节
        addChapter() {
            this.$http.post('/api/chap/v1', this.chapterForm)
                .then(response => {
                    if (response.data === 1) {
                        ElMessage({ message: '章节添加成功', type: 'success' });
                        this.fetchChapters(); // 重新加载章节数据
                        this.closeAddChapterDrawer();  // 关闭添加章节弹窗
                    } else {
                        ElMessage({ message: '添加失败', type: "error" });
                    }
                }).catch((err) => {
                    ElMessage({ message: '请求失败，请重试', type: "error" });
                });
        },
        // 保存，更新课程信息
        updateCourse() {
            this.$http.put('/api/crs/v1', this.form)
                .then(response => {
                    ElMessage({ message: '更新成功', type: 'success' });
                    this.closeDrawer();
                })
                .catch(error => {
                    ElMessage({ message: '更新失败，请重试', type: 'error' });
                });
        },

        // // 打开编辑章节弹窗
        // openChapterUpdateDialog(chapter) {
        //     this.chapterForm = { ...chapter };  // 复制章节信息
        //     this.chapterDrawerVisible = true;
        // },

        // // 关闭编辑章节弹窗
        // closeChapterDrawer() {
        //     this.chapterDrawerVisible = false;
        // },

        // // 更新章节信息
        // updateChapter() {
        //     if (!this.chapterForm.chapterName || !this.chapterForm.chapterDescription) {
        //         ElMessage({ message: '请填写完整的题目信息！', type: "warning" });
        //         return;
        //     }
        //     this.$http.put(`/api/chap/v1`, this.chapterForm).then(response => {
        //         if (response.data == 1) {
        //             ElMessage({ message: '章节更新成功', type: 'success' });
        //             this.fetchChapters();  // 重新加载章节数据
        //             this.closeChapterDrawer();
        //             this.dialogChapterFormVisible = false; // 关闭对话框
        //         } else {
        //             ElMessage({ message: '更新失败', type: "error" });
        //         }
        //     }).catch((err) => {
        //         ElMessage({ message: '请求失败，请重试', type: "error" });
        //     });
        // },

        // 删除章节
        singleDelete(chapterId) {
            ElMessageBox.confirm('确认删除该章节？', '删除章节', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http.delete(`/api/crs/v1/${chapterId}`)
                    .then(response => {
                        ElMessage({ message: '章节删除成功', type: 'success' });
                        this.fetchChapters();  // 重新加载章节数据
                    })
                    .catch(error => {
                        ElMessage({ message: '删除失败', type: 'error' });
                    });
            });
        },

        // // 添加新章节
        // addChapter() {
        //     this.$http.post('/api/chap/v1', this.chapterForm)
        //         .then(response => {
        //             console.log("添加章节的响应数据", response);
        //             if (response.data === 1) {
        //                 ElMessage({ message: '章节添加成功', type: 'success' });
        //                 this.fetchChapters(); // 重新加载章节数据
        //                 this.closeChapterDrawer();
        //             } else {
        //                 ElMessage({ message: '添加失败', type: "error" });
        //             }
        //         }).catch((err) => {
        //             ElMessage({ message: '请求失败，请重试', type: "error" });
        //         });
        // },

        //查看
        viewLessons(chapterId) {
            this.$http
                .get(`/api/chap/v1/chapterlesson/${chapterId}`)
                .then((response) => {
                    console.log("返回的查询数据：", response.data);
                    if (response.data && response.data.length > 0) {
                        this.lessons = response.data; // 赋值评论数据
                        this.dialogLessonVisible = true; // 打开选集抽屉
                    } else {
                        ElMessage.warning("该章节暂无选集"); // 提示暂无评论
                    }
                })
                .catch((error) => {
                    ElMessage.error("加载选集失败，请稍后再试");
                    console.error(error);
                });
        },
        handleSelectionChange(val) {
            console.log('Selected Rows: ', val);
        }
    },
};
</script>

<style scoped>
/* 样式调整 */
.card {
    margin-top: 20px;
}

.card-header {
    font-weight: bold;
    font-size: 16px;
}

.truncate-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
