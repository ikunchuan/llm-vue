<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>添加竞赛信息</span>
                
            </div>
            
        </template>
        <!-- 添加表单 -->
        <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="竞赛名称">
            <el-input v-model="form.competitionName" />
            </el-form-item>
            <el-form-item label="竞赛等级">
            <el-select v-model="form.levelName" placeholder="选择等级">
                <el-option label="国家级A类" value="国家级A类" />
                <el-option label="国家级B类" value="国家级B类" />
            </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
            <el-col :span="11">
                <el-date-picker
                v-model="form.startDate"
                type="date"
                placeholder="选择开始日期"
                style="width: 100%"
                />
            </el-col>
            </el-form-item>

            <el-form-item label="结束时间">
            <el-col :span="11">
                <el-date-picker
                v-model="form.endDate"
                type="date"
                placeholder="选择结束日期"
                style="width: 100%"
                />
            </el-col>
            </el-form-item>
            
            <el-form-item label="竞赛类别">
            <el-checkbox-group v-model="form.categoryId">
                <el-checkbox value="管理类" name="type">
                管理类
                </el-checkbox>
                <el-checkbox value="数学类" name="type">
                数学类
                </el-checkbox>
                <el-checkbox value="英语类" name="type">
                英语类
                </el-checkbox>
                <el-checkbox value="计算机类" name="type">
                计算机类
                </el-checkbox>
            </el-checkbox-group>
            </el-form-item>
            <el-form-item label="竞赛详情">
                <div style="border: 1px solid #ccc;">
                    <Toolbar
                        style="border-bottom: 1px solid #ccc"
                        :editor="editorRef"
                        :defaultConfig="toolbarConfig"
                        :mode="mode"
                    />
                    <Editor
                        style="height: 500px; overflow-y: hidden;"
                        v-model="valueHtml"
                        :defaultConfig="editorConfig"
                        :mode="mode"
                        @onCreated="handleCreated"
                    />
                </div>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="onSubmit">添加竞赛</el-button>
            <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
data(){
    return{
        form:{},
        editorRef: shallowRef(),
        valueHtml: '<p>hello</p>',
        toolbarConfig: {},
        editorConfig: { placeholder: '请输入内容...' },
        mode: 'default', // 或 'simple'

    };
},

methods: {
    onSubmit(){
        this.form.content=this.valueHtml
        this.form.author="shen"
        console.log(this.form);
        this.$http.post("http://localhost:8080/comp/v1/compe",this.form).then((res)=>{
            console.log(res.data);
        }).catch()
    },
    handleCreated(editor){
        this.editorRef = editor // 记录 editor 实例，重要！
    }
},
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(){
    const editor = this.editorRef
        if (editor == null) return
        editor.destroy()
},

// mounted: {},

// computed() {},

 components: {Editor, Toolbar},
}
</script>

<style></style>