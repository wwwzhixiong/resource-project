<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片 -->
      <el-card>
        <!-- tabs标签页 -->
        <el-tabs>
          <!-- 放置页签 -->
          <!-- 通过lable控制标签页 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <!-- border代表的是给表格加边框 -->
            <!-- lable代表的每一列的标题 -->
            <!-- type="index" 显示从1开始的索引 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" :index="indexMethodes" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <!-- 如何获取点击当前行的数据，通过作用域插槽的方式 -->
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- alert警告表 --标签，show-icon展示图标， closeble控制警告是否可关闭-->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- lable代表输入框标题的宽度 -->
            <!-- disabled 输入框禁用 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>

    </div>
    <!-- 弹层 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, getRoleList, getCompanyInfo, deleteRole, updateRole, getRoleDetail } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 存放接受请求回来的数据
      page: {
        // 放置页码及相关数据
        page: 1, // 带表当前页。默认第一页
        pagesize: 5, // 代表每页展示多少条记录，默认10条
        total: 0 // 数据的总记录，他是后台返回回来的
      },
      formData: {
        // 存放公司信息的对象
      },
      // 控制弹层展示和隐藏
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']) // 从vuex中获取companyid
  },
  created() {
    this.getRoleList() // 获取角色列表

    this.getCompanyInfo() // 获取公司信息
  },
  methods: {
    // 序号计算
    indexMethods(index) {
      // 注意:通过indek属性自定义索引，后面跟的是一个方法，方法里面是索引的计算公式
      return (this.page.page - 1) * this.page.pagesize + index + 1
    },
    async getRoleList() {
      // 根据后台返回的数据结构，需要提前解构一下
      const { total, rows } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    // 获取的公司的信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除
    async  deleteRole(id) {
      // 点击删除之前弹出确认框
      await this.$confirm('确认删除吗?')
      // 调用接口
      await deleteRole(id)
      this.$message.success('删除角色成功')
      // 重新渲染
      this.getRoleList()
    },
    // 关闭弹层的方法
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 点击编辑按钮的时候
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 显示数据的回写
      this.showDialog = true
    },
    // 点击弹层按钮确认的时候
    async btnOK() {
      try {
        // 只有校验通过的情况下 才会执行await的下方内容
        this.$refs.roleForm.validate()// 如果validate没有回调函数的时候，他是一个promise
        if (this.roleForm.id) {
          // 调用更新接口
          await updateRole(this.roleForm)
        } else {
          // 新增逻辑
          await addRole(this.roleForm) // 调用新增接口
        }
        // 重新渲染
        this.getRoleList()
        // 提示信息
        this.$message.success('操作成功')
        // 关闭弹层
        this.showDialog = false // 当关闭摔层的时候会自动触发弹层的close事件，从而调用了btnCancel将表单数据清空

        console.log(666)
      } catch (error) {
        console.log(error)
      }
    }
  }
}

</script>

<style>

</style>
