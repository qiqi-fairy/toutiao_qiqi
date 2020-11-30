// 导入 模板 vue
import Vue from 'vue'
// 导入 dayjs
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// dayjs 默认语言的英文，我们需要配置为中文
dayjs.locale('zh-cn') // 全局使用

/**
    dayjs() 获取当前最新时间
    console.log(dayjs().format('YYYY-MM-DD')
    console.log(dayjs().from(dayjs('1990'))) // 2 年以前
    dayjs().from(dayjs(), true) // 2 年
    dayjs().fromNow()
    dayjs().to(dayjs())
    dayjs().toNow(
 */
//  定义一个全局过滤器，然后就可以在任何组件的模板中使用了
//  其实过滤器就相当于一个全局可用的方法（仅供模板使用）
// 参数一： 过滤器名cheng
// 参数二： 过滤器函数
// 使用方式：{{ 表达式 | 过滤器名cheng }}
// 管道符的返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
