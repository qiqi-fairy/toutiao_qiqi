<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <!-- <span @click="searchHidtories = []">全部删除</span> -->
        <span @click="$emit('clear-search-history', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHidtories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>
<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    // props 如果是普通数据(柱子，字符串，布尔值)绝对不能修改，即便改了也不会传给父组件
    // 如果是引用类型数据(数组，对象),可以修改，例如[].push,不能重新赋值，xxx=[]
    searchHidtories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false // 控制删除的显隐
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态,删除历史记录数据
        // 修改数组里面的数据
        this.searchHidtories.splice(index, 1)
      } else {
        // 非删除状态,直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
