<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
    <!-- 默认情况下：双大括号会输出纯文本内容 -->
    <!-- <div>{{ htmlStr }}</div> -->
    <!-- 使用 v-html 指令可以绑定渲染带有HTML标签的字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>
<script>
import { getSearhSuggestions } from '@/api/search'
// 按需加载的好处：只会把使用到的成员打包到结果中
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [], // 联想建议数据列表
      htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  computed: {},
  watch: {
    // watch 就是侦听data中定义的数据的变化，监视谁就写谁
    searchText: {
      // 当 searchText 发送改变时就会调用 handler 函数
      // 注意： handler 函数名称是固定的
      // handler(value) {
      //   console.log(value)
      // },
      // handler: function(value) {
      //   console.log(value)
      // },

      // 停止输入后1秒之后才调用
      // debounce 函数：
      //  参数一：一个函数
      //  参数二：延迟时间，单位是毫秒
      //  返回值: 防抖之后的函数
      handler: debounce(function(value) {
        // console.log(value)
        this.loadSearchSuggestion(value)
      }, 200),
      // handler(value) {
      //   // console.log(value)
      //   // 当数据发生变化就来调用这个方法
      //   this.loadSearchSuggestion(value)
      // },
      // 该回调将会在侦听开始后立即调用（刚开始就调用一次，比如刚开始就输入1，就要打印1）
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearhSuggestions(q)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
      }
    },
    // 高亮显示联想建议
    highlight(text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      
      // 正则表达式 // 中间的内容都会当做匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // this.searchText 不能这么写
      // RegExp: 正则表达式构造函数
      //    参数一：匹配模式字符串，它会根据这个字符串创建正则表达式
      //    参数二：匹配模式，要写到字符串中 
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>
<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
  color: #3496fa;
}
}

</style>
