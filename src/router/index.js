import {createRouter,createWebHashHistory} from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'

const routes = [
     
    {path : '/',component:Login},
    {path : '/home',component:Home,children:[

    ]},

   
]

//创建路由实例并传递'routes'配置
//可以在这里输入更多的配置,暂时保持简单
const router = createRouter({
    //内部提供history模式的实现,为了简单起见,我们在这里使用hash模式
    history:createWebHashHistory(),
    routes,  //"routes:routes"的缩写
})

export default router