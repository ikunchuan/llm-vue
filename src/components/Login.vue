 <template>
    <el-container style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #F4F6F8;">
        <el-main style="width: 100%; max-width: 500px; background: #FFFFFF; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); padding: 40px 30px;">
        
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="../assets/img/Logo.jpg" alt="Logo" class="logo"/>
          
<h2 class="section-title">
  欢迎进入后台管理系统
</h2>
        </div>
        
        <el-form :model="loginForm" status-icon :rules="formRules" ref="loginForm">
    
        <!-- 用户名 -->
            <el-form-item  prop="userName" style="margin-bottom: 20px;display: flex; justify-content: center;align-items: center;">
            <el-input 
                v-model="loginForm.userName" 
                placeholder="请输入用户名" 
                :suffix-icon="usernameIcon" 
                style="
                border-radius: 30px; 
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
                padding: 15px 20px; 
                font-size: 16px;
                max-width: 350px;
                " 
            >
                    <template #suffix>
                        <el-tooltip content="用户名" placement="top">
                           <i class="el-icon-user"></i>
                </el-tooltip>
                    </template>
              </el-input>
            </el-form-item>
  
          <!-- 密码 -->
          <el-form-item  prop="password" style="margin-bottom: 30px;display: flex; justify-content: center;">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码" 
              :suffix-icon="passwordIcon"
              style="border-radius: 30px; 
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
              padding: 15px 20px; 
              font-size: 16px;
              max-width: 350px;" 
            >
              <template #suffix>
                <el-tooltip content="密码" placement="top">
                  <i class="el-icon-lock"></i>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
  
          <!-- 记住我 -->
          <!-- <el-form-item>
            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
          </el-form-item> -->
          <el-form-item style="text-align: left;">
          <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
        </el-form-item>
  
          <!-- 登录按钮 -->
          <el-form-item >
            <el-button 
              type="primary" 
              @click="handleLogin" 
              :loading="loading" 
              style="width: 50%; border-radius: 30px; padding: 12px; background-color: #5A67D8; border-color: #5A67D8; font-size: 16px;">
              登录
            </el-button>
  
            <!-- 注册链接 -->
            <el-button 
              @click="redirectToRegister" 
              type="text" 
              style="display: block; text-align: center; margin-top: 10px; color: #5A67D8; font-size: 14px;">
              没有账号？去注册
            </el-button>
          </el-form-item>
          
        </el-form>
      </el-main>
    </el-container>
  </template>



  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        loginForm: {
          userName: '',
          password: '',
        },
      };
    },
    methods: {
      // 登录处理函数
      async handleLogin() {
        try {
          const response = await axios.post('http://localhost:10086/admin/user/login', this.loginForm);
          if (response.data.code === 200) {
            this.$message.success('登录成功');
            // 登录成功后跳转到首页或用户主页
            this.$router.push('/home');
          } else {
            this.$message.error('登录失败，请检查用户名和密码');
          }
        } catch (error) {
          this.$message.error('登录请求失败');
        }
      },
  
      // 跳转到注册页面
      redirectToRegister() {
        this.$router.push('/Register');
      }
    }
  };
  </script>
  
 


<style scoped>
/* 你可以根据需要调整这些样式 */

.el-form-item {
  display: flex;
  align-items: center; /* 使标签纵向居中 */
}

.el-form-item label {
  font-family: 'Helvetica Neue', Arial, sans-serif; /* 设置美观的字体 */
  font-size: 16px;  /* 设置字体大小 */
  font-weight: 500;  /* 设置字体粗细 */
  color: #333;  /* 设置字体颜色 */
  margin-right: 20px; /* 给标签和输入框之间添加间距 */
  width: auto;  /* 让标签宽度自适应 */
}



.el-input {
  /* background-color: #F4F6F8;
  border: 1px solid #E2E8F0; */
  background-color: #F4F6F8;  /* 设置输入框的背景色 */
  border: none;  /* 移除边框 */
  border-bottom: 2px solid #E2E8F0; /* 添加底部边框 */
  box-shadow: none;  /* 移除阴影 */
  
}

.el-button {
  transition: background-color 0.3s ease;
}

.el-button:hover {
  background-color: #4C51BF;
}

.el-button[type="text"] {
  color: #5A67D8;
  font-size: 14px;
  text-decoration: underline;
}

/* 标题和 logo 样式 */
h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.text-align {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    min-height: 100vh; /* 使容器占满整个视口 */
    background-color: #f4f6f8; /* 背景色 */
  }

  .logo {
    width: 100px; /* 设置图片的宽度 */
    height: auto; /* 高度自动调整，保持原始比例 */
    margin-bottom: 20px; /* 图片和其他内容之间的间距 */
    border-radius: 50%;
  }
  .section-title {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  line-height: 1.5;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 25px; /* 为了给横线留出空间 */
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 80%;  /* 设置横线的长度 */
  height: 2px;  /* 设置横线的高度（粗细） */
  background-color: #E2E8F0;  /* 设置横线的颜色 */
  transform: translateX(-50%);  /* 使横线居中 */
}
</style>