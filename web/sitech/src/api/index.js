import request from './request'

export const authApi = {
  login: (data) => request.post('/api/user/login', data),
  register: (data) => request.post('/api/user/register', data),
  logout: () => request.post('/api/user/logout'),
  resetPassword: (data) => request.post('/api/user/reset-password', data),
  sendVerifyCode: (email) => request.post('/api/user/send-verification-code', { email }),
  getUserInfo: () => request.get('/api/user/info'),
  updateUser: (data) => request.put('/api/user/update', data),
  updatePassword: (data) => request.put('/api/user/password', data)
}

export const channelApi = {
  getList: (params) => request.get('/api/channel/list', { params }),
  getAll: () => request.get('/api/channel/all'),
  getModels: () => request.get('/api/channel/models'),
  add: (data) => request.post('/api/channel/add', data),
  update: (data) => request.put('/api/channel/update', data),
  delete: (id) => request.delete(`/api/channel/${id}`),
  test: (id) => request.get(`/api/channel/test/${id}`),
  updateStatus: (id, status) => request.put(`/api/channel/${id}/status`, { status })
}

export const tokenApi = {
  getList: (params) => request.get('/api/token/list', { params }),
  add: (data) => request.post('/api/token/add', data),
  update: (data) => request.put('/api/token/update', data),
  delete: (id) => request.delete(`/api/token/${id}`),
  reset: (id) => request.post(`/api/token/${id}/reset`)
}

export const userApi = {
  getList: (params) => request.get('/api/user/list', { params }),
  add: (data) => request.post('/api/user/add', data),
  update: (data) => request.put('/api/user/update', data),
  delete: (id) => request.delete(`/api/user/${id}`),
  topup: (data) => request.post('/api/topup', data)
}

export const logApi = {
  getList: (params) => request.get('/api/log/list', { params }),
  getChannels: () => request.get('/api/channel/all')
}

export const redemptionApi = {
  getList: (params) => request.get('/api/redemption/list', { params }),
  add: (data) => request.post('/api/redemption/add', data),
  update: (data) => request.put('/api/redemption/update', data),
  delete: (id) => request.delete(`/api/redemption/${id}`),
  redeem: (key) => request.post('/api/redemption/redeem', { key })
}

export const optionApi = {
  getAll: () => request.get('/api/option/all'),
  update: (data) => request.put('/api/option/update', data)
}

export const systemApi = {
  getHomeData: () => request.get('/api/home'),
  getAbout: () => request.get('/api/about')
}
