<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <van-cell title="头像" is-link>
      <van-image class="img-info" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateUserName = true"
    />
    <van-cell title="性别" :value="mygender" is-link />
    <van-cell title="生日" :value="user.birthday" is-link />
    <!-- /个人信息 -->

    <!-- 编辑昵称 的弹出层 -->
    <van-popup
      v-model="isUpdateUserName"
      style="height: 100%"
      position="bottom"
    >
    <!-- v-if="isUpdateUserName" 用来展示组件，如果点击了取消还存在更改过的数据的话就是不对的，用v-if来更改会更合理一些 -->
      <update-name
        v-if="isUpdateUserName"
        @close="isUpdateUserName = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- /编辑昵称 的弹出层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'

export default {
  name: 'UserProfile',
  components: {
    UpdateName
  },
  props: {},
  data() {
    return {
      user: {}, // 用户的个人信息
      isUpdateUserName: false // 控制编辑用户昵称的弹出层的显示与隐藏
    }
  },
  computed: {
    mygender() {
      if (this.user.gender === 0) {
        return '男'
      } else {
        return '女'
      }
    }
  },
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('用户个人资料获取失败，请重试')
      }
    }
  }
}
</script>
<style scoped lang="less">
.user-profile {
  .img-info {
    width: 50px;
    height: 50px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
