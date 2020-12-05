<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" />
    <!-- 底部工具栏 -->
    <div class="tolobar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 查看模式：1会将裁剪框限制为画布的内容当中
      dragMode: 'move', // 拖动模式
      aspectRatio: 1, // 截图的比例
      autoCropArea: 1, // 截取的区域，前提是1比1的比例
      cropBoxMovable: false, // 截图的区域是否可以移动
      cropBoxResizable: false, // 背景画布的缩放
      background: false, // 背景不需要，只要纯黑的背景
      movable: true // 画布是否可以移动
    })
    // console.log(cropper)
  },
  methods: {
    onConfirm() {
      // 如果是基于服务器的裁切，使用getData方法，该方法得到裁切的区域参数
      // console.log(this.cropper.getData())

      // 如果是纯客户端的图片裁切，则使用 getCroppedCanvas 方法，该方法得到裁切之后的图片对象（类似于URL.createObjectURL 选择的文件对象）
      // 兼容不太好
      this.cropper.getCroppedCanvas().toBlob(blob => {
        // console.log(blob)
        // 调用接口
        this.updateUserPhoto()
      })
    },

    // 提取出来的单独的更新头像的事件
    async updateUserPhoto(blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // 错误的用法
        // 如果接口要求 Content-Type是 application/json格式的话，
        // 则传递的是普通 JavaScript对象
        // updateUserPhoto({
        //   photo: blob
        // })

        // 如果接口要求Content-Type是multipart/form-data
        // 则必须传递的是 FormData对象
        const formData = new FormData()
        formData.append('photo', blob)

        // 下一步，调用接口
        const { data } = await updateUserPhoto(formData)
        console.log(data)

        // 关闭弹出层
        this.$emit('close')

        // 更新视图
        this.$emit('update-photo', data.data.photo)
        // 提示成功
        this.$toast.success('更新头像成功')
      } catch (err) {
        this.$toast.fail('更新头像失败')
      }
      // 错误的用法
      // 如果接口要求 Content-Type是 application/json格式的话，
      // 则传递的是普通 JavaScript对象
      // updateUserPhoto({
      //   photo: blob
      // })

      // 如果接口要求Content-Type是multipart/form-data
      // 则必须传递的是 FormData对象
      const formData = new FormData()
      formData.append('photo', blob)

      // 下一步，调用接口
      const { data } = await updateUserPhoto(formData)
      console.log(data)
      // 关闭弹出层
      this.$emit('close')
      // 更新视图
      this.$emit('update-photo', data.data.photo)
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .img {
    display: block;
    max-width: 100%; // 防止图片溢出内容的区域
  }
  .tolobar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    color: #fff;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
// 主轴上子元素排列方式：justify-content
// 侧轴上的子元素的排列方式： align-content（多行）align-items（单行）
//
</style>
