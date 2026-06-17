import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等认证信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || '请求失败，请稍后重试'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default request

// 本项目为纯前端项目，数据来自本地静态文件
// 以下 API 仅作为示例，实际项目中可以替换为真实的后端接口

export const api = {
  // 获取人物列表
  getPersons: () => {
    // 模拟 API 调用
    return Promise.resolve({ success: true, data: [] })
  },

  // 获取关系列表
  getRelations: () => {
    return Promise.resolve({ success: true, data: [] })
  },

  // 获取时间线事件
  getTimelineEvents: () => {
    return Promise.resolve({ success: true, data: [] })
  }
}
