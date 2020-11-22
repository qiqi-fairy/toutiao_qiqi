// PostCss 配置文件
module.exports = {
  // 配置要是用的 PostCss 插件
  plugins: {
    // 配置使用 autoprefixer 插件
    // 作用：生成浏览器 CSS 样式规则前缀
    // VueCLI 内部已经配置了 autoprefixer 插件
    // autoprefixer: {
    //   // 配置要兼容的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 配置使用 postcss-pxtorem 插件
    'postcss-pxtorem': {
      // 根元素的值（lib-flexible 的 REM 适配方案：把一行分为10份，每份就是十）
      // 所以 rootValue 应该设置为你的设计稿宽度的十分之一
      // 我们的设计稿 是 750，所以应该设置为 750 / 10  =  75
      // 但是 vant 建议设置为 37.5 为什么？ 因为 vant 就是基于375 写的
      // 有无更好的方法？
      // 如果是 vant 那就用 37.5 来转换
      // 如果是我们自己的样式，就按照 75 来转换
      //  数字： 固定的数值
      //  函数：可以动态处理返回
      //        postcss=pxtorem  处理每个css文件的时候都会来调用这个函数
      // 它会把被处理的 css文件相关的信息通过参数传递给该函数
      // rootValue( { file } ) {
      //   console.log('处理的 css 文件：' , file);
      //   return 37.5
      // },

      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      // 配置要转换的 CSS 属性
      // * 表示所有
      propList: ['*']
    }
  }
}
