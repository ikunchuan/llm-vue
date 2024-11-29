<template>

    <div class="common-layout">
        <el-container>
            <el-header style="background-color: antiquewhite;">
                Header
                <Breadcrumb>
                    <BreadcrumbItem to="/">Home</BreadcrumbItem>
                    <BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem>
                    <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
                </Breadcrumb>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu active-text-color="#ffd04b" background-color="antiquewhite" class="el-menu-vertical-demo"
                        default-active="2" text-color="black" @open="handleOpen" @close="handleClose">

                        <!-- 一级目录: 用户管理 -->
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <location />
                                </el-icon>
                                <span>用户管理</span>
                            </template>
                            <el-menu-item index="1-1"><RouterLink to="/UserList">用户基本信息管理</RouterLink></el-menu-item>
                            <el-menu-item index="1-2">用户行为监控管理</el-menu-item>
                            <el-menu-item index="1-3">违规用户处理</el-menu-item>
                        </el-sub-menu>

                        <!-- 一级目录: 竞赛中心管理 -->
                        <el-sub-menu index="2">
                            <template #title>
                                <el-icon>
                                    <location />
                                </el-icon>
                                <span>竞赛中心管理</span>
                            </template>
                            <el-menu-item index="1-1">竞赛信息管理</el-menu-item>
                            <el-menu-item index="1-2">类别一级分类管理</el-menu-item>
                            <el-menu-item index="1-3">类别二级分类管理</el-menu-item>
                        </el-sub-menu>

                        <!-- 一级目录: 资源中心 -->
                        <el-sub-menu index="3">
                            <template #title>
                                <el-icon>
                                    <location />
                                </el-icon>
                                <span>资源中心</span>
                            </template>
                            <el-menu-item index="1-1">课程信息管理</el-menu-item>
                            <el-menu-item index="1-2">课程详细内容管理</el-menu-item>
                            <el-menu-item index="1-3">题目信息管理</el-menu-item>
                            <el-menu-item index="1-4">题目难度管理</el-menu-item>
                        </el-sub-menu>

                        <!-- 一级目录: 社区管理 -->
                        <el-sub-menu index="4">
                            <template #title>
                                <el-icon>
                                    <location />
                                </el-icon>
                                <span>社区管理</span>
                            </template>
                            <el-menu-item index="1-1">社区用户管理</el-menu-item>
                            <el-menu-item index="1-2">社区板块管理</el-menu-item>
                            <el-menu-item index="1-3">社区内容管理</el-menu-item>
                            <el-menu-item index="1-4">社区审核管理</el-menu-item>
                        </el-sub-menu>

                    </el-menu>
                </el-aside>



                <el-container>
                    <el-main>








                    </el-main>


                    <el-footer>Footer</el-footer>
                </el-container>


            </el-container>
        </el-container>
    </div>

</template>

<script>
import { Document, Menu, Setting } from '@element-plus/icons-vue';

export default {
    data() {
        return {
            // You can add any data properties if necessary
        };
    },
    components: {
        Document,
        Menu,
        Setting
    }
}
</script>

<style scoped>
/* Layout adjustments */
.common-layout {
    height: 100vh;
}

.el-header {
    background-color: #409EFF;
    color: white;
    padding: 10px;
    text-align: center;
    font-size: 18px;
}

.left-sidebar {
    background-color: #f4f4f4;
}

.el-menu-vertical-demo {
    width: 100%;
    background-color: #ffffff;
    border-right: 1px solid #e4e7ed;
}

.el-menu-item,
.el-submenu__title {
    font-size: 14px;
    color: #333;
}

/* Hover and active item styles */
.el-menu-item:hover,
.el-submenu__title:hover {
    background-color: #f5f7fa;
}

.el-submenu {
    border-bottom: 1px solid #e4e7ed;
}

/* Router view for the main content area */
.el-main {
    padding: 20px;
    background-color: #f9f9f9;
}
</style>

<style scoped>
/* 美化字体和调整布局 */

/* 一级目录 */
.el-menu-vertical-demo .el-submenu__title {
    font-size: 16px;
    /* 稍微增大字体 */
    font-weight: 600;
    /* 加粗字体 */
    padding-left: 15px;
    /* 调整位置，稍微向左 */
    text-align: left;
    /* 确保左对齐 */
}

/* 二级目录 */
.el-menu-vertical-demo .el-menu-item {
    font-size: 14px;
    /* 稍微减小二级目录字体 */
    text-align: right;
    /* 让二级目录靠右 */
    padding-right: 15px;
    /* 给二级目录增加一点右侧间距 */
}

/* 一级目录标题的图标 */
.el-menu-vertical-demo .el-submenu__title .el-icon {
    margin-right: 10px;
    /* 图标和文本之间稍微增加一点间距 */
}

/* 调整激活项颜色 */
.el-menu-vertical-demo .el-menu-item.is-active,
.el-menu-vertical-demo .el-submenu.is-active .el-submenu__title {
    color: #ffd04b !important;
    /* 激活项的字体颜色 */
}

/* 使整个菜单栏更具层次感 */
.el-menu-vertical-demo {
    border-right: 1px solid #e4e7ed;
    /* 添加右侧边框 */
}

/* 二级菜单项 hover 效果 */
.el-menu-vertical-demo .el-menu-item:hover {
    background-color: #f5f7fa;
    /* 选中时改变背景颜色 */
}

/* Submenu 下拉效果 */
.el-submenu.is-opened .el-submenu__title {
    background-color: #f5f7fa;
    /* 改变下拉时背景 */
}
</style>