import request from '@/utils/request'

// 查询同步管理列表
export function listRecords(query) {
  return request({
    url: '/website/records/list',
    method: 'get',
    params: query
  })
}

// 查询同步管理详细
export function getRecords(id) {
  return request({
    url: '/website/records/' + id,
    method: 'get'
  })
}

// 新增同步管理
export function addRecords(data) {
  return request({
    url: '/website/records',
    method: 'post',
    data: data
  })
}

// 修改同步管理
export function updateRecords(data) {
  return request({
    url: '/website/records',
    method: 'put',
    data: data
  })
}

// 删除同步管理
export function delRecords(id) {
  return request({
    url: '/website/records/' + id,
    method: 'delete'
  })
}

// 批量同步
export function sync(id) {
  return request({
    url: '/website/records/sync/' + id,
    method: 'get'
  })
}

