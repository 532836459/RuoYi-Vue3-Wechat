import request from '@/utils/request'

// 查询公众号菜单
export function mpMenuList() {
    return request({
        url: '/channel/wechatMp/selectMpMenuList',
        method: 'get'
    })
}

// 保存公众号菜单
export function mpMenuSave(data) {
    return request({
        url: '/channel/wechatMp/mpMenuSave',
        method: 'post',
        data: data
    })
}

// 发布公众号菜单
export function mpMenuPublish(data) {
    return request({
        url: '/channel/wechatMp/mpMenuPublish',
        method: 'post',
        data: data
    })
}
