import request from '@/utils/request'
/**
 * 获取搜索建议
 * @param {String} q 关键词
 * @returns Promise
 */
export const getSuggestionsAPI = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
/**
 * 获取搜索结果
 * @param {Number} page 分页页数，不写默认是1
 * @param {Number} per_page 每一页的数量
 * @param {String} q 关键词
 * @returns Promise
 */
export const getResultsAPI = (/* eslint-disable-line */ page, per_page, q) => {
  return request({
    url: '/v1_0/search',
    params: {
      page,
      per_page,
      q
    }
  })
}
