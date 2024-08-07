import request from '@/utils/request'

// 查询文章抓取记录列表
export function listSpiderArticle(query) {
  return request({
    url: '/article/spiderArticle/list',
    method: 'get',
    params: query
  })
}

// 查询文章抓取记录详细
export function getSpiderArticle(id) {
  return request({
    url: '/article/spiderArticle/' + id,
    method: 'get'
  })
}

// 新增文章抓取记录
export function addSpiderArticle(data) {
  return request({
    url: '/article/spiderArticle',
    method: 'post',
    data: data
  })
}

// 修改文章抓取记录
export function updateSpiderArticle(data) {
  return request({
    url: '/article/spiderArticle',
    method: 'put',
    data: data
  })
}

// 删除文章抓取记录
export function delSpiderArticle(id) {
  return request({
    url: '/article/spiderArticle/' + id,
    method: 'delete'
  })
}
