<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- 全局组件可以直接使用 -->
    <!-- <uploadExcel /> -->
    <ImageUpload />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import pageTools from '@/components/PageTools'
export default {
  name: 'Dashboard',
  // components: {
  //   pageTools
  // },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
