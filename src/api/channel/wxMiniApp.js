import request from "@/utils/request.js";

// 查询小程序配置
export function getMiniAppConfig() {
    return request({
        url: '/channel/wechatMiniApp/getMiniAppConfig',
        method: 'get'
    })
}

// 保存公众号配置
export function saveMiniAppConfig(data) {
    return request({
        url: '/channel/wechatMiniApp/saveMiniAppConfig',
        method: 'post',
        data: data
    })
}