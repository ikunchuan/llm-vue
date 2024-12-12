<template>
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
          <el-form :model="loginForm" status-icon :rules="formRules" ref="loginForm">
            <!-- 用户名 -->
            <el-form-item prop="userName" style="margin-bottom: 20px;">
            
              <div contenteditable="true" :text-content="loginForm.userName" @input="updateUserName" placeholder="请输入用户名"
                class="editable-input" style="padding: 10px 20px; font-size: 16px; width: 100%; outline: none; 
              text-align: left;">
              </div>
  
  
            </el-form-item>
  
            <!-- 密码 -->
            <el-form-item prop="password" style="margin-bottom: 30px;">
                <div contenteditable="true" :text-content="loginForm.password" @input="updatePassword" placeholder="请输入密码"
                class="editable-input" style="padding: 10px 20px; font-size: 16px; width: 100%; outline: none; 
              text-align: left;">
              </div>
            </el-form-item>
  
            <!-- 记住我 -->
            <el-form-item style="text-align: left;">
              <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
            </el-form-item>
  
            <!-- 登录按钮 -->
            <el-form-item>
              <el-button type="primary" @click="handleLogin" :loading="loading"
                style="width: 50%; border-radius: 30px; padding: 12px; background-color: #5A67D8; border-color: #5A67D8; font-size: 16px;">
                登录
              </el-button>
  
              <!-- 注册链接 -->
              <el-button @click="redirectToRegister" type="text"
                style="display: block; text-align: center; margin-top: 10px; color: #5A67D8; font-size: 14px;">
                没有账号？去注册
              </el-button>
            </el-form-item>
          </el-form>
        </div>
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
          loginboard: '',
        },
      };
    },
    methods: {
      // 更新用户名
      updateUserName(event) {
        this.loginForm.userName = event.target.textContent;
      },
  
      // 更新密码
      updatePassword(event) {
        this.loginForm.password = event.target.textContent;
      },
  
      // 登录处理函数
      async handleLogin() {
        try {
          this.loginForm.loginboard=2   //登陆第一板块时
          const response = await axios.post('/api/admin/user/login', this.loginForm);
          if (response.data.code === 200) {
            this.$message.success('登录成功');
            // 登录成功后跳转到首页或用户主页
            this.$router.push('/home2');
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
  .el-form-item {
    display: flex;
    align-items: center;
    justify-content: center;
    /* 中心对齐输入框 */
  }
  
  .editable-input {
    background-color: transparent;
    /* 设置背景透明 */
    border: none;
    /* 移除所有边框 */
    border-bottom: 2px solid #E2E8F0;
    /* 仅保留底部下划线 */
    padding: 10px 20px;
    /* 内边距设置为适应字体大小 */
    font-size: 16px;
    /* 字体大小 */
    outline: none;
    /* 去除选中时的蓝色边框 */
  }
  
  .editable-input:empty:before {
    content: attr(placeholder);
    /* 显示占位符 */
    color: #aaa;
    /* 占位符的颜色 */
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
    /* 与上面的横线一样长 */
    height: 2px;
    /* 横线的高度 */
    background-color: #E2E8F0;
    transform: translateX(-50%);
    /* 使横线居中 */
  }
  </style>
  