import request from '@/utils/request'

// 查询站点配置列表
export function listDomainConfig(query) {
  return request({
    url: '/system/domainConfig/list',
    method: 'get',
    params: query
  })
}

// 查询站点配置详细
export function getDomainConfig(id) {
  return request({
    url: '/system/domainConfig/' + id,
    method: 'get'
  })
}

// 新增站点配置
export function addDomainConfig(data) {
  return request({
    url: '/system/domainConfig',
    method: 'post',
    data: data
  })
}

// 修改站点配置
export function updateDomainConfig(data) {
  return request({
    url: '/system/domainConfig',
    method: 'put',
    data: data
  })
}

// 删除站点配置
export function delDomainConfig(id) {
  return request({
    url: '/system/domainConfig/' + id,
    method: 'delete'
  })
}
