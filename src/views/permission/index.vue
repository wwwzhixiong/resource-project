<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 page-tools是全局公共组件-->
      <page-tools>
        <!-- 具名插槽 -->
        <template v-slot:after>
          <!-- 按钮有两个参数，一个是type代表此时添加的访问权限 ,一个是一级节点pid，代表此时添加的是子节点 -->
          <el-button type="primary" size="small" @click="addPrimission(1,0)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 加边框 让文字居中 -->
      <!-- 注意：表格树型解构要加 row-key属性 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPrimission(2,row)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delpermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <!-- 开关组件 active-value="1" 代表的是开启 -->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <!-- 底部确定和取消按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// getPermissionDetail, updatePermission,
import { addPermission, delPermission, getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      showText: '',
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }

    }
  },
  created() {
    this.getPermissionList() // 调用获取权限列表的接口
  },
  methods: {
    async getPermissionList() {
      const data = await getPermissionList()
      // 调用树形解构方法 把扁平化数据转换为树形解构
      this.list = tranListToTreeData(data, '0')
    },
    // 点击确定按钮的时候手动校验
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        // 验证通过走.then逻辑
        // 调用接口
        return addPermission(this.formData)
      }).then(() => {
        this.showDialog = false
        // 刷新页面
        this.getPermissionList()
        this.$message.success('添加成功')
      })
    },
    btnCancel() {
      this.showDialog = false
    },
    // 编辑按钮
    editPermission() {
      this.showDialog = true
    },
    // 删除按钮功能
    // 删除操作
    async delpermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // delpermission(id) {
    //   this.$confirm('确认删除该权限吗？').then(() => {
    //     // 点击弹框的按钮时 会走.then
    //     return this.delPermission(id)
    //   }).then(() => {
    //     this.$message.success('删除成功')
    //     // 重新拉去数据
    //     this.getPermissionList()
    //   })
    // },
    // 添加权限
    addPrimission(type, id) {
      this.showDialog = true
      // 访问权=1，按钮操作权=2
      this.formData.type = type
      this.formData.pid = id // 要添加的子节点的pid的值等于父节点的id
      this.showDialog = true// 让弹层打开
      // 调用接口
    }
  }

}
</script>

<style>

</style>
