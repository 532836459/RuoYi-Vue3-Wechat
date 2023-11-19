import request from '@/utils/request'

export function getWordpressCategory(query){
  return request({
    url: '/website/manage/getWordpressCategory',
    method: 'get',
    params: query
  })
}

// 查询站点管理列表
export function listManage(query) {
  return request({
    url: '/website/manage/list',
    method: 'get',
    params: query
  })
}

// 查询站点管理详细
export function getManage(id) {
  return request({
    url: '/website/manage/' + id,
    method: 'get'
  })
}

// 新增站点管理
export function addManage(data) {
  return request({
    url: '/website/manage',
    method: 'post',
    data: data
  })
}

// 修改站点管理
export function updateManage(data) {
  return request({
    url: '/website/manage',
    method: 'put',
    data: data
  })
}

// 删除站点管理
export function delManage(id) {
  return request({
    url: '/website/manage/' + id,
    method: 'delete'
  })
}
