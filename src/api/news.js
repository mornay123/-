import request from '@/utils/request'

/**
 *
 * @param {String |Number} id 频道的id
 * @param {Number} timeStamp 新的推荐数据当前的时间戳
 * @returns
 */
export const getArticles = (id, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: id,
      timestamp
    }
  })
}
