<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
<!--      <el-form-item label="用户">-->
<!--        <el-select v-model="form.u_id" filterable multiple placeholder="请选择分配用户" @change="change">-->
<!--          <el-option-->
<!--            v-for="item in options"-->
<!--            :key="item.id"-->
<!--            :label="item.username + '\t' + item.nickname"-->
<!--            :value="item.id"-->
<!--            :disabled="role < item.role"-->
<!--          />-->
<!--          <el-pagination-->
<!--            background-->
<!--            layout="prev, pager, next"-->
<!--            :current-page="userPage"-->
<!--            :page-size="1"-->
<!--            :total="userTotal"-->
<!--            @current-change="changeUserPageNum"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="HdfsMaster">
        <el-input-number v-model="form.hdfs_master_replicas" :min="1" :max="3" @change="change" />
      </el-form-item>
      <el-form-item label="Datanode">
        <el-input-number v-model="form.datanode_replicas" :min="2" :max="10" @change="change" />
      </el-form-item>
      <el-form-item label="YarnMaster">
        <el-input-number v-model="form.yarn_master_replicas" :min="1" :max="3" @change="change" />
      </el-form-item>
      <el-form-item label="YarnNode">
        <el-input-number v-model="form.yarn_node_replicas" :min="2" :max="10" @change="change" />
      </el-form-item>
<!--      <el-form-item label="过期时间" prop="expired_time">-->
<!--        <el-date-picker-->
<!--          v-model="form.expired_time"-->
<!--          type="datetime"-->
<!--          placeholder="选择日期时间"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="CPU" prop="cpu">
        <el-input v-model="form.cpu" />
      </el-form-item>
      <el-form-item label="内存" prop="memory">
        <el-input v-model="form.memory" />
      </el-form-item>
      <el-form-item label="存储" prop="memory">
        <el-input v-model="form.memory" />
      </el-form-item>
      <el-form-item label="持久存储" prop="memory">
        <el-input v-model="form.memory" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getUserList } from '@/api/user'
import { addHadoop } from '@/api/app/hadoop'

export default {
  name: 'AddHadoop',
  data() {
    return {
      // 弹出层标题
      title: 'Add Hadoop',
      // 是否显示弹出层
      open: false,
      userPage: 1,
      userTotal: 0,
      options: [{
        id: '',
        username: '',
        nickname: '',
        role: ''
      }],
      form: {
        hdfs_master_replicas: '',
        datanode_replicas: '',
        yarn_master_replicas: '',
        yarn_node_replicas: '',
        u_id: [],
        expired_time: null,
        cpu: '',
        memory: ''
      },
      formRules: {
        u_id: [{ required: true, trigger: 'blur' }],
        cpu: [{ required: true, trigger: 'blur' }],
        memory: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    init() {
      this.open = true
      this.$nextTick(() => {
        this.getUserList()
        this.open = true
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    onSubmit() {
      console.log('submit!')
      this.$refs.form.validate(valid => {
        if (valid) {
          addHadoop(
            {
              u_id: this.form.u_id,
              hdfs_master_replicas: parseInt(this.form.hdfs_master_replicas),
              datanode_replicas: parseInt(this.form.datanode_replicas),
              yarn_master_replicas: parseInt(this.form.yarn_master_replicas),
              yarn_node_replicas: parseInt(this.form.yarn_node_replicas),
              expired_time: this.form.expired_time,
              cpu: this.form.cpu,
              memory: this.form.memory
            }).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.open = false
              // 调用主页面的getHadoopList方法刷新主页面
              this.$parent.getHadoopList()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    changeUserPageNum: function(val) {
      this.userPage = val
      this.getUserList()
    },
    getUserList: function() {
      getUserList(this.userPage).then((res) => {
        this.userPage = res.page
        this.userTotal = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.options = res.user_list
        this.options.push({ nickname: '', id: '0', username: 'Null', role: 0 })
        // console.log(res)
      })
    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>

</style>
