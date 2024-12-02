<!-- <template>
    <el-row :gutter="20">
        <el-col :span="12" :offset="8">
            <el-card style="max-width: 480px">

                <template #header>
                    <div class="card-header">
                        <span>欢迎您使用本系统</span>
                    </div>
                </template>

                <el-form ref="ruleFormRef" style="max-width: 600px" :model="frmUser" :rules="myrules" status-icon
                    label-width="120px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="frmUser.username" type="text" autocomplete="off" />
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-input v-model="frmUser.password" type="password" autocomplete="off" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">
                            登录
                        </el-button>

                        <el-button @click="resetForm()">
                            重置
                        </el-button>
                    </el-form-item>

                </el-form>

            </el-card>
        </el-col>
    </el-row>


</template>



<script>
import { useRouter } from 'vue-router'
export default {
    data() {
        return {
            frmUser: {
                username: '',
                password: '',
            },
            myrules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 6, max: 12, message: '用户名长度为6~12!', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '密码长度为6~12!', trigger: 'blur' }
                ]
            },
            router: useRouter()

        };
    },

    methods: {
        submitForm() {

            console.log(this.frmUser)
            this.$refs["ruleFormRef"].validate((valid) => {
                console.log(valid);
                if (valid) {
                    this.router.push({
                        path: '/home'
                    })
                }
                
            })

            console.log("Login...")

        }
    }

}
</script>



<style>
.card-header {
    display: flex;
    justify-content: center;
}
</style> -->












<!-- <template>
    <el-row :gutter="20">
        <el-col :span="12" :offset="8">
            <el-card style="max-width: 480px">

                <template #header>
                    <div class="card-header">
                        <span>欢迎您使用本系统</span>
                    </div>
                </template>

                <el-form ref="ruleFormRef" style="max-width: 600px" :model="frmUser" :rules="myrules" status-icon
                    label-width="120px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="frmUser.username" type="text" autocomplete="off" />
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-input v-model="frmUser.password" type="password" autocomplete="off" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitLogin()">
                            登录
                        </el-button>

                        <el-button @click="submitRegister()">
                            注册
                        </el-button>

                        <el-button @click="resetForm()">
                            重置
                        </el-button>
                    </el-form-item>

                </el-form>

            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
    data() {
        return {
            frmUser: {
                username: '',
                password: '',
            },
            myrules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 6, max: 12, message: '用户名长度为6~12!', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '密码长度为6~12!', trigger: 'blur' }
                ]
            },
            router: useRouter(),
            apiUrlLogin: 'http://localhost:10086/admin/user/login',  // 后端登录接口地址
            apiUrlRegister: 'http://localhost:10086/admin/user/register',  // 后端注册接口地址
            apiUrlLogout: 'http://localhost:10086/admin/user/logout'  // 后端注销接口地址
        };
    },

    methods: {
        // 登录操作
        submitLogin() {
            this.$refs["ruleFormRef"].validate((valid) => {
                if (valid) {
                    axios.post(this.apiUrlLogin, this.frmUser)
                        .then((response) => {
                            if (response.data.code === '200') {
                                this.$message.success('登录成功');
                                this.router.push({ path: '/home' });
                            } else {
                                this.$message.error('用户名或密码错误');
                            }
                        })
                        .catch((error) => {
                            console.error("登录请求失败", error);
                            this.$message.error('登录请求失败，请稍后再试');
                        });
                }
            });
        },

        // 注册操作
        submitRegister() {
            this.$refs["ruleFormRef"].validate((valid) => {
                if (valid) {
                    axios.post(this.apiUrlRegister, this.frmUser)
                        .then((response) => {
                            if (response.data.code === '200') {
                                this.$message.success('注册成功');
                                this.router.push({ path: '/login' }); // 注册成功后跳转到登录页面
                            } else {
                                this.$message.error('注册失败，用户名已存在');
                            }
                        })
                        .catch((error) => {
                            console.error("注册请求失败", error);
                            this.$message.error('注册请求失败，请稍后再试');
                        });
                }
            });
        },

        // 重置表单
        resetForm() {
            this.$refs["ruleFormRef"].resetFields();
        }
    }
}
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: center;
}
</style> -->







