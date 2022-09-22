<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <TreeTools :tree-node="company" is-root="true" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <TreeTools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeTools
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
      }
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
      this.company = { name: result.companyName, manager: '负责人' }
      // this.departs = result.depts // 后台返回的是扁平化的结构，并不是树形的结构
      this.departs = tranListToTreeData(result.depts, '') // 调用转化树形结构的方法对数据进行转换
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
