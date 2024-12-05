import { createRouter, createWebHashHistory } from "vue-router";
import MainPage from "../components/MainPage.vue";
import Home from "../components/Home.vue";
import Home2 from "../components/Home2.vue";
import Home3 from "../components/Home3.vue";
import Login from "../components/Login.vue";
import Login2 from "../components/Login2.vue";
import Login3 from "../components/Login3.vue";
import Register from "../components/Register.vue"; // 添加注册页面
import UserList from "../componentsUser/UserList.vue"; // 用户基本信息管理
import UserMonitor from "../componentsUser/UserMonitor.vue"; // 用户行为监控管理
import UserViolation from "../componentsUser/UserViolation.vue"; // 违规用户处理
import CompetitionInfo from "../componentsCompetiton/CompetitionInfo.vue"; // 竞赛信息管理
import CompetitionDetail from "../componentsCompetiton/CompetitionDetail.vue"; // 竞赛详情信息管理
import Category from "../componentsCategory/Category.vue"; // 类别管理
import CourseInfo from "../componentsCourse/CourseInfo.vue"; // 课程信息管理
import CourseDetail from "../componentsCourse/CourseDetail.vue"; // 课程详细内容管理
import QuestionInfo from "../componentsQuestion/QuestionInfo.vue"; // 题目信息管理


import UserProfile from "../componentsUser/UserProfile.vue"; // 用户画像分析
import UserActivity from "../componentsUser/UserActivity.vue"; // 用户画像分析

import Trafficanalysis from "../componentsAnalyse/Trafficanalysis.vue"; // 社区活动分析
import PerformanceMonitor from "../componentsAnalyse/PerformanceMonitor.vue"; // 性能监控
import CashFlowStatement from "../componentsAnalyse/CashFlowStatement.vue"; // 现金流量分析
import CommunityActivity from "../componentsCommunity/CommunityActivity.vue"; // 社区活动分析


import CommunityBoard from "../componentsCommunity/CommunityBoard.vue"; // 社区板块管理
import CommunityContent from "../componentsCommunity/CommunityContent.vue"; // 社区内容管理
import CommunityAudit from "../componentsCommunity/CommunityAudit.vue"; // 社区审核管理


const routes = [
  { path: "/", redirect: "/main" }, // 默认重定向到主页面
  {
    path: "/main",
    name: "main",
    component: MainPage, // 主页面
  },
  {
    path: "/login",
    name: "login",
    component: Login, // 登录页面1
  },
  {
    path: "/login2",
    name: "login2",
    component: Login2, // 登录页面2
  },
  {
    path: "/login3",
    name: "login3",
    component: Login3, // 登录页面3
  },
  {
    path: "/register",
    name: "register",
    component: Register, // 注册页面
  },
  {
    path: "/home",
    name: "home",
    component: Home, // 主页面1
    children: [
      { path: "userList", component: UserList },
      { path: "userMonitor", component: UserMonitor },
      { path: "userViolation", component: UserViolation },
      { path: "competitionInfo", component: CompetitionInfo },
      { path: "competitionDetail", component: CompetitionDetail },
      { path: "category", component: Category },
      { path: "courseInfo", component: CourseInfo },
      { path: "courseDetail", component: CourseDetail },
      { path: "questionInfo", component: QuestionInfo },

      { path: "communityBoard", component: CommunityBoard },
      { path: "communityContent", component: CommunityContent },
      { path: "communityAudit", component: CommunityAudit },
    ],
  },
  {
    path: "/home2",
    name: "home2",
    component: Home2, // 主页面2
    children: [
      { path: "userProfile", component: UserProfile },
      { path: "userActivity", component: UserActivity },
      { path: "communityActivity", component: CommunityActivity },
    
      { path: "trafficanalysis", component: Trafficanalysis },
      { path: "performanceMonitor", component: PerformanceMonitor },
      { path: "cashFlowStatement", component: CashFlowStatement },
      
    ],
  },
  {
    path: "/home3",
    name: "home3",
    component: Home3, // 主页面3
    children: [
      { path: "userList", component: UserList },
      { path: "userMonitor", component: UserMonitor },
      { path: "userViolation", component: UserViolation },
      { path: "competitionInfo", component: CompetitionInfo },
      { path: "competitionDetail", component: CompetitionDetail },
      { path: "category", component: Category },
      { path: "courseInfo", component: CourseInfo },
      { path: "courseDetail", component: CourseDetail },
      { path: "questionInfo", component: QuestionInfo },

      { path: "communityBoard", component: CommunityBoard },
      { path: "communityContent", component: CommunityContent },
      { path: "communityAudit", component: CommunityAudit },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
