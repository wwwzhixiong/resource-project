<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧总记录数 -->
        <!-- 插槽方式显示1 -->
        <!-- <span slot="before">
          16条记录
        </span> -->
        <!-- 方式2 -->
        <template v-slot:before>
          {{ page.total }}条记录
        </template>
        <!-- 右测导出按钮 excel导入 新增员工 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="warning" @click="exportDate">excel导出</el-button>
          <el-button icon="plus" type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <!-- 放置表格和分页 -->

      <el-table border :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="头像" align="center">
          <!-- template v-slot="{row}" -->
          <template slot-scope="{row}">
            <img
              slot="reference"
              v-imagerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
              alt=""
              @click="showCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <!--作用域插槽 -->
        <el-table-column label="入职时间" sortable="" align="center">
          <!-- 作用域插槽 -->
          <!-- formatDate 通过过滤器将时间格式化 -->
          <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
        </el-table-column>
        <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
          <template slot-scope="{ row }">
            <!-- 根据当前状态来确定 是否打开开关 -->
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template v-slot="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :page-size="page.size"
          :current-page="page.page"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 二维码弹层 -->
    <el-dialog :visible.sync="showCodeDialog" title="二维码">
      <el-row type="flex" justify="center">
        <!-- canvas是h5的标签，一个画布比普通的标签功能强大，可以画图 -->
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置新增弹层组件 -->
    <!-- sync修饰符 子组件去改变父组件数据的语法糖 ，帮助我们少写代码-->
    <addemployee :show-dialog.sync="showDialog" />
    <!-- 角色组件使用 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>

</template>

<script>
import QrCode from 'qrcode'
import addemployee from './components/add-employee'
import { getEmployeeList, delEmployee } from '@/api/employess'
import EmployeeEnum from '@/api/constant/employees'
import { formatDate } from '@/filters'
import AssignRole from './components/assign-role.vue'
// 引入转换日期格式方法
export default {
  components: {
    addemployee,
    AssignRole
  },
  data() {
    return {
      showRoleDialog: false, // 控制角色弹层隐藏展示
      list: [], // 接受数组
      page: {
        // 分页
        page: 1, // 页数
        size: 10, // 每页行数
        total: 0 // 总数
      },
      loading: false, // 显示遮罩层
      showDialog: false,
      showCodeDialog: false,
      userId: ''// 点击获取用户ID
    }
  },
  created() {
    this.getEmployeeList()
    // this.delEmployee()
  },
  methods: {
    async  getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
    },
    // newPagez最新页码
    changePage(newPage) {
      this.page.page = newPage
      // 重新拉取数据
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        // 点击确定 开始删除
        await delEmployee(id)
        // 重新渲染
        this.getEmployeeList()
        // 提示信息
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel功能的方法
    exportDate() {
      // 按需引入文件夹,因为文件体积较大
      import('@/vendor/Export2Excel').then(async excel => {
        const headers = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName',
          '聘用形式': 'formOfEmployment'
        }
        // // 调用excel导出功能的方法 并配置参数
        // excel.export_json_to_excel({
        //   header: ['姓名', '籍贯'], // 表头参数，只有表头参数导出时不成功的还需要配置data数据信息
        //   data: [['赵子龙', '常山'], ['志雄', '甘肃']],
        //   filename: '员工资料表' // 文件名称
        //   // bookType: 'txt' // 导出文件类型
        // })
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)// 通过调用转化方法获取转化完之后的数据结构
        //  里面一个数组代表一个表头 如果是多个数组就代表多行表头
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 合并单元格的规则
        // console.log(data)
        // 真正的导出逻辑
        // 1. 确定heardes
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头信息
          data: data, // 将转换完毕的数据解构添加到data 参数这里
          filename: '员工资料表',
          multiHeader: multiHeader, // 表头行数
          merges: merges // 表头进行合并的规则
        })
      })
    },
    // 封装一个转换数据的方法，把[{},{}],转为[[],[]]
    // map 的作用就是将处理完的结果返回到一个新数组里面
    formatJson(headers, rows) {
      // 遍历rows 拿到每一行的数据，{username:'pink',monile:10086}
      const test = rows.map(item => {
        // item是一个对象
      //  Object.keys(headers) 执行完拿到的是一个数组['姓名'，'手机号'，‘入职日期’]
        return Object.keys(headers).map(key => {
          // key 就相当于单个的中文名称  ex： ‘姓名‘
          // 英文属性  headers[key] ex: "username"
          // 对日期格式进行处理
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 如何对格式进行转换？ 调用方法
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 对聘用格式进行转化
            // 取出聘用方式的值
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '外包'
          }
          return item[headers[key]]
          // item[headers[key]] 取出来的是值英文属性对应的值  ex: 'pink'
        }) // 里层map的方法会将返回的值，返回到一个新数组里面，得到了类似['pink',10086]
      })
      return test
      // return test // test是最终处理完的数据结构[〔[ '张三', '15209223972'],[ '李四', 1367890001']]
    },
    // 点击头像展开弹层
    showCode(url) {
      // 如果有头像地址，将头像地址转化为二维码，如果没有，则提示还没有上传图片
      if (url) {
        // 展示弹层
        this.showCodeDialog = true
        // 调用插件的方法,生成二维码有两个参数 1： canvas画布的实例 2：要转换的图片地址
        // 注意:控制弹层的这个变量的值由false，变为true的时候，DON发生了更新，
        // 我们想要立马拿到更新后的DON是不行的，因为DON的更新是异步的,可以在this.$nextTick方法里面
        this.$nextTick(() => {
          // 拿到更新后的dom,就可以进行正常操作了
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.error('该员工还没有上传头像')
      }
    },
    // 编辑角色的方法
    editRole(id) {
      this.showRoleDialog = true // 打开弹层
      this.userId = id
      this.$refs.assignRole.getUserDetailById(this.userId)
    }
  }
}
</script>

<style>

</style>
