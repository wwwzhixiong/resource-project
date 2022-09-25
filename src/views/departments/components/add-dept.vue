<template>
  <!-- 新增部门的弹层 -->
  <!-- visible 控制弹层的展示与隐藏 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 遍历选项 -->
          <!-- lable属性代表的是下拉框显示的是什么，value属性代表的是要传给后台的数据-->
          <el-option v-for="item in peoples" :key="item.id" :lable="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
// 引入获取员工列表的方法
import { getEmployeeSimple } from '@/api/employess'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false // 默认隐藏
    },
    // 父组件传递过来的当前节点对象，用里面的id去查找同级部门
    currentNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.currentNode.pid).some(item => item.name === value)
      } else {
        // 没id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.currentNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式  因为编辑模式下 不能算自己
        // 同时用到了fileter和some方法
        isRepeat = depts.filter(item => item.id !== this.currentNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },

          {
            validator: checkNameRepeat, trigger: 'blur'
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },

          {
            validator: checkCodeRepeat, trigger: 'blur'
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      // 通过计算属性控制弹层标题的动态显示，
      // 判断formData中有没有id,如果有id，
      // 代表此时点击的是编辑，如果没有id带表点击的是新增
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    btnOk() {
      // 通过ref 获取表单的实列对象
      this.$refs.deptForm.validate(async isok => {
        if (isok) {
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
          // 调用接口
            await addDepartments({ ...this.formData, pid: this.currentNode.id }) // 调用新增接口 添加父部门的id
          }
          // isok是true代表验证通过
          // 调用接口
          await addDepartments({ ...this.formData, pid: this.currentNode.id }) // 调用新增接口 添加父部门的id
          // 新增接口调用完毕之后，重新查询数据，更新视图
          this.$emit('addDepts') // 子组件向父组件传递事件，通知父组件调用查询接口，更新视图
          //  关闭弹出层方式1 传递事件过去
          // this.$emit('changeDialog', false)
          // 方式2：通过sync修饰符关闭弹层
          this.$emit('update:showDialog', false)
          // 关闭dialog的时候会触发el-dialog的close事件，所以这里不需要在单独的重置数据了
        }
      })
    },
    btnCancel() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 点击取消按钮的时候，关闭弹层
      this.$emit('update:showDialog', false)
      // 清除校验
      this.$refs.deptForm.resetFields()
      // resetFields，移除校验结果，对整个表单进行重置
    },
    // 获取部门详情的方法
    async getDepartDetail(id) {
      // 因为实在父组件调用了子组件的方法，先设node数据，直接调用方法
      // 注意:直接使用props中的当前节点对象中的部门id原则是没有问题的，但是会出现bug,是由于props传递数据是异
      // 步，有可能在调用接口的时候，数据还没有传递过来，导致接口没有携带正确的参数，从而调用失败
      // this.formData = await getDepartDetail(this.currentNode.id) // 接口返回的数据需要赋值给formData这个对象进行表单数据回填
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>
