<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 宫格 -->
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!--  v-show="isEdit && channel.id !== 0" 也可以完成推荐不显示小x号的功能 -->
        <van-icon
          v-show="isEdit && !fiexChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- v-bind: 语法：
            一个对象，对象中的 key 表示收作用的 CSS 类名
                     对象中的 value 要计算出布尔值
                     true：则作用该类名
                     false： 不作用类名 -->
        <span slot="text" :class="{ active: index === active }" class="text">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!-- 宫格 -->
    <van-grid class="recommend-grid " :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>
<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels() {
      // console.log(123) 会重新跑一遍逻辑
      //   数组的 filter 方法，就是遍历数组，把符合条件的元素存储到新数组并返回
      return this.allChannels.filter(channel => {
        // 相当于在内部创建了一个数组：const channels = []
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        // return channels
      })
    }
    /**
     *     recommendChannels() {
             const channels = []
             this.allChannels.forEach(channel => {
               // 数组的 find 方法，遍历数组，把符合条件的第一个元素返回
               const ret = this.myChannels.find(myChannel => {
                 return myChannel.id === channel.id
               })
               // 如果我的频道中不包括该频道项，则收集到推荐频道中（所有频道中不包括推荐频道）
               if (!ret) {
                 channels.push(channel)
               }
             })
             console.log(channels)
             // 把计算结果返回
             return channels
           }
     */
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
        // console.log('err', err)
      }
    },

    async onAddChannel(channel) {
      // console.log(channel)
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，把数据存储到接口服务器
          await addUserChannels({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录,把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 1、如果是固定频道，则不删除
        if (this.fiexChannels.includes(channel.id)) {
          return
        }

        // 删除频道项
        this.myChannels.splice(index, 1)

        // 3、如果删除的激活频道之前的频道，则更新激活的频道项
        // 删除功能
        // 编辑状态，执行删除频道
        // 参数一： 要删除的索引
        // 参数二： 删除的个数，如果不指定，则从参数一开始删除
        if (index <= this.active) {
          // 让激活的频道索引 -1
          this.$emit('update-active', this.active - 1, true)
        }

        // 4、处理持久化
        this.deleteChannel(channel)
      } else {
        // 切换功能
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
        // this.$emit('update:active', index)
        // this.active = index
      }
    },

    // 删除频道
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录,则将数据更新到线上
          await deleteUserChannels(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      /deep/.van-grid-item__text .text {
        color: #222;
        font-size: 28px;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/.my-grid {
    font-size: 28px;
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
