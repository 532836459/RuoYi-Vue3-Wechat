import request from '@/utils/request'

// 查询激活码列表
export function listActiveCode(query) {
  return request({
    url: '/code/activeCode/list',
    method: 'get',
    params: query
  })
}

// 查询激活码详细
export function getActiveCode(id) {
  return request({
    url: '/code/activeCode/' + id,
    method: 'get'
  })
}

// 新增激活码
export function addActiveCode(data) {
  return request({
    url: '/code/activeCode',
    method: 'post',
    data: data
  })
}

// 修改激活码
export function updateActiveCode(data) {
  return request({
    url: '/code/activeCode',
    method: 'put',
    data: data
  })
}

// 删除激活码
export function delActiveCode(id) {
  return request({
    url: '/code/activeCode/' + id,
    method: 'delete'
  })
}
