<template>
  <div class="monitor">
    <div class="dashboard">
      <el-table :data="cur_res" stripe style="width: 100%">
        <el-table-column label="CPU使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.cpu" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
        <el-table-column label="GPU使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.gpu" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
        <el-table-column label="内存使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.memory" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
        <el-table-column label="持久存储使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.pvc" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
        <el-table-column label="临时存储使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.storage" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="cur_res_ns" stripe style="width: 100%">
        <el-table-column label="各工作空间CPU占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.cpu_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
        <el-table-column label="各工作空间GPU占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.gpu_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
        <el-table-column label="各工作空间内存占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.memory_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
        <el-table-column label="各工作空间持久存储占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.pvc_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
        <el-table-column label="各工作空间临时存储占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.storage_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNsList, totalNs} from '@/api/namespace'

export default {
  name: 'Monitor',
  computed: {
    ...mapGetters([
      'u_id'
    ])
  },
  created() {
    this.uid = this.u_id
    this.init()
  },
  data() {
    return {
      uid: this.u_id,
      // 饼图
      ns_length: '',
      ns_list: [],
      cpu_ratio: 0,
      gpu_ratio: 0,
      memory_ratio: 0,
      pvc_ratio: 0,
      storage_ratio: 0,
      cpu_ns_list: [
        {
          name: '',
          value: '',
          valueStr: ''
        }
      ],
      gpu_ns_list: [
        {
          name: '',
          valueStr: '',
          value: ''
        }
      ],
      memory_ns_list: [
        {
          name: '',
          valueStr: '',
          value: ''
        }
      ],
      pvc_ns_list: [
        {
          name: '',
          valueStr: '',
          value: ''
        }
      ],
      storage_ns_list: [
        {
          name: '',
          valueStr: '',
          value: ''
        }
      ],
      cur_res: [
        {
          cpu: 'CPU',
          gpu: 'GPU',
          memory: 'Memory',
          pvc: 'Pvc', // 持久存储
          storage: 'Storage' // 临时存储
        }
      ],
      cur_res_ns: [
        {
          cpu_ns: 'CPU_NS',
          gpu_ns: 'GPU_NS',
          memory_ns: 'Memory_NS',
          pvc_ns: 'Pvc_NS', // 持久存储
          storage_ns: 'Storage_NS' // 临时存储
        }
      ]
    }
  },
  methods: {
    init() {
      setTimeout(_ => {
        this.cur_res.forEach(_ => {
          // 获取仪表盘数据及加载图表
          this.totalNs(this.uid)
        })
        this.cur_res_ns.forEach(_ => {
          // 获取饼图数据及加载图表
          this.allkindNs(this.uid)
        })
      }, 500)
    },
    // 饼图数据
    allkindNs: function(uid) {
      getNsList(0,uid).then((res) => {
        this.ns_length = res.length
        this.ns_list = res.ns_list

        for (let i = 0; i < this.ns_length; i++) {
          this.cpu_ns_list.push({ name: this.ns_list[i].name, valueStr: this.ns_list[i].used_cpu, value: this.ns_list[i].used_cpu_value })
          this.gpu_ns_list.push({ name: this.ns_list[i].name, valueStr: this.ns_list[i].used_gpu, value: this.ns_list[i].used_gpu_value })
          this.memory_ns_list.push({ name: this.ns_list[i].name, valueStr: this.ns_list[i].used_memory, value: this.ns_list[i].used_memory_value })
          this.pvc_ns_list.push({ name: this.ns_list[i].name, valueStr: this.ns_list[i].used_pvc, value: this.ns_list[i].used_pvc_value })
          this.storage_ns_list.push({ name: this.ns_list[i].name, valueStr: this.ns_list[i].used_storage, value: this.ns_list[i].used_storage_value })
        }
        // 加载Echarts图表
        this.draw_cpu_ns()
        this.draw_gpu_ns()
        this.draw_memory_ns()
        this.draw_pvc_ns()
        this.draw_storage_ns()
      })
    },
    // 仪表盘数据
    totalNs: function(uid) {
      totalNs(uid).then((res) => {
        this.cpu_ratio = res.cpu_ratio
        // console.log(this.cpu_ratio)
        this.gpu_ratio = res.gpu_ratio
        this.memory_ratio = res.memory_ratio
        this.pvc_ratio = res.pvc_ratio
        this.storage_ratio = res.storage_ratio
        // 加载Echarts图表
        this.draw_cpu()
        this.draw_gpu()
        this.draw_memory()
        this.draw_pvc()
        this.draw_storage()
      })
    },
    // Echarts图表初始化
    draw_cpu() {
      // 初始化Echarts实例
      const CPU = this.$echarts.init(document.getElementById('CPU'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: (this.cpu_ratio * 100).toFixed(2)
              }
            ]
          }
        ]
      }
      setInterval(() => {
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = CPU.resize
      CPU.setOption(option)// 设置option
    },
    draw_gpu() {
      // 初始化Echarts实例
      const GPU = this.$echarts.init(document.getElementById('GPU'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: (this.gpu_ratio * 100).toFixed(2)
              }
            ]
          }
        ]
      }
      setInterval(function() {
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = GPU.resize
      GPU.setOption(option)// 设置option
    },
    draw_memory() {
      // 初始化Echarts实例
      const Memory = this.$echarts.init(document.getElementById('Memory'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: (this.memory_ratio * 100).toFixed(2)
              }
            ]
          }
        ]
      }
      setInterval(function() {
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = Memory.resize
      Memory.setOption(option)// 设置option
    },
    draw_pvc() {
      // 初始化Echarts实例
      const Pvc = this.$echarts.init(document.getElementById('Pvc'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: (this.pvc_ratio * 100).toFixed(2)
              }
            ]
          }
        ]
      }
      setInterval(function() {
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = Pvc.resize
      Pvc.setOption(option)// 设置option
    },
    draw_storage() {
      // 初始化Echarts实例
      const Storage = this.$echarts.init(document.getElementById('Storage'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: (this.storage_ratio * 100).toFixed(2)
              }
            ]
          }
        ]
      }
      setInterval(function() {
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = Storage.resize
      Storage.setOption(option)// 设置option
    },
    draw_cpu_ns() {
      var _this = this
      // 初始化Echarts实例
      const CPU_NS = this.$echarts.init(document.getElementById('CPU_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          // formatter: '工作空间: {b} <br/> 已用/配额: ' + _this.cpu_ns_ratio.cpu + '/' + _this.cpu_ns_ratio.used_cpu
          // formatter: function(_this, cpu_ns_ratio) {
          //   return '工作空间: {b} <br/> 已用/配额: ' + cpu_ns_ratio.cpu + '/' + cpu_ns_ratio.used_cpu
          // }
          formatter: function(data) {
            console.log(data)
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.data.valueStr + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: { // 图例
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: { // 引导线
              show: false
            },
            data: _this.cpu_ns_list
          }
        ]
      }

      /*
       * 获取属于当前用户全部类型的工作空间，每次页面刷新即可重新获取。不需要动态获取*/
      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.cpu_ns_list
      //       }
      //     ]
      //   })
      // }, 2000)

      // 防止越界，重绘canvas
      window.onresize = CPU_NS.resize
      CPU_NS.setOption(option)// 设置option
    },
    draw_gpu_ns() {
      var _this = this
      // 初始化Echarts实例
      const GPU_NS = this.$echarts.init(document.getElementById('GPU_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          formatter: function(data) {
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.data.valueStr + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: _this.gpu_ns_list
          }
        ]
      }

      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.gpu_ns_list
      //       }
      //     ]
      //   })
      // }, 2000)

      // 防止越界，重绘canvas
      window.onresize = GPU_NS.resize
      GPU_NS.setOption(option)// 设置option
    },
    draw_memory_ns() {
      var _this = this
      // 初始化Echarts实例
      const Memory_NS = this.$echarts.init(document.getElementById('Memory_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          formatter: function(data) {
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.data.valueStr + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: _this.memory_ns_list
          }
        ]
      }

      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.memory_ns_list
      //       }
      //     ]
      //   })
      // }, 2000)

      // 防止越界，重绘canvas
      window.onresize = Memory_NS.resize
      Memory_NS.setOption(option)// 设置option
    },
    draw_pvc_ns() {
      var _this = this
      // 初始化Echarts实例
      const Pvc_NS = this.$echarts.init(document.getElementById('Pvc_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          formatter: function(data) {
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.data.valueStr + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: _this.pvc_ns_list
          }
        ]
      }

      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.pvc_ns_list
      //       }
      //     ]
      //   })
      // }, 2000)

      // 防止越界，重绘canvas
      window.onresize = Pvc_NS.resize
      Pvc_NS.setOption(option)// 设置option
    },
    draw_storage_ns() {
      var _this = this
      // 初始化Echarts实例
      const Storage_NS = this.$echarts.init(document.getElementById('Storage_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          formatter: function(data) {
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.data.valueStr + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: _this.storage_ns_list
          }
        ]
      }

      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.storage_ns_list
      //       }
      //     ]
      //   })
      // }, 600000)

      // 防止越界，重绘canvas
      window.onresize = Storage_NS.resize
      Storage_NS.setOption(option)// 设置option
    }
  }
}
</script>
