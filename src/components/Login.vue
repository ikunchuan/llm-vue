<template>
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
</style>
