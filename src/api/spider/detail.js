import request from '@/utils/request'

// 查询采集记录列表
export function listDetail(query) {
  return request({
    url: '/spider/detail/list',
    method: 'get',
    params: query
  })
}

// 查询采集记录详细
export function getDetail(id) {
  return request({
    url: '/spider/detail/' + id,
    method: 'get'
  })
}

// 新增采集记录
export function addDetail(data) {
  return request({
    url: '/spider/detail',
    method: 'post',
    data: data
  })
}

// 修改采集记录
export function updateDetail(data) {
  return request({
    url: '/spider/detail',
    method: 'put',
    data: data
  })
}

// 删除采集记录
export function delDetail(id) {
  return request({
    url: '/spider/detail/' + id,
    method: 'delete'
  })
}
