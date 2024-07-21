import request from '@/utils/request'

// 查询免费工具列表
export function listTools(query) {
  return request({
    url: '/website/tools/list',
    method: 'get',
    params: query
  })
}

// 查询免费工具详细
export function getTools(id) {
  return request({
    url: '/website/tools/' + id,
    method: 'get'
  })
}

// 新增免费工具
export function addTools(data) {
  return request({
    url: '/website/tools',
    method: 'post',
    data: data
  })
}

// 修改免费工具
export function updateTools(data) {
  return request({
    url: '/website/tools',
    method: 'put',
    data: data
  })
}

// 删除免费工具
export function delTools(id) {
  return request({
    url: '/website/tools/' + id,
    method: 'delete'
  })
}
