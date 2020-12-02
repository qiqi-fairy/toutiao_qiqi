<template>
<!-- // 收藏文章 -->
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{
      collected: value
    }"
    :loading="loading"
    @click="onCollect"
  />
  <!-- is_collected 是否收藏 -->
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'

export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
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
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏，点击收藏
          await addCollect(this.articleId)
        }

        // 更新视图
        this.$emit('input', !this.value)

        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
      }
      this.loading = false
    }
  }
}
</script>
<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
