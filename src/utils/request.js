/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

// JSON.parse()
// JSON.stringify()

// JSONBig 可以处理数据中超过 JavaScript 安全整数范围的问题
// JSONBig.parse() // 把 JSON 格式的字符串转为 JavaScript 对象
// JSONBig.stringify() // 把 JavaScript 对象转为 JSON 格式的字符串

// const jsonStr = '{"art_id": 1245953273786007552}'

// console.log(JSONBig.parse(jsonStr))

// // 使用的时候需要把 BigNumber 类型的数据转为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString()) // request.js?b775:20 1245953273786007552
// console.log(JSONBig.stringify(JSONBig.parse(jsonStr))) // 把JavaScript 对象转为JSON格式的字符串

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 接口的基准路径

  // 自定义后端返回的原始数据
  // data: 后端返回的原始数据，说白了就是 JSON 格式的字符串
  transformResponse: [
    function(data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }

      // axios 默认会在内部这样来处理后端返回的数据
      // return JSON.parse(data)
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  function(config) {
    // 请求发起会经过这里
    // config: 本次请求的请求配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // console.log(config)

    // 注意： 这里务必返回 config 配置对象，否则请求停在这里出不去
    return config
  },
  function(error) {
    // 如果请求出错流程（还没发出去）会进入这里
    return Promise.reject(error)
  }
)
// 响应拦截器

export default request
