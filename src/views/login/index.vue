<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <!-- enter 是按键修饰符 -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!-- loading是控制加载中的效果 -->
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" class="loginBtn" @click.native.prevent="handleLogin">登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data() {
    const validateMobile = (rule, value, callback) => {
      // 方式1 ：if-else 判断
      // if (!validMobile(value)) {
      //   callback(new Error('手机号格式不正确'))
      // } else {
      //   callback()
      // }
      // 方式2：
      validMobile(value) ? callback() : callback(new Error('手机号格式不正确'))
    }
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', message: '手机号不能为空' }, {
          validator: validateMobile, trigger: 'blur'
        }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }, {
          min: 6, max: 16, trigger: 'blur', message: '密码长度为6-16'
        }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    ...mapActions(['user/login']), // 相当于在methods有一个user/login的方法
    handleLogin() {
      // 点击登录按钮后对表单进行手动校验
      this.$refs.loginForm.validate(async valid => {
        // 如果值为true说明验证通过了
        if (valid) {
          // 方式1：通过￥$dispath触发。搭配then()
          // this.loading = true // 开启loading加载中
          // // console.log('验证通过')
          // // 如果验证通过，调用登录接口，是通过触发actions里面的方法
          // this.$store.dispatch('user/login', this.loginForm).then(() => {
          //   this.$router.push('/') // 登录成功之后 跳转到主页
          //   this.loading = false
          // }).cathch((err) => {
          //   this.loading = false // 不管响应成功还是false loading都是关闭的
          //   console.log(err)
          // })
          try {
            // 方法2：通过mapActions辅助函数的方式触发actions里面的方法，从而调用的登录接口
            this.loading = true // 开启loading加载中
            // 捕获错误需要加到trcatch里面
            await this['user/login'](this.loginForm)
            this.$router.push('/')
          } catch (err) {
            console.log(err)
          } finally {
            //  不管成功与否，都会走到finally这个逻辑里
            this.loading = false
          }
        }
      })
    }

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#fff;
$light_gray:#000;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
// 注意：在样式中如果使用@符号引入路径，需要在@符号前面加 ~
.login-container {
  background: url(~@/assets/common/login.jpg) center;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
// 登录表单的样式
    .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
// 设置错误信息的样式
 .el-form-item__error {
    color: #fff
  }
// 修改登录按钮的样式
  .loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
}
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
