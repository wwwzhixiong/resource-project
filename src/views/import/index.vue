<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employess'
export default {
  data() {
    return {

    }
  },
  methods: {
    async success({ header, results }) {
      // 由于后台返回的数据是中文，需要把中文名称属性转化为英文
      // 新增的员工的属性是一致的
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      /* **
      * 对results进行遍历 item 是一个对象 要拿到对象当中所有的属性
      *
      * 通过object.keys(item)，拿到的是中文属性的数组
      *
      * 然后在对这个item的key进行遍历,拿到它的key
      *
      * 将原来中文对应的值，赋值给原来英文对应的值
      *
      * item[key]可以拿到中文属性对应的值，相当于做了test['入职日期']
      *
      * userRelations[key]相当于拿到了配置对象的英文属性  userRelations['入职日期"]
      *
      * 第三步:将拿到的英文属性赋值给一个新对象
      *
      *相当于在一个空对象中 添加了属性名为英文；属性值为item[key]
      *
      * 把这个对象return 出去
      *
      * this.$router.back()  回到原来员工管理的页面
      ***/

      // var arr = []
      // results.forEach(item => {
      //   var userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     // 现在是中文
      //     userInfo[userRelations[key]] = item[key] // 将原来中文对应的值，赋值给原来英文对应的值
      //   })
      //   arr.push(userInfo)
      // })

      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // this.formatDate(item[key], '/')
            // 转换时间
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            // 将原来中文对应的值，赋值给原来英文对应的值
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })
      await importEmployee(newArr) // 调用导入接口
      // console.log(newArr)
      this.$router.back() // 回到原来的员工管理页面
      // this.$message.success('导入成功')
    },
    // 转换excel日期格式的方法
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70) // 由于excel里面的日期转换为时间戳之后，比原本的日期多了70年
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
