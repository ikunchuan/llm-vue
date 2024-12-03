// import { createRouter, createWebHashHistory } from 'vue-router';
// import Home from '../components/Home.vue';
// import Login from '../components/Login.vue';

// import UserList from '../components/UserList.vue'; // 用户基本信息管理
// import UserMonitor from '../components/UserMonitor.vue'; // 用户行为监控管理
// import UserViolation from '../components/UserViolation.vue'; // 违规用户处理
// import CompetitionInfo from '../components/CompetitionInfo.vue'; // 竞赛信息管理
// import Category1 from '../components/Category1.vue'; // 类别一级分类管理
// import Category2 from '../components/Category2.vue'; // 类别二级分类管理
// import CourseInfo from '../components/CourseInfo.vue'; // 课程信息管理
// import CourseDetail from '../components/CourseDetail.vue'; // 课程详细内容管理
// import QuestionInfo from '../components/QuestionInfo.vue'; // 题目信息管理
// import QuestionDifficulty from '../components/QuestionDifficulty.vue'; // 题目难度管理
// import CommunityUser from '../components/CommunityUser.vue'; // 社区用户管理
// import CommunityBoard from '../components/CommunityBoard.vue'; // 社区板块管理
// import CommunityContent from '../components/CommunityContent.vue'; // 社区内容管理
// import CommunityAudit from '../components/CommunityAudit.vue'; // 社区审核管理

// const routes = [
//     { path: '/', component: Login },
  
//     { 
//         path: '/home', 
//         component: Home, 
//         children: [
//             { path: 'userList', component: UserList },
//             { path: 'userMonitor', component: UserMonitor },
//             { path: 'userViolation', component: UserViolation },
//             { path: 'competitionInfo', component: CompetitionInfo },
//             { path: 'category1', component: Category1 },
//             { path: 'category2', component: Category2 },
//             { path: 'courseInfo', component: CourseInfo },
//             { path: 'courseDetail', component: CourseDetail },
//             { path: 'questionInfo', component: QuestionInfo },
//             { path: 'questionDifficulty', component: QuestionDifficulty },
//             { path: 'communityUser', component: CommunityUser },
//             { path: 'communityBoard', component: CommunityBoard },
//             { path: 'communityContent', component: CommunityContent },
//             { path: 'communityAudit', component: CommunityAudit },
//         ] 
//     },
// ];

// const router = createRouter({
//     history: createWebHashHistory(),
//     routes,
// });

// export default router;





import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue'; // 添加注册页面
import UserList from '../components/UserList.vue'; // 用户基本信息管理
import UserMonitor from '../components/UserMonitor.vue'; // 用户行为监控管理
import UserViolation from '../components/UserViolation.vue'; // 违规用户处理
import CompetitionInfo from '../components/CompetitionInfo.vue'; // 竞赛信息管理
import Category1 from '../components/Category1.vue'; // 类别一级分类管理
import Category2 from '../components/Category2.vue'; // 类别二级分类管理
import CourseInfo from '../components/CourseInfo.vue'; // 课程信息管理
import CourseDetail from '../components/CourseDetail.vue'; // 课程详细内容管理
import QuestionInfo from '../components/QuestionInfo.vue'; // 题目信息管理
import QuestionDifficulty from '../components/QuestionDifficulty.vue'; // 题目难度管理
import CommunityUser from '../components/CommunityUser.vue'; // 社区用户管理
import CommunityBoard from '../components/CommunityBoard.vue'; // 社区板块管理
import CommunityContent from '../components/CommunityContent.vue'; // 社区内容管理
import CommunityAudit from '../components/CommunityAudit.vue'; // 社区审核管理

const routes = [
    { path: '/', component: Login }, // 默认路径为登录页
    { 
        path: '/login', 
        component: Login 
    },
    { 
        path: '/register', 
        component: Register // 注册页面
    },
    { 
        path: '/home', 
        component: Home, 
        children: [
            { path: 'userList', component: UserList },
            { path: 'userMonitor', component: UserMonitor },
            { path: 'userViolation', component: UserViolation },
            { path: 'competitionInfo', component: CompetitionInfo },
            { path: 'category1', component: Category1 },
            { path: 'category2', component: Category2 },
            { path: 'courseInfo', component: CourseInfo },
            { path: 'courseDetail', component: CourseDetail },
            { path: 'questionInfo', component: QuestionInfo },
            { path: 'questionDifficulty', component: QuestionDifficulty },
            { path: 'communityUser', component: CommunityUser },
            { path: 'communityBoard', component: CommunityBoard },
            { path: 'communityContent', component: CommunityContent },
            { path: 'communityAudit', component: CommunityAudit },
        ] 
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;