<template>
  <div>
    <el-tabs v-model="activeName" style="margin-left: 1vh; margin-right: 1vh" @tab-click="handleClick">
      <!--      <el-tab-pane name="first" label="资源面板">
        <div>
          <node-column />
        </div>
      </el-tab-pane>-->
      <div>
        <div style="margin-left: 10%; margin-top: 1%; flex: auto">
          <el-button :disabled="role < 3" style="margin-left: 50%" type="primary" icon="el-icon-edit" @click="addNode">添加主机
          </el-button>
        </div>
        <el-table :data="tableData.slice((page - 1) * pagesize, page * pagesize)" style="width: 100%">

          <el-table-column label="ID" width="60" type="index" />
          <el-table-column label="主机名" width="100"><template slot-scope="scope"><span>{{ scope.row.name }}</span></template></el-table-column>
          <el-table-column label="ip地址" width="130"><template slot-scope="scope"><span>{{ scope.row.ip }}</span></template></el-table-column>
          <el-table-column label="角色" width="100"><template slot-scope="scope"><span>{{ scope.row.role }}</span></template></el-table-column>
          <el-table-column label="就绪" width="100"><template slot-scope="scope"><span>{{ scope.row.ready }}</span></template></el-table-column>
          <el-table-column label="创建时间" width="150"><template slot-scope="scope"><span>{{ scope.row.created_at }}</span></template></el-table-column>
          <el-table-column label="CPU" width="80"><template slot-scope="scope"><span>{{ scope.row.used_cpu }}/{{ scope.row.cpu }}</span></template></el-table-column>
          <el-table-column label="内存" width="100"><template slot-scope="scope"><span>{{ scope.row.used_memory }}/{{ scope.row.memory }}</span></template></el-table-column>
          <el-table-column label="GPU" width="100"><template slot-scope="scope"><span>{{ scope.row.used_gpu }}/{{ scope.row.gpu }}</span></template></el-table-column>
          <el-table-column label="临时存储" width="100"><template slot-scope="scope"><span>{{ scope.row.used_storage }}/{{ scope.row.storage }}</span></template></el-table-column>
          <el-table-column label="持久存储" width="100"><template slot-scope="scope"><span>{{ scope.row.used_pvc }}/{{ scope.row.pvc }}</span></template></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button :disabled="role <= 2 " size="mini" type="success" style="margin-left: 10px" @click="pushTerminal(scope.row)"> 终端</el-button>
              <el-button :disabled="role <= 2 || scope.row.role === 'master'" size="mini" type="danger" style="margin-top: 2px" @click="deleteNode(scope.row.ip)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <div>
          <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="pagesize" :total="total" @current-change="changePageNum" />
        </div>
        <AddNode ref="AddNode" :visible.sync="openDialog" />
      </div>
    </el-tabs>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { deleteNode, getNodeList } from '@/api/node'
import AddNode from '@/components/AddNode'
/* import nodeColumn from '@/components/Echarts/node_circle'*/

export default {
  components: { AddNode },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    this.getNodeList()
  },
  data() {
    return {
      activeName: 'first',
      openDialog: false,
      value: '',
      page: 1,
      total: 0,
      pagesize: 10,
      tableData: [
        {
          name: '',
          role: '',
          ip: '',
          ready: '',
          create_at: '',
          os_image: '',
          kubelet_version: '',
          cpu: '',
          used_cpu: '',
          memory: '',
          used_memory: '',
          storage: '',
          used_storage: '',
          pvc: '',
          used_pvc: '',
          gpu: '',
          used_gpu: ''
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    this.getNodeList()
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'second') {
        // this.init()
      }
    },
    addNode: function() {
      this.openDialog = true
      this.$nextTick(() => {
        this.$refs.AddNode.init()
      })
    },
    deleteNode: function(node) {
      /* 提示消息*/
      this.$confirm('确认删除此node及其所含包含资源', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNode(node).then((res) => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            // location.reload()
            this.loading = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.loading = false
              this.getNodeList()
              // location.reload()
            }, 1000)
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changePageNum: function(val) {
      this.page = val
      // this.getUserList()
    },
    getNodeList: function() {
      getNodeList().then((res) => {
        this.total = res.length
        this.tableData = res.node_list
        // Terminal.log(res)
      })
    },
    pushTerminal: function(row) {
      let page = this.$router.resolve({
        name: 'Terminal',
        query: {
          ip: row['ip'],
          port: '22'
        },
      })
      window.open(page.href, '_blank');

      // this.$router.push({
      //   name: 'Terminal',
      //   query: {
      //     // r: 'node/ssh',
      //     // user: 'root',
      //     // pwd: '1234567890',
      //     ip: row['ip'],
      //     port: '22'
      //   },
      //   params: {
      //     user: 'root',
      //     pwd: '1234567890'
      //     // ip: row['ip'],
      //     // port: '22'
      //   }
      // })
    }
  }
}
</script>
