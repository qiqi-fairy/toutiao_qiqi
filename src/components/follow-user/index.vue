<template>
  <!-- 关注与已关注 v-if="isFollowed" -->
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
    :loading="loading"
    >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    :loading="loading"
    >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  components: {},
  // 自定义 v-model 的数据名称
  model: {
    prop: 'isFollowed', // 默认是 value
    event: 'update-is_followed' // 默认是 input
  },
  props: {
    // value: {
    //   type: Boolean,
    //   required: true
    // },
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false // 关注的 loading状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onFollow() {
      // 展示关注按钮的 loading 状态
      this.loading = true 
      try {
        // if (this.article.is_followed) {
        // if (this.value) {
        if (this.isFollowed) {
          // 已关注，取消关注
          //   await deleteFollow(this.article.aut_id)
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          // 没有关注，点击关注
          await addFollow(this.userId)
          // this.article.is_followed = true
        }
        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        // this.isFollowed = !this.isFollowed // 报错
        // this.$emit('update-is_followed', !this.value)
        // this.$emit('input', !this.value)
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false // 关闭
    }
  }
}
</script>
<style scoped lang="less"></style>
