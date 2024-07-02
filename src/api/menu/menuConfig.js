import request from '@/utils/request'

// 查询系统所有分类列表
export function selectAllCategory(query) {
  return request({
    url: '/menu/menuConfig/selectAllCategory',
    method: 'get',
    params: query
  })
}
// 查询菜单配置列表
export function listMenuConfig(query) {
  return request({
    url: '/menu/menuConfig/list',
    method: 'get',
    params: query
  })
}

// 查询菜单配置详细
export function getMenuConfig(id) {
  return request({
    url: '/menu/menuConfig/' + id,
    method: 'get'
  })
}

// 新增菜单配置
export function addMenuConfig(data) {
  return request({
    url: '/menu/menuConfig',
    method: 'post',
    data: data
  })
}

// 修改菜单配置
export function updateMenuConfig(data) {
  return request({
    url: '/menu/menuConfig',
    method: 'put',
    data: data
  })
}

// 删除菜单配置
export function delMenuConfig(id) {
  return request({
    url: '/menu/menuConfig/' + id,
    method: 'delete'
  })
}
