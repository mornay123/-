//  安装，引入，配置，导出 axios
import axios from 'axios'
import store from '@/store'
// axios.defaults.baseURL = 'http://toutiao.itheima.net'
// axios.defaults.timeout = 5000

const request = axios.create({
  timeout: 5000,
  baseURL: 'http://toutiao.itheima.net'
})
request.interceptors.request.use(function (config) {
  const {
    getters: { isLogin },
    state: { tokenObj }
  } = store
  if (isLogin) {
    config.headers.Authorization = `Bearer ${tokenObj.token}`
  }
  return config
})
// request.interceptors.request.use(
//   function (config) {
//     const { tokenObj } = store.state
//     if (tokenObj && tokenObj.token) {
//       config.headers.Authorization = `Bearer ${tokenObj.token}`
//     }
//     return config
//   },
//   function (error) {
//     return Promise.reject(error)
//   }
// )
export default request
