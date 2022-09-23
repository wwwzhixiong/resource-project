<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <TreeTools
          :tree-node="company"
          is-root="true"
          @addDepts="addDepts"
        />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <TreeTools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>

    </div>
    <!-- 使用新增功能的弹层组件 -->
    <add-Dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :current-node="node"
      @addDepts="getDepartments"
    />
    <!-- 方式1：关闭弹层 -->
    <!-- @changeDialog="changeDialog" -->
    <!-- 新增接口更新视图 -->
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue' // 引入添加人员弹层组件
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: { },
      // departs: [{ name: '总裁办', manager: '曹孟德', children: [{ name: '董事会', manager: '曹子桓' }] },
      //   { name: '行政部', manager: '刘玄德' },
      //   { name: '人事部', manager: '孙仲谋' }],
      departs: [], // 存放树形结构的数据
      defaultProps: {
        label: 'name', // 代表的式将默认lable属性改成name属性
        children: 'children' // 代表将默认的子节点children属性改成list属性
      },
      showDialog: false, // 控制弹层的隐藏和展示
      node: {}
    }
  },
  created() {
    this.getDepartments()
  },
  // 封装调用获取阻止架构的方法
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      console.log(result)
      // 将根节点的数据变成动态的
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // this.departs = result.depts // 后台返回的是扁平化的结构，并不是树形的结构
      this.departs = tranListToTreeData(result.depts, '') // 调用转化树形结构的方法对数据进行转换
    },
    addDepts(node) {
      //  node代表的是点击的时候携带过来的当前节点对象，在调用新增接口的时候需要传递，知道是给哪一个节点做添加的
      this.showDialog = true // 将弹层显示
      this.node = node
      console.log(node)
    },
    // 子组件传递过来的关闭弹层的方法
    changeDialog(value) {
      this.showDialog = value // 新增接口调用成功之后关闭弹层
    },
    // 定义当点击编辑按钮时让弹层展示的方法
    editDepts(node) {
      // 将弹层显示
      this.showDialog = true
      // 将传递过来的信息保存下来
      this.node = node
      // 在这里调用获取部门详情的接口
      // 拿到弹层组件的组件实例,并将当前部门id作为形参传递过去
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}

</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