<!-- <template>
    <el-container>
      <el-main>
        <el-form :model="loginForm" status-icon>
          <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
            <el-input v-model="loginForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin">登录</el-button>
            <el-button @click="redirectToRegister" type="text">没有账号？去注册</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </template> -->


  <!-- <template>
    <el-container class="login-container">
      <el-main class="login-box">
        <el-form :model="loginForm" status-icon label-width="100px">
          <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
            <el-input v-model="loginForm.userName" placeholder="请输入用户名" class="input-field"></el-input>
          </el-form-item>
          <el-form-item label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" class="input-field"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
            <el-button @click="redirectToRegister" type="text" class="register-btn">没有账号？去注册</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </template> -->




  <!-- <template>
    <el-container style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #F4F6F8;">
      <el-main style="width: 100%; max-width: 400px; background: #FFFFFF; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); padding: 40px 30px;">
        <el-form :model="loginForm" status-icon>
          <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]" style="margin-bottom: 20px;">
            <el-input 
              v-model="loginForm.userName" 
              placeholder="请输入用户名" 
              style="border-radius: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 10px 20px;" 
            ></el-input>
          </el-form-item>
          
          <el-form-item label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]" style="margin-bottom: 30px;">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码" 
              style="border-radius: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 10px 20px;" 
            ></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleLogin" 
              style="width: 100%; border-radius: 30px; padding: 10px; background-color: #5A67D8; border-color: #5A67D8; font-size: 16px;">
              登录
            </el-button>
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
  </template> -->


  <template>
    <el-container style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #F4F6F8;">
        <el-main style="width: 100%; max-width: 500px; background: #FFFFFF; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); padding: 40px 30px;">
        
        
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="../assets/img/Logo.jpg" alt="Logo" class="logo"/>
            <!-- <h2 style="font-size: 24px; font-weight: bold; color: #333;">欢迎进入后台管理系统</h2> -->
            <!-- <h2 style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 30px; font-weight: 600; color: #2c3e50; text-align: center; line-height: 1.5; letter-spacing: 1px; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px;">
  欢迎进入后台管理系统
</h2> -->
<h2 class="section-title">
  欢迎进入后台管理系统
</h2>
        </div>
        
        <el-form :model="loginForm" status-icon :rules="formRules" ref="loginForm" label-width="100px">
    
        <!-- 用户名 -->
            <el-form-item label="用户名" prop="userName" style="margin-bottom: 20px;">
            <el-input 
                v-model="loginForm.userName" 
                placeholder="请输入用户名" 
                :suffix-icon="usernameIcon" 
                style="border-radius: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 15px 20px; font-size: 16px;" 
            >
                    <template #suffix>
                        <el-tooltip content="用户名" placement="top">
                           <i class="el-icon-user"></i>
                </el-tooltip>
                    </template>
              </el-input>
            </el-form-item>
  
          <!-- 密码 -->
          <el-form-item label="密码" prop="password" style="margin-bottom: 30px;">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码" 
              :suffix-icon="passwordIcon"
              style="border-radius: 30px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 15px 20px; font-size: 16px;" 
            >
              <template #suffix>
                <el-tooltip content="密码" placement="top">
                  <i class="el-icon-lock"></i>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
  
          <!-- 记住我 -->
          <el-form-item>
            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
          </el-form-item>
  
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleLogin" 
              :loading="loading" 
              style="width: 100%; border-radius: 30px; padding: 12px; background-color: #5A67D8; border-color: #5A67D8; font-size: 16px;">
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
  
  <!-- <style scoped>
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
   -->
  
   <!-- <style scoped>
/* 背景和容器布局 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #f5f7fa, #e1e6ed);
  height: 100vh;
}

/* 登录框样式 */
.login-box {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 输入框样式 */
.input-field {
  border-radius: 8px;
}

/* 登录按钮样式 */
.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 20px;
  background-color: #409EFF; /* 蓝色背景 */
}

/* 注册按钮样式 */
.register-btn {
  margin-top: 10px;
  font-size: 14px;
  color: #409EFF;
}

/* 表单标签样式 */
.el-form-item__label {
  font-weight: bold;
  color: #333;
}

.el-form-item {
  margin-bottom: 20px;
}

/* 页面响应式调整 */
@media (max-width: 768px) {
  .login-box {
    width: 90%;
    padding: 20px;
  }
}
</style> -->



<style scoped>
/* 你可以根据需要调整这些样式 */
.el-form-item label {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.el-input {
  background-color: #F4F6F8;
  border: 1px solid #E2E8F0;
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