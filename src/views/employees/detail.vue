<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form ref="userForm" label-width="120px" :model="userInfo" :rules="rules" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 打印按钮 -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <!-- 声明式导航的跳转方式 -->
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- <user-info>个人详情组件</user-info> -->
            <!-- vue.js中内置了一个组件 component  它通过is属性绑定组件-->
            <component :is="userComponent" />
            <!-- 动态组件 可以切换组件 is必须是变量，否则component没意义 -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="UserJob" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 按需引入查询接口
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employess'
// 引入员工详情组件
import UserInfo from './components/user-Info.vue'
import JobInfo from './components/job-Info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userComponent: 'UserInfo',
      UserJob: 'JobInfo',
      userId: this.$route.params.id,
      //  获取路由地址中的: 拼接动态参数 id 需要用this.$router.params.参数名称
      // 例如：'detail/:id?'
      // 备注2:如果在路由地址中是?拼接的传参方式需要用this.proute .query.参数名称
      // 例如：http://localhost:8888/#/employees/detail/?id=131245

      userInfo: {
        //   专门存放基本信息
        username: '',
        password2: '' // 因为读取出来的password 是 密文
      },
      // 校验规则
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      // 传入id
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 定义修改用户信息的方法
    async saveUser() {
      try {
        // 表单的手动校验
        await this.$refs.userForm.validate()
        // 将新密码的值替换原密码的值 后面的password 会替换前面展开运算符的password
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
