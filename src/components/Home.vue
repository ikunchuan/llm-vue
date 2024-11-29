<template>
    <div class="common-layout">
      <el-container>
        <!-- Header -->
        <el-header class="header">
          <div class="breadcrumb-container">
            <Breadcrumb class="breadcrumb">
              <BreadcrumbItem to="/">Home</BreadcrumbItem>
              <BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem>
              <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
            </Breadcrumb>
          </div>
  
          <div class="header-right">
            <el-dropdown class="icon-dropdown">
              <el-button class="icon-button" icon="el-icon-bell" @click="handleNotification">
                <span class="badge">3</span>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>Notification 1</el-dropdown-item>
                <el-dropdown-item>Notification 2</el-dropdown-item>
                <el-dropdown-item>Notification 3</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button class="icon-button" icon="el-icon-setting" @click="handleSettings"></el-button>
            <el-button class="icon-button" icon="el-icon-user" @click="handleProfile"></el-button>
          </div>
        </el-header>
  
        <el-container class="main-container">
          <!-- Sidebar -->
          <el-aside width="220px" class="sidebar">
            <el-menu active-text-color="#ffffff" background-color="linear-gradient(180deg, #0a1f44 0%, #2e3c56 100%)"
                     class="el-menu-vertical-demo" default-active="1" text-color="#fff" @open="handleOpen" @close="handleClose">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><location /></el-icon>
                  <span class="menu-title">用户管理</span>
                </template>
                <el-menu-item index="1-1"><RouterLink to="/home/userList">用户基本信息管理</RouterLink></el-menu-item>
                <el-menu-item index="1-2"><RouterLink to="/home/userMonitor">用户行为监控管理</RouterLink></el-menu-item>
                <el-menu-item index="1-3"><RouterLink to="/home/userViolation">违规用户处理</RouterLink></el-menu-item>
              </el-sub-menu>
  
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><location /></el-icon>
                  <span class="menu-title">竞赛中心管理</span>
                </template>
                <el-menu-item index="2-1"><RouterLink to="/home/competitionInfo">竞赛信息管理</RouterLink></el-menu-item>
                <el-menu-item index="2-2"><RouterLink to="/home/category1">类别一级分类管理</RouterLink></el-menu-item>
                <el-menu-item index="2-3"><RouterLink to="/home/category2">类别二级分类管理</RouterLink></el-menu-item>
              </el-sub-menu>
  
              <el-sub-menu index="3">
                <template #title>
                  <el-icon><location /></el-icon>
                  <span class="menu-title">资源中心</span>
                </template>
                <el-menu-item index="3-1"><RouterLink to="/home/courseInfo">课程信息管理</RouterLink></el-menu-item>
                <el-menu-item index="3-2"><RouterLink to="/home/courseDetail">课程详细内容管理</RouterLink></el-menu-item>
                <el-menu-item index="3-3"><RouterLink to="/home/questionInfo">题目信息管理</RouterLink></el-menu-item>
                <el-menu-item index="3-4"><RouterLink to="/home/questionDifficulty">题目难度管理</RouterLink></el-menu-item>
              </el-sub-menu>
  
              <el-sub-menu index="4">
                <template #title>
                  <el-icon><location /></el-icon>
                  <span class="menu-title">社区管理</span>
                </template>
                <el-menu-item index="4-1"><RouterLink to="/home/communityUser">社区用户管理</RouterLink></el-menu-item>
                <el-menu-item index="4-2"><RouterLink to="/home/communityBoard">社区板块管理</RouterLink></el-menu-item>
                <el-menu-item index="4-3"><RouterLink to="/home/communityContent">社区内容管理</RouterLink></el-menu-item>
                <el-menu-item index="4-4"><RouterLink to="/home/communityAudit">社区审核管理</RouterLink></el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-aside>
  
          <!-- Main Content -->
          <el-container class="content-container">
            <el-main>
              <router-view></router-view>
            </el-main>
            <el-footer class="footer">Footer</el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {};
    },
    methods: {
      handleNotification() {
        console.log("Notification clicked");
      },
      handleSettings() {
        console.log("Settings clicked");
      },
      handleProfile() {
        console.log("Profile clicked");
      },
      handleOpen() {},
      handleClose() {}
    }
  };
  </script>
  
  <style scoped>
  /* Global Styles */
  body {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    background-color: #f4f6fc;
    margin: 0;
    padding: 0;
  }
  
  /* Main Layout */
  .common-layout {
    min-height: 100vh;
  }
  
  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 15px 24px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .breadcrumb-container {
    display: flex;
    align-items: center;
  }
  
  .breadcrumb {
    font-size: 14px;
    color: #333;
    padding: 6px 0;
    margin: 0;
  }
  
  .header-right {
    display: flex;
    align-items: center;
  }
  
  .icon-button {
    background: transparent;
    border: none;
    color: #4a90e2;
    font-size: 20px;
    margin-left: 15px;
  }
  
  .icon-button:hover {
    color: #0066cc;
  }
  
  .badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #e74c3c;
    color: #fff;
    padding: 2px 5px;
    border-radius: 50%;
    font-size: 10px;
  }
  
  /* Sidebar */
  .sidebar {
    background: linear-gradient(180deg, #0a1f44 0%, #2e3c56 100%);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 0 10px 10px 0;
    padding-top: 20px;
  }
  
  /* Menu Styling */
  .el-menu-vertical-demo {
    border: none;
    font-size: 16px;
    font-weight: 600;
  }
  
  .menu-title {
    color: #ffffff;
    font-size: 18px;
  }
  
  .el-menu-item {
    font-size: 14px;
    color: #ddd;
    padding: 12px 16px;
    border-radius: 8px;
    transition: background-color 0.3s ease;
  }
  
  .el-menu-item:hover {
    background-color: #3A4A8B;
    color: #fff;
  }
  
  /* Active Menu Item */
  .el-menu-item.is-active {
    background-color: #ffd04b;
    color: #fff;
  }
  
  /* Content Container */
  .content-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-top: 20px;
  }
  
  /* Footer */
  .footer {
    background: linear-gradient(180deg, #0a1f44 0%, #2e3c56 100%);
    text-align: center;
    padding: 15px 0;
    font-size: 14px;
    color: #ddd;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .footer a {
    color: #f5f5f5;
    text-decoration: none;
  }
  
  .footer a:hover {
    color: #ffd04b;
  }
  
  /* Responsive Design */
  @media screen and (max-width: 1024px) {
    .sidebar {
      width: 200px;
    }
  
    .header-right .icon-button {
      font-size: 18px;
    }
  }
  
  @media screen and (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: auto;
      position: relative;
      box-shadow: none;
    }
  
    .el-menu-vertical-demo {
      font-size: 14px;
    }
  
    .menu-title {
      font-size: 16px;
    }
  }
  </style>
  