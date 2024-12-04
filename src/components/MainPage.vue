<template>
    <div class="main-container">
      <el-row justify="center" class="content-row">
        <el-col :span="8" class="panel" @click="goToLogin('login')">
          <div class="panel-title">业务数据处理</div>
        </el-col>
        <el-col :span="8" class="panel" @click="goToLogin('login2')">
          <div class="panel-title">统计分析</div>
        </el-col>
        <el-col :span="8" class="panel" @click="goToLogin('login3')">
          <div class="panel-title">系统设置与维护</div>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToLogin(loginType) {
        this.$router.push({ name: loginType });
      }
    }
  };
  </script>
  
  <style scoped>
  .main-container {
    padding: 50px;
    background: #f4f6f8;
    min-height: 100vh;
  }
  .content-row {
    margin-top: 100px;
  }
  .panel {
    text-align: center;
    cursor: pointer;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  .panel:hover {
    transform: translateY(-5px);
  }
  .panel-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  </style>