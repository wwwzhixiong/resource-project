<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
// 引入删除接口
import { delDepartments } from '@/api/departments'
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    // isRoot控制下拉菜单中的编辑和删除是否展示Ⅰ
    // 备注:如果父组件中传递值了以传递过来的为主，如果没有传递，则以默认的为主
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 操作节点调用的方法
    operateDepts(type) {
      if (type === 'add') {
        // //在点击添加选项的时候，需要子组件父组件传涕事件，
        // 顺便将占击的当前节占的信息传递过去,就是porps中的treeNode
        // 添加子部门的操作
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        //  编辑部门的操作
        // 点击编辑按钮，子组件向父组件传递事件，让弹框展示,同时将当前点击的节点对象信息传递了过去
        this.$emit('editDepts', this.treeNode)
      } else {
        //  删除操作
        this.$confirm('您确定要删除该组织部门吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 只需要等到成功的时候，调用接口删除了，后端数据变化了，但是前端没变
          // 重新获取数据
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>
