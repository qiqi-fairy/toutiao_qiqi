<template>
  <!-- currentDate： 双向绑定的日期选择器
          设置了日期选择器的默认值
          同步日期选择器的
  min-date：可选的最小日期
  max-date：可选的最大日期
 -->
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1), // 默认当前最小的 -10年
      maxDate: new Date(), // 默认当前时间 +10年
      currentDate: new Date(this.value)
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })

      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        console.log(currentDate)
        // 发请求去更新用户生日
        const { data } = await updateUserProfile({
          birthday: currentDate
        })
        console.log(data)
        // 更新视图
        this.$emit('input', currentDate)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更改生日失败')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
