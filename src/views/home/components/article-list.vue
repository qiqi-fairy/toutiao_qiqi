<template>
  <div class="article-content">
    <!-- list 组件通过 loading 和 finished 两个变量控制加载状态 -->
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        ref="myList"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticle } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleIndex',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制加载完成后的 状态.为true时显示没有更多了
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的 loading 状态
      isreFreshLoading: false, // 控制下拉刷新的
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // onLoad() {
    //   // 初始化或滚动到底部的时候回触发调用 onLoad
    //   console.log('onLoad')
    //   // 异步更新数据 (1、请求获取数据)
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     // 2、把请求结果数据放到 list 数组中
    //     for (let i = 0; i < 10; i++) {
    //       // 0 + 1 = 1
    //       // 1 + 1 = 2
    //       this.list.push(this.list.length + 1)
    //     }
    //     // 3、本次数据加载结束之后要把加载状态设置为结束
    //     //    loading 关闭以后才能触发下一次的加载更多
    //     this.loading = false

    //     // 4、判断数据是否全部加载完成
    //     if (this.list.length >= 40) {
    //       // 如果没有数据了，就把finished 设置为 true，之后不再触发加载更多（虚拟了一个40）
    //       this.finished = true
    //     }
    //   }, 1000)
    // }

    async onLoad() {
      try {
        // 1、请求获取数据
        const { data } = await getArticle({
          channel_id: this.channel.id, // 频道ID
          // timestamp 简单来说，就是请求数据的页码
          // 请求第一页数据，当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(),
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdsfsdfdsfd')
        // }

        // console.log(data)
        // 2、把请求结果数据放到 list 数组中
        const { results } = data.data
        // 数组的展开操作符，它会把数组元素一个一个的拿出来
        this.list.push(...results)

        // 3、本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4、判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将 finished 设置为 true，不再 load 加载更多
          this.finished = true
        }
      } catch (err) {
        // 模拟失败状态
        // console.log('请求失败', err)
        this.error = true
        // 请求失败了， loading 也需要关闭
        this.loading = false
      }
    },
    // 当下拉刷新的时候
    async onRefresh() {
      try {
        // console.log('onRefresh')
        // 1、请求获取数据
        const { data } = await getArticle({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新，每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.9) {
        //   JSON.parse('asdsfsdfdsfd')
        // }

        // 2、将数据化追加到列表的顶部
        const { results } = data.data
        // this.list.unshift(...results)
        this.list = results // 只显示加载了的10条数据
        this.$refs.myList.check() // 错漏的

        // 3、关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功的提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败，请点击重新加载'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>
<style scoped lang="less">
// vw、vh 视口单位：就是浏览器窗口的大小的单位，不受父元素影响
// vw —— 视口宽度的百分之一
// vh —— 视口高度的百分之一
.article-content {
  // 百分比单位是相对于父元素的
  // height: 100%;
  height: calc(100vh - 174px);
  // 溢出滚动
  overflow-y: auto;
}
</style>
