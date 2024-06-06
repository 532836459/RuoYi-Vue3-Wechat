import request from '@/utils/request'

// 查询充值订单列表
export function listRechargeOrder(query) {
  return request({
    url: '/wechat/rechargeOrder/list',
    method: 'get',
    params: query
  })
}

// 查询充值订单详细
export function getRechargeOrder(id) {
  return request({
    url: '/wechat/rechargeOrder/' + id,
    method: 'get'
  })
}

// 新增充值订单
export function addRechargeOrder(data) {
  return request({
    url: '/wechat/rechargeOrder',
    method: 'post',
    data: data
  })
}

// 修改充值订单
export function updateRechargeOrder(data) {
  return request({
    url: '/wechat/rechargeOrder',
    method: 'put',
    data: data
  })
}

// 删除充值订单
export function delRechargeOrder(id) {
  return request({
    url: '/wechat/rechargeOrder/' + id,
    method: 'delete'
  })
}
