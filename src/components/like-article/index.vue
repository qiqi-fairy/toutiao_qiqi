<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{
      liked: value === 1
    }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'

export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      this.loading = true
      try {
        let status = -1 // 声明一个变量，默认是-1(无状态)
        if (this.value === 1) {
          // 已点赞，取消点赞
          // await deleteLike(文章ID)
          await deleteLike(this.articleId)
        } else {
          // 未点赞，点击添加点赞
          await addLike(this.articleId)
          status = 1
        }
        // 更新视图
        // 因为要更新到父组件，所以要发布自定义事件（v-model的事件是input 事件）
        this.$emit('input', status)
        // 做判断
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败,请重试')
      }
      this.loading = false
    }
  }
}
</script>
<style scoped lang="less">
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
