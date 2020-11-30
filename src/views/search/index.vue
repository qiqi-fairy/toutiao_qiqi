<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
    <form class="search-form" action="/">
      <van-search
        background="#3694fa"
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!--  搜索框 end -->

    <!-- 搜索结果 start -->
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- 搜索结果  end -->

    <!-- 联想建议 start  -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- 联想建议 end -->

    <!-- 搜索历史记录 start -->
    <search-history
      v-else
      :search-hidtories="searchHidtories"
      @clear-search-history="searchHidtories = []"
      @search="onSearch"
    />
    <!-- 搜索历史记录 end -->
  </div>
</template>
<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的显示
      searchHidtories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜搜的历史记录数据
    }
  },
  computed: {},
  watch: {
    // 完整写法
    // searchHidtories: {
    //   handler () {}
    // }
    searchHidtories(value) {
      // console.log('hahah') 被监视到
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      // this.searchText = val
      // this.isResultShow = true
      // console.log(val)

      // 1、更新文本框内容
      this.searchText = val
      // 2、存储搜索历史记录
      // 要求：不要有重复数据，最新的数据排在最前面
      const index = this.searchHidtories.indexOf(val)
      if (index !== -1) {
        this.searchHidtories.splice(index, 1)
      }
      this.searchHidtories.unshift(val)
      // 3、渲染搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
