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
          <el-button size="small" type="success">excel导入</el-button>
          <el-button size="small" type="warning">excel导出</el-button>
          <el-button icon="plus" type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <!-- 放置表格和分页 -->

      <el-table border :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
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
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
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
    <!-- 放置新增弹层组件 -->
    <!-- sync修饰符 子组件去改变父组件数据的语法糖 ，帮助我们少写代码-->
    <addemployee :show-dialog.sync="showDialog" />
  </div>

</template>

<script>
import addemployee from './components/add-employee'
import { getEmployeeList, delEmployee } from '@/api/employess'
import EmployeeEnum from '@/api/constant/employees'
export default {
  components: {
    addemployee
  },
  data() {
    return {
      list: [], // 接受数组
      page: {
        // 分页
        page: 1, // 页数
        size: 10, // 每页行数
        total: 0 // 总数
      },
      loading: false, // 显示遮罩层
      showDialog: false
    }
  },
  created() {
    this.getEmployeeList()
    this.delEmployee()
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
    }
  }
}
</script>

<style>

</style>
