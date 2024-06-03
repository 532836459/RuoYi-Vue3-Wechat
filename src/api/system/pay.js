import request from '@/utils/request'

export function selectConfigByWay(way) {
  return request({
    url: '/wechat/pay/selectConfigByWay/' + way,
    method: 'get'
  })
}

// 查询支付配置列表
export function listPay(query) {
  return request({
    url: '/wechat/pay/list',
    method: 'get',
    params: query
  })
}

// 查询支付配置详细
export function getPay(id) {
  return request({
    url: '/wechat/pay/' + id,
    method: 'get'
  })
}

// 新增支付配置
export function addPay(data) {
  return request({
    url: '/wechat/pay',
    method: 'post',
    data: data
  })
}

// 修改支付配置
export function updatePay(data) {
  return request({
    url: '/wechat/pay',
    method: 'put',
    data: data
  })
}

// 删除支付配置
export function delPay(id) {
  return request({
    url: '/wechat/pay/' + id,
    method: 'delete'
  })
}
