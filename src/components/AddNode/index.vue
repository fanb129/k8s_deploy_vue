<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <div>
      <p style="color: red;">注意：所填多个主机的密码需要保持一致！<br>
        主机地址：不写端口则默认22端口
      </p>
    </div>
    <el-form ref="form" :model="form" label-width="100px">
<!--      <el-form-item-->
<!--        prop="user"-->
<!--        label="User"-->
<!--        :rules="[-->
<!--          { required: true, message: '请输入User', trigger: 'blur' },-->
<!--        ]"-->
<!--      >-->
<!--        <el-input v-model="form.user" />-->
<!--      </el-form-item>-->
      <el-form-item
        prop="password"
        label="密码"
        :rules="[
          { required: true, message: '请输入root密码', trigger: 'blur' },
        ]"
      >
        <el-input v-model="form.password" />
      </el-form-item>

<!--      <el-form-item-->
<!--        prop="port"-->
<!--        label="端口"-->
<!--        :rules="[-->
<!--          { required: true, message: '请输入端口', trigger: 'blur' },-->
<!--        ]"-->
<!--      >-->
<!--        <el-input v-model="form.port" />-->
<!--      </el-form-item>-->
      <el-form-item
        v-for="(node, index) in form.nodes"
        :key="node.key"
        :label="'主机地址' + (index+1)"
        :prop="'nodes.' + index + '.host'"
        :rules="{
          required: true, message: '主机地址不能为空', trigger: 'blur'
        }"
      >
        <el-input v-model="node.host" placeholder="IP:Port" /><el-button @click.prevent="removenode(node)">删除</el-button>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="addnode">新增主机</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addNode } from '@/api/node'

export default {
  name: 'AddNode',
  data() {
    return {
      // 弹出层标题
      title: '添加主机',
      // 是否显示弹出层
      open: false,
      form: {
        // user: '',
        password: '',
        // port: 22,
        nodes: [{
          host: ''
        }]
      }
    }
  },
  methods: {
    init() {
      this.open = true
      this.$nextTick(() => {
        this.open = true
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    submitForm() {
      console.log('submit!')
      addNode(this.form).then((res) => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.open = false
          // 调用主页面的getNsList方法刷新主页面
          this.$parent.getNodeList()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removenode(item) {
      var index = this.form.nodes.indexOf(item)
      if (index !== -1) {
        this.form.nodes.splice(index, 1)
      }
    },
    addnode() {
      this.form.nodes.push({
        host: '',
        key: Date.now()
      })
    }
  }
}
</script>

<style scoped>
.el-form-item .el-input{
  width: 350px;
}
</style>
