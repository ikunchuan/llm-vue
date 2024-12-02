<template>
    <el-container>
      <el-main>
        <el-form :model="registerForm" status-icon>
          <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
            <el-input v-model="registerForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRegister">注册</el-button>
            <el-button @click="redirectToLogin" type="text">已有账号？去登录</el-button>
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
        registerForm: {
          userName: '',
          password: '',
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
  }
  .el-main {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  </style>
  


