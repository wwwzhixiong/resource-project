<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group>
      <!-- 选项 -->
      <!-- 分配角色  v-modle绑定的数组，这个数组里存储的就是勾选项目ID-->
      <el-checkbox-group v-model="roleIds">
        <!-- 复选框lable即起到展示的作用 ，也起到存储的作用 -->
        <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
          {{
            item.name
          }}
        </el-checkbox>
      </el-checkbox-group>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employess'
export default {
  props: {
    // 弹层的隐藏和展示
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      // 用户ID 当前要处理的用户角色信息，从父组件传过来
      type: String,
      default: null
      // require: true 要求必须传入ID
    }
  },
  data() {
    return {
      list: [], // 存放接口返回的所有角色
      roleIds: [] // 存放勾选的角色，或者时用户所拥有的角色
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    // 调用获取用户详情的接口，这个接口里面会返回一个roleIds数组，里面存的就是该用户所拥有的角色
    // 因为props传值是异步，所以这里不能用this.userId
    // 这个方法是给父组件调用的
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
    },
    // 点击确定以后修改用户角色
    async btnOk() {
      // 传递了两个参数:一个是用户id，一个是给用户分配的角色数组
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   关闭窗体
      this.$emit('update:showRoleDialog', false)
      // this.$parent.showRoleDialog = false
      this.$message.success('修改权限成功')
    },
    btnCancel() {
      this.roleIds = [] // 清空原来的数组
      // 通过sync修饰符关闭弹层
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
