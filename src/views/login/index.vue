<template>
    <div class="login-container">
      <!-- 导航栏 start -->
      <van-nav-bar class="page-nav-bar" title="登录" />
      <!-- 导航栏 end class="page-nav-bar" -->
      <!-- 登录表单 -->
      <van-form @submit="onSubmit">
        <van-field name="用户名" placeholder="请输入手机号" >

        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
        </van-field>
        <van-field type="password" name="密码" placeholder="请输入验证码" >
            <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
            <template #button>
                <van-button round class="send-sms-btn" size="small" type="default">发送验证码</van-button>
            </template>
        </van-field>
        <div class="login-btn-wrap">
          <van-button class="login-btn" block type="info" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
      <!-- 登录表单end -->
    </div>
</template>

<script>
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSubmit(values) {
      console.log('submit', values)
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
    .toutiao {
        font-size: 37px;
    }

    .send-sms-btn {
        width: 160px;
        height: 46px;
        line-height: 46px;
        background-color: #ededed;
        font-size: 22px;
        color: #666;
    }

    .login-btn-wrap {
        margin: 53px 33px;
        .login-btn {
            background-color: #6db4fb;
            border: none;
        }
    }
}
</style>
