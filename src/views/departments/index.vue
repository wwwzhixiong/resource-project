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
          <TreeTools slot-scope="{ data }" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: { name: '三国创业孵化集团', manager: '负责人' },
      departs: [{ name: '总裁办', manager: '曹孟德', children: [{ name: '董事会', manager: '曹子桓' }] },
        { name: '行政部', manager: '刘玄德' },
        { name: '人事部', manager: '孙仲谋' }],
      defaultProps: {
        label: 'name', // 代表的式将默认lable属性改成name属性
        children: 'children' // 代表将默认的子节点children属性改成list属性
      }
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
