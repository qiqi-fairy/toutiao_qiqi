import request from '@/utils/request'

/***
 * 获取联想建议
 */
export const getSearhSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 * 获取搜索结果
 */
export const getSearhResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
