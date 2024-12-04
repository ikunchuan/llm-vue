<template>
  <div class="common-layout">
    <el-container>
      <!-- Sidebar -->
      <el-aside width="220px" class="sidebar">
        <el-menu active-text-color="#ffffff" background-color="linear-gradient(180deg, #0a1f44 0%, #2e3c56 100%)"
          class="el-menu-vertical-demo" default-active="1" text-color="#fff" @open="handleOpen" @close="handleClose">
          <!-- 用户管理, 竞赛中心管理, 资源中心, 社区管理 -->
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <location />
              </el-icon>
              <span class="menu-title">用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <RouterLink to="/home/userList">用户基本信息管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="1-2">
              <RouterLink to="/home/userMonitor">用户行为监控管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="1-3">
              <RouterLink to="/home/userViolation">违规用户处理</RouterLink>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <location />
              </el-icon>
              <span class="menu-title">竞赛中心管理</span>
            </template>
            <el-menu-item index="2-1">
              <RouterLink to="/home/competitionInfo">竞赛信息管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="2-2">
              <RouterLink to="/home/competitionDetail">竞赛详情管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="2-3">
              <RouterLink to="/home/category2">类别二级分类管理</RouterLink>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <location />
              </el-icon>
              <span class="menu-title">资源中心</span>
            </template>
            <el-menu-item index="3-1">
              <RouterLink to="/home/courseInfo">课程信息管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="3-2">
              <RouterLink to="/home/courseDetail">课程详细内容管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="3-3">
              <RouterLink to="/home/questionInfo">题目信息管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="3-4">
              <RouterLink to="/home/questionDifficulty">题目难度管理</RouterLink>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="4">
            <template #title>
              <el-icon>
                <location />
              </el-icon>
              <span class="menu-title">社区管理</span>
            </template>
            <el-menu-item index="4-1">
              <RouterLink to="/home/communityUser">社区用户管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="4-2">
              <RouterLink to="/home/communityBoard">社区板块管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="4-3">
              <RouterLink to="/home/communityContent">社区内容管理</RouterLink>
            </el-menu-item>
            <el-menu-item index="4-4">
              <RouterLink to="/home/communityAudit">社区审核管理</RouterLink>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- Main Content -->
      <el-container class="content-container">
        <el-header class="header">
          <!-- <div class="breadcrumb-container">
            <el-breadcrumb class="breadcrumb">
              <el-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index" :to="crumb.path">
                {{ crumb.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div> -->
          <div class="breadcrumb-container">
            <el-breadcrumb class="breadcrumb" separator=">">
              <Icon type="ios-home-outline"></Icon>
              <!-- <el-breadcrumb-item to="/">
                <el-icon class="breadcrumb-icon" name="home"></el-icon> Home
              </el-breadcrumb-item>
              <el-breadcrumb-item to="/components/breadcrumb">
                <el-icon class="breadcrumb-icon" name="list"></el-icon> Components
              </el-breadcrumb-item>
              <el-breadcrumb-item>
                <el-icon class="breadcrumb-icon" name="coffee"></el-icon> Breadcrumb
              </el-breadcrumb-item> -->
              <el-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index" :to="crumb.path">
                {{ crumb.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>


          <div class="header-right">
            <el-dropdown class="icon-dropdown">
              <el-button class="icon-button" icon="el-icon-bell" @click="handleNotification">
                <span class="badge">5</span>
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




        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer class="footer">Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script >
export default {
  data() {
    return {};
  },
  computed: {
    breadcrumbs() {
      // 获取当前路由的路径部分
      const pathArray = this.$route.path.split('/').filter((part) => part);
      const breadcrumbList = [];

      let fullPath = '/';

      // 遍历路径，生成每一层的面包屑项
      pathArray.forEach((part, index) => {
        fullPath += '${part}/'; 
        breadcrumbList.push({
          name: this.getBreadcrumbName(part), // 这里的 getBreadcrumbName 是自定义的
          path: fullPath
        });
      });

      return breadcrumbList;
    }
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
    handleOpen() { },
    handleClose() { },
    getBreadcrumbName(path) {
      // 根据路由的路径来返回对应的面包屑名称
      const names = {
        'userList': '用户基本信息管理',
        'userMonitor': '用户行为监控管理',
        'userViolation': '违规用户处理',
        'competitionInfo': '竞赛信息管理',
        'category1': '类别一级分类管理',
        'category2': '类别二级分类管理',
        'courseInfo': '课程信息管理',
        'courseDetail': '课程详细内容管理',
        'questionInfo': '题目信息管理',
        'questionDifficulty': '题目难度管理',
        'communityUser': '社区用户管理',
        'communityBoard': '社区板块管理',
        'communityContent': '社区内容管理',
        'communityAudit': '社区审核管理'
      };
      return names[path] || path;
    }, // 如果没有找到对应的名称，返回路径本身
    updateBreadcrumbs() {
      // 在这里更新面包屑数据（可选）
      // 如果你希望更精细地控制面包屑，可以在这里做更多处理。
    }

  },
  watch: {
    // 路由变化时更新面包屑
    '$route': 'updateBreadcrumbs'
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
  display: flex;
  flex-direction: row;
}

/* Sidebar */
.sidebar {
  background: linear-gradient(180deg, #0a1f44 0%, #2e3c56 100%);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 0 10px 10px 0;
  padding-top: 20px;
  position: relative;
}

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

.el-menu-item.is-active {
  background-color: #ffd04b;
  color: #fff;
}

/* Content Container */
.content-container {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 0px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
}

/* Header */
.header {
  /* display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 15px 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  /* 更深的背景颜色 */
  padding: 10 px 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

}

.header-right {
  display: flex;
  align-items: center;

}

.icon-button {
  /* background: transparent;
  border: none;
  color: #4a90e2;
  font-size: 20px;
  margin-left: 15px; */
  background: #007bff;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 20px;
  margin-left: 15px;
  padding: 8px;
}

.icon-button:hover {
  /* color: #0066cc; */
  background: #0056b3;
  color: white;
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

/* Breadcrumb Positioning */
.breadcrumb-container {
  /* position: absolute;
  top: 20px;
  right: 960px;
  z-index: 10; */
  flex-grow: 1;
}

.breadcrumb {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  padding: 5px 0;
  background-color: transparent;  /* 去掉背景色 */
  border: none;  /* 去掉边框 */
  box-shadow: none;  /* 去掉阴影 */
  margin: 0;  /* 去掉默认的外边距 */
}

/* 面包屑项 */
.breadcrumb-item {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

/* 面包屑图标 */
.breadcrumb-icon {
  margin-right: 8px;
  font-size: 16px;
  color: #007bff;  /* 设置图标颜色 */
}

/* 分隔符 */
.el-breadcrumb__separator {
  margin: 0 5px;
  color: #007bff;
}

/* 面包屑项悬停效果 */
.breadcrumb-item:hover {
  color: #007bff;
  cursor: pointer;
}

/* 其他样式保持不变 */
.icon-button {
  background: #007bff;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 20px;
  margin-left: 15px;
  padding: 8px;
}

.icon-button:hover {
  background: #0056b3;
  color: white;
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
</style>