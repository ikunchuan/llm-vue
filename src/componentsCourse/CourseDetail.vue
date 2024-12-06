<template>
    <el-card class="card">
        <div slot="header" class="card-header"></div>
        <el-tabs v-model="activeTab" @tab-click="handleClick">
            <el-tab-pane label="课程信息" name="课程信息">

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
                        <el-tag size="small" >{{isCorrectId()}}</el-tag>   <!-- 这里硬编码类别名称为 '计算机科学' -->
                    </el-descriptions-item>
                    <el-descriptions-item label="课程简介" >{{form.courseDescription}}</el-descriptions-item>
                </el-descriptions>
            </el-tab-pane>

            <el-tab-pane label="章节管理">
                <!-- 章节管理的内容 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入课程名称" />&nbsp;
                <el-button type="primary"  @click="queryInfo">查询</el-button>


                <!-- 表格 -->
                <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
                    <el-table-column fixed type="selection" width="55" />
                    <el-table-column prop="categoryId" label="类别" width="70" />
                
                    <!-- 课程名称列 -->
                    <el-table-column prop="courseName" label="课程名称" width="100">
                        <template #default="{ row }">
                        <div class="truncate-text">{{ row.courseName }}</div>
                        </template>
                    </el-table-column>
                    
                    <!-- 章节名称列 -->
                    <el-table-column prop="chapterName" label="章节名称" width="100">
                        <template #default="{ row }">
                        <div class="truncate-text">{{ row.chapterName }}</div>
                        </template>
                    </el-table-column>

                    <!-- 章节简介列 -->
                    <el-table-column prop="chapterDescription" label="章节简介" width="100">
                        <template #default="{ row }">
                        <div class="truncate-text">{{ row.chapterDescription }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="chapterDifficulty" label="难度级别" width="100" />
                    <el-table-column prop="chapterRating" label="评分" width="70" />

                    <el-table-column prop="updatedTime" label="更新时间" width="100">
                        <template #default="{ row }">
                        <span>{{ formatDate(row.updatedTime) }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="createdTime" label="创建时间" width="100">
                        <template #default="{ row }">
                        <span>{{ formatDate(row.createdTime) }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" min-width="180">
                        <template #default="scope">
                        <el-button link size="small" @click="openDetailDialog(scope.row.chapterId)">详情</el-button>
                        <el-button link size="small" @click="singleDelete(scope.row.chapterId)">删除</el-button>
                        <el-button link size="small" @click="openUpdateDialog(scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
            loading :true,
            activeTab: '课程信息',  // 当前选中的标签页
            queryStr: "",  // 查询字段
            courseImage: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',  // 默认课程封面
            form: {},  // 存放课程信息
            dialogFormVisible: false,  // 控制添加/编辑弹窗显示
            title: '',  // 弹窗标题
            btnName: '',  // 弹窗按钮名称
            tableData: [], // 存储查询的数据
            queryData: [], // 存储原始数据

            catInfoData: [], //表格的类别信息
            catIdAndName: [], //全部类别id和名称

            courseInfo: '', // 用户输入的课程信息
            chapters: [], // 返回的章节数据
        };
    },

    mounted() {
            this.getPageData();  // 加载初始课程数据

            //在页面加载时获取所有分类，给到添加和编辑题目的分类下拉框
            this.$http.get('/cat/v1/all').then((response) => {
            this.catIdAndName = response.data;
            console.log(this.catIdAndName);
        });
    },

    methods: {

            // fetchAllChapters() {
            //     this.$http.get("/crs/allChapters")
            //         .then(response => {
            //             this.tableData = response.data; // 将章节数据绑定到表格
            //         })
            //         .catch(error => {
            //             console.error('Error fetching all chapters:', error);
            //             ElMessage({ message: '加载章节信息失败，请重试', type: 'error' });
            //         });
            // },
            
            // fetchChapters() {
            // this.loading = true;
            // const params = { courseName: this.courseInfo };
            // this.$http.post('crs/search/chapter', params)
            //     .then(response => {
            //     this.chapters = response.data;
            //     })
            //     .catch(error => {
            //     console.error('Error fetching chapters:', error);
            //     ElMessage({ message: '章节加载失败，请重试', type: 'error' });
            //     })
            //     .finally(() => {
            //     this.loading = false;
            //     });
            // },
            fetchChapters() {
                if (!this.courseInfo) {
                    ElMessage({ message: '请输入课程名称进行查询', type: 'warning' });
                    return;
                }
                this.loading = true;
                const params = { courseName: this.courseInfo }; // 使用课程名称查询
                this.$http.post('/crs/search/chapter', params)``
                    .then(response => {
                        if (response.data && response.data.length > 0) {
                            this.chapters = response.data; // 绑定章节数据
                            ElMessage({ message: '章节信息加载成功', type: 'success' });
                        } else {
                            this.chapters = [];
                            ElMessage({ message: '未找到相关章节信息', type: 'warning' });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching chapters:', error);
                        ElMessage({ message: '章节加载失败，请重试', type: 'error' });
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },


            //用于课程内容管理的类别匹配
            isCorrectId() {
                if (this.form.categoryId == null) {
                    return;
                }else{
                    return this.catIdAndName.filter(item => item.categoryId === this.form.categoryId)[0].categoryName
                }
                
            },
            // 加载数据
            getPageData(queryStr) {
                if (!queryStr) {
                    ElMessage({ message: '请输入课程名称进行查询', type: 'warning' });
                    return;
                }

                this.$http.get('/crs/searchParagraph/' + queryStr)
                    .then(response => {
                        const data = response.data;
                        console.log(data);  // 打印返回的数据
                        if (response) {
                        this.loading = false;
                    }

                        if (data && data.length > 0) {
                            if (data.length === 1) {
                                this.form = data[0];  // 如果只返回一条记录，直接展示课程信息
                                this.queryData = data;  // 存储查询数据
                                console.log(this.form);
                            } else {
                                // 如果返回多条记录，可扩展为展示列表
                                ElMessage({ message: '查询结果包含多条记录，请精确输入课程名称', type: 'warning' });
                            }
                        } else {
                            ElMessage({ message: '未找到匹配的课程信息', type: 'warning' });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
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
