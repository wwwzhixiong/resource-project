<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- @close事件关闭弹层，和取消按钮绑定的同一个方法 -->
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 放置一个tree组件 -->
        <el-tree
          v-if="showTree"
          :data="treeData"
          default-expand-all=""
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import { addEmployee } from '@/api/employess'
import EmployeeEnum from '@/api/constant/employees.js' // 引入聘用形式的数据
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 外部引入的数据首先得赋值给data中定义的变量，才能在标签中使用
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        // 因为不想一离开就校验
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts是数组 但不是树形
      // 转化为树形结构
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 点击树形组件节点的方法，里面有一个参数，存的是当前点击的对象，把数据填充到部门里面
    selectNode(node) {
      this.formData.departmentName = node.name // 将点击的节点名称赋值给部门表单
      this.showTree = false // 选择完毕之后关闭树形组件
    },
    async btnOk() {
      try {
        // 点击确定按钮进行手动校验表单 ,验证通过执行下面得代码
        await this.$refs.addEmployee.validate()
        await addEmployee(this.formData) // 调用新增接口,
        // 通知父组件更新数据
        // 方式1：通过子组件向父组件通信得方式
        // this.$emit('事件')
        // 方式2：在子组件中拿到父组件实例，然后调用父组件得查询方法，更新视图
        // this.$parent但是使用时有条件得，组件的使用不能包在el-ul的标签里面
        // console.log(this.$parent)
        this.$parent.getEmployeeList() // 更新视图
        // 关闭弹窗方式1：
        this.$parent.showDialog = false
      // 方式2：
      // this.$emit('updata:showDialog', false)
      // 这里不用重置数据因为触发close事件,从而间接调用了btnCancel方法
      } catch (error) {
        // 点击取消或者验证失败走catch
        console.log(error)
      }
    },
    btnCancel() {
      // 重置表单数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 关闭树形
      this.showTree = false
      // 调用表单实例的resetFilds 移除表单的信息
      this.$refs.addEmployee.resetFields()
      // 关闭弹层 sync修饰符
      this.$emit('update:showDialog', false)
    }

  }
}
</script>

<style>

</style>
