<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="onPost" :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/api/comment'

export default {
  name: 'CommentPost',
  components: {},
  // inject: ['articleId'],
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPost() {
      // console.log('onPost')
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        durationo: 0 // 持续时间，默认是 2000， 如果为0， 则持续展示
      })
      try {
        const { data } = await addComment({
          target: this.target.toString(), // 文章ID、评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.articleId ? this.articleId.toString() : this.articleId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        console.log(data)

        // 关闭弹出层
        // 将发布内容显示到列表顶部
        // 清空文本框
        this.message = ''
        // 发布一个自定义事件，传给父组件，让父组件去决定他怎么用
        this.$emit('post-success', data.data)

        this.$toast.success('发布成功')
      } catch (err) {
        this.$toast.fail('发布失败')
      }
    }
  }
}
// 基本思路：
// 找到数据接口、封装请求方法、注册发布点击事件(请求发布（成功，将发布的内容展示到列表中，失败，提示失败）)
</script>
<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    color: #3465fa;
    &::before {
      display: none;
    }
  }
}
</style>
