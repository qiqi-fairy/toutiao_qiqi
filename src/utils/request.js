/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 接口的基准路径
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
