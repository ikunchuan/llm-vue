
<template>
  <el-container>
    <el-main class="form-container">
      <div class="text-center">
        <img src="../assets/img/Logo.jpg" alt="Logo" class="logo" />
        <h2 class="section-title">欢迎注册新账号</h2>
      </div>
      <el-form :model="registerForm" status-icon>
       
        <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
          <el-input v-model="registerForm.userName" placeholder="请输入用户名" class="input-field" />
        </el-form-item>
        
        <el-form-item label="密   码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" class="input-field" />
        </el-form-item>
       
        <el-form-item>
          <el-button type="primary" @click="handleRegister" class="btn-register">注册</el-button>

          <el-button 
              @click="redirectToLogin" 
              type="text" 
              style="display: block; text-align: center; margin-top: 10px; color: #5A67D8; font-size: 14px;">
              已有账号？去登录
            </el-button>
          

          
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>


<!-- <template>
  <el-container
    style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #F4F6F8;">
    <el-main
      style="width: 100%; max-width: 500px; background: #FFFFFF; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="../assets/img/Logo.jpg" alt="Logo" class="logo" />
        <h2 class="section-title">
          欢迎进入后台管理系统
        </h2>
      </div>
      <div style="width: 80%; margin: 0 auto; text-align: center;">
        <el-form :model="registerForm" status-icon :rules="formRules" ref="registerForm">



          <el-form-item prop="userName" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }] ">
            <div contenteditable="true" :text-content="registerForm.userName" @input="updateUserName" placeholder="请输入用户名"
              class="editable-input" style="padding: 10px 20px; font-size: 16px; width: 100%; outline: none; 
            text-align: left;">
            </div>
          </el-form-item>
        
  

         
          <el-form-item prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <div contenteditable="true" :text-content="registerForm.password" @input="updatePassword" placeholder="请输入密码"
              class="editable-input" style="padding: 10px 20px; font-size: 16px; width: 100%; outline: none; 
            text-align: left;">
            </div>
          </el-form-item>

         
          <el-form-item style="text-align: left;">
            <el-checkbox v-model="registerForm.rememberMe">记住我</el-checkbox>
          </el-form-item>

        
          <el-form-item>
            <el-button type="primary" @click="handleRegister" :loading="loading"
              style="width: 50%; border-radius: 30px; padding: 12px; background-color: #5A67D8; border-color: #5A67D8; font-size: 16px;">
              注册
            </el-button>

            
            <el-button @click="redirectToLogin" type="text"
              style="display: block; text-align: center; margin-top: 10px; color: #5A67D8; font-size: 14px;">
              已有账号？去登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template> -->



















<script>
import axios from 'axios';

export default {
  data() {
    return {
      registerForm: {
        userName: '',
        password: '',
        againpassword:'',
      },
    };
  },
  methods: {
    // 注册处理函数
    async handleRegister() {
      try {
        const response = await axios.post('http://localhost:10086/admin/user/register', this.registerForm);
        if (response.data.code === 200) {
          this.$message.success('注册成功');
          // 注册成功后跳转到登录页面
          this.$router.push('/login');
        } else {
          this.$message.error('注册失败');
        }
      } catch (error) {
        this.$message.error('注册请求失败');
      }
    },

    // 跳转到登录页面
    redirectToLogin() {
      this.$router.push('/Login');
    }
  }
};
</script>

<style scoped>
.el-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f6f8; /* 背景色 */
}

.el-main {
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 100px;
  height: auto;
  margin-bottom: 20px;
  border-radius: 50%;
}

.section-title {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  line-height: 1.5;
  letter-spacing: 1px;
  padding-bottom: 25px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 80%;
  height: 2px;
  background-color: #e2e8f0;
  transform: translateX(-50%);
}

/* 每个 form-item */
.el-form-item {
  display: flex;
  align-items: center; /* 让标签和输入框垂直居中 */
  margin-bottom: 20px;
}

/* 标签样式 */
.el-form-item label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-right: 20px; /* 给标签和输入框之间添加间距 */
  width: 80px; /* 固定标签的宽度 */
}

/* 输入框的样式 */
.input-field {
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  font-size: 16px;
  width: 100%; /* 输入框宽度适应父容器 */
}

/* 按钮的样式 */
.el-button {
  transition: background-color 0.3s ease;
}

/* .el-button:hover {
  background-color: #4c51bf;
} */

.btn-register {
  width: 50%;
  border-radius: 30px;
  padding: 12px;
  background-color: #5a67d8;
  border-color: #5a67d8;
  font-size: 16px;
}


</style>
<!-- 
<style scoped>
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.editable-input {
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #E2E8F0;
  padding: 10px 20px;
  font-size: 16px;
  outline: none;
}

.editable-input:empty:before {
  content: attr(placeholder);
  color: #aaa;
}

.el-button {
  transition: background-color 0.3s ease;
}

/* .el-button:hover {
  background-color: #4C51BF;
} */

.el-button[type="text"] {
  color: #5A67D8;
  font-size: 14px;
  text-decoration: underline;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.text-align {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f8;
}

.logo {
  width: 100px;
  height: auto;
  margin-bottom: 20px;
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
  padding-bottom: 25px;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 80%;
  height: 2px;
  background-color: #E2E8F0;
  transform: translateX(-50%);
}
</style> -->
