<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <!--                <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif">-->
                <img :src="avatar+'?imageView2/1/w/80/h/80'" title="点击上传头像" class="avatar">
                <!--                <myUpload-->
                <!--                  v-model="show"-->
                <!--                  :headers="headers"-->
                <!--                  :url="updateAvatarApi"-->
                <!--                  @crop-upload-success="cropUploadSuccess"-->
                <!--                />-->
              </div>
            </div>
            <ul class="user-info">
              <li><div style="height: 100%"><svg-icon icon-class="login" /> 登录账号<div class="user-right">{{ form.username }}</div></div></li>
              <li> <div class="el-icon-message" /> 邮箱
                <div v-if="form.email != ''" class="user-right">{{ form.email }}<a @click="$refs.email.dialog = true">换绑</a></div>
                <div v-else class="user-right"><a @click="$refs.email.dialog = true">绑定邮箱</a></div>
              </li>
              <li><svg-icon icon-class="user1" /> 用户昵称 <div class="user-right">{{ form.nickname }}</div></li>
              <li  v-if="role === 1"><div class="el-icon-user" /> 所属组 <div class="user-right">{{ form.group }}</div></li>
              <li><svg-icon icon-class="dept" /> 权限 <div class="user-right">
                <el-tag v-if="role === 1" size="mini">普通用户</el-tag>
                <el-tag v-else-if="role === 2" size="mini" type="success">管理员</el-tag>
                <el-tag v-else-if="role === 3" size="mini" type="danger">超级管理员</el-tag>
              </div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                </div>
              </li>
<!--               是否过期-->
<!--              <li><svg-icon icon-class="dept" /> 状态 <div class="user-right">-->
<!--                <el-tag v-if="role === 1" size="mini">普通用户</el-tag>-->
<!--                <el-tag v-else-if="role === 2" size="mini" type="success">管理员</el-tag>-->
<!--              </div></li>-->
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    资源面板    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="控制台" name="second">
              <!--              <el-table v-loading="loading" :data="dashboardData" style="width: 100%;">-->
              <!--              </el-table>-->
              <div class="record">
                <el-card
                  v-for="item,index in dashboardData"
                  :key="item.name"
                  shadow="hover"
                  :body-style="{ display: 'flex', padding: 0}"
                >
                  <i
                    class="icon"
                    :class="item.icon"
                    :style="{ background: item.color }"
                  />
                  <div class="detail" >
                    <p class="text">{{ item.name }}</p>
                    <p class="num">{{ item.value }}</p>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="用户资料" name="first">
              <el-form ref="form" :model="form" :rules="editRules" style="margin-top: 10px;" size="small" label-width="65px">
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="form.nickname" style="width: 35%" />
                  <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                </el-form-item>
<!--                <el-form-item label="邮箱" prop="nickname">-->
<!--                  <el-input v-model="form.email" style="width: 35%" />-->
<!--                  <span style="color: #C0C0C0;margin-left: 10px;">暂不支持更改登录邮箱</span>-->
<!--                </el-form-item>-->
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <EditPwd ref="pass" :u_id="this.form.id" :username="this.form.username" />
    <SetEmail ref="email" :u_id="this.form.id" />
  </div>
</template>

<script>
import EditPwd from '@/components/EditPwd'
import SetEmail from '@/components/SetEmail'
import { updateUser, getInfo } from '@/api/user'
// import { getNodeList } from '@/api/node'
// import { getNsList } from '@/api/namespace'
// import { getDeployList } from '@/api/app/deploy'
// import { getStatefulSetList } from '@/api/app/statefulSet'
// import { getJobList } from '@/api/app/job'
// import { getPodList } from '@/api/pod'
// import { getSparkList } from '@/api/app/spark'
// import { getHadoopList } from '@/api/app/hadoop'
// import { getLinuxList } from '@/api/app/linux'
import { Message } from 'element-ui'
import {mapGetters} from "vuex";

export default {
  name: 'Dashboard',
  components: { EditPwd, SetEmail },
  computed: {
    ...mapGetters([
      'avatar',
      'role'
    ])
  },
  data() {
    const validateNickname = (rule, value, callback) => {
      if (value.length < 1 || value.length > 16) {
        callback(new Error('昵称长度必须在1~16字符之间'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      saveLoading: false,
      dashboardData: [
        { name: 'CPU', value: '', icon: 'el-icon-success', color: '#2ec7c9' },
        { name: 'GPU', value: '', icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '内存', value: '', icon: 'el-icon-success', color: '#2ec7c9' },

        { name: '临时存储', value: '', icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '持久存储', value: '', icon: 'el-icon-success', color: '#2ec7c9' },
        { name: '过期时间', value: '', icon: 'el-icon-success', color: '#2ec7c9' },
      ],
      editRules: {
        nickname: [{ required: true, trigger: 'blur', validator: validateNickname }]
      },
      activeName: 'second',
      form: {}
    }
  },
  created() {
    this.form = { nickname: this.name, email: this.email }
    getInfo().then((res) => {
      this.form = res.user_info
      this.dashboardData[0].value = res.user_info.cpu;
      this.dashboardData[1].value = res.user_info.gpu;
      this.dashboardData[2].value = res.user_info.memory;

      this.dashboardData[3].value = res.user_info.storage;
      this.dashboardData[4].value = res.user_info.pvcstorage;
      this.dashboardData[5].value = res.user_info.expired_time;
    })},
  methods: {
    // push2(index) {
    //   switch (index) {
    //     case 0:
    //       this.$router.push({ name: 'User' })
    //       break
    //     case 1:
    //       this.$router.push({ name: 'Node' })
    //       break
    //     case 2:
    //       this.$router.push({ name: 'Namespace' })
    //       break
    //     case 3:
    //       this.$router.push({ name: 'Dashboard' })
    //       break
    //     case 4:
    //       this.$router.push({ name: 'Dashboard' })
    //       break
    //     case 5:
    //       this.$router.push({ name: 'Dashboard' })
    //       break
    //     case 6:
    //       this.$router.push({ name: 'Spark' })
    //       break
    //     case 7:
    //       this.$router.push({ name: 'Hadoop' })
    //       break
    //     case 8:
    //       this.$router.push({ name: 'Linux' })
    //       break
    //   }
    // },
    handleClick(tab, event) {
      if (tab.name === 'first') {
        // this.init()
      }
    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            updateUser(this.form.id, {nickname: this.form.nickname}).then(() => {
              Message({
                message: '修改成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.$store.dispatch('user/getInfo').then(() => {})
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.dashboard {
  &-container {
    margin: 30px;
  }
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li{
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;
    a{
      color: #317EF3;
    }
  }
}
.record{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-card{
    width: 33%;
    margin-bottom: 10px;
  }
  .icon{
    display: block;
    font-size: 35px;
    width: 100px;
    height: 110px;
    text-align: center;
    line-height: 110px;
    color: #fff;
  }
  .detail{
    // margin-left: 5px;
    display: block;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    // text-align: center;
    .num{
      width: 100%;
      display: block;
      font-size: 20px;
      margin-bottom: 10px;
      text-align: center;
    }
    .text{
      display: block;
      width: 100%;
      // font-size: 10px;
      text-align: center;
      color: #999999;
    }
  }
}
</style>
