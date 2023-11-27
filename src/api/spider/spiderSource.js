import request from '@/utils/request'

// 查询中创采集列表
export function listSpiderSource(query) {
  return request({
    url: '/spider/spiderSource/list',
    method: 'get',
    params: query
  })
}

// 查询中创采集详细
export function getSpiderSource(id) {
  return request({
    url: '/spider/spiderSource/' + id,
    method: 'get'
  })
}

// 新增中创采集
export function addSpiderSource(data) {
  return request({
    url: '/spider/spiderSource',
    method: 'post',
    data: data
  })
}

// 修改中创采集
export function updateSpiderSource(data) {
  return request({
    url: '/spider/spiderSource',
    method: 'put',
    data: data
  })
}

// 删除中创采集
export function delSpiderSource(id) {
  return request({
    url: '/spider/spiderSource/' + id,
    method: 'delete'
  })
}
