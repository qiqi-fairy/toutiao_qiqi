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
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 个人信息 -->
    <!-- 当选择同一个图片的时候，input的change事件不会被触发 -->
    <van-cell
      class="photo-cell"
      title="头像"
      is-link
      @click="$refs.file.click()"
    >
      <van-image class="img-info" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateUserNameShow = true"
    />
    <van-cell
      title="性别"
      :value="mygender"
      is-link
      @click="isUpdateUserGenderShow = true"
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateUserBirthdayShow = true"
    />
    <!-- /个人信息 -->

    <!-- 编辑昵称 的弹出层 -->
    <van-popup
      v-model="isUpdateUserNameShow"
      style="height: 100%"
      position="bottom"
    >
      <!-- v-if="isUpdateUserName" 用来展示组件，如果点击了取消还存在更改过的数据的话就是不对的，用v-if来更改会更合理一些 -->
      <update-name
        v-if="isUpdateUserNameShow"
        @close="isUpdateUserNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- /编辑昵称 的弹出层 -->

    <!-- 编辑性别的弹出层 -->
    <van-popup v-model="isUpdateUserGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateUserGenderShow"
        v-model="user.gender"
        @close="isUpdateUserGenderShow = false"
      ></update-gender>
    </van-popup>
    <!-- /编辑性别的弹出层 -->

    <!-- 编辑生日的弹出层 -->
    <van-popup v-model="isUpdateUserBirthdayShow" position="bottom">
      <update-birthday
        v-if="isUpdateUserBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateUserBirthdayShow = false"
      ></update-birthday>
    </van-popup>
    <!-- /编辑生日的弹出层 -->

    <!-- 编辑头像的弹出层 -->
    <van-popup
      v-model="isUpdateUserPhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
       :img="img"
        @close="isUpdateUserPhotoShow = false" 
        v-if="isUpdateUserPhotoShow"
        @update-photo="user.photo = $event"
      ></update-photo>
    </van-popup>
    <!-- /编辑头像的弹出层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data() {
    return {
      user: {}, // 用户的个人信息
      isUpdateUserNameShow: false, // 控制编辑用户昵称的弹出层的显示与隐藏
      isUpdateUserGenderShow: false,
      isUpdateUserBirthdayShow: false,
      isUpdateUserPhotoShow: false,
      img: null // 预览的图片
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
    },

    // 监听 input的 change事件
    onFileChange() {
      // 获取文件对象 this.$refs.file -> input的DOM元素
      const file = this.$refs.file.files[0]
      //  基于文章对象获取 blob（图片） 数据
      const data = window.URL.createObjectURL(file)
      console.log(data)
      // 把这个数据设置给 img
      this.img = data
      // 展示预览图片弹出层
      this.isUpdateUserPhotoShow = true
      // file-input 如果选了同一个文件不会触发 change事件
      // 解决办法就是：每次使用完毕就把它的 value 清空
      this.$refs.file.value = ''
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
