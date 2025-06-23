import request from '@/utils/request'

//枚举请求地址，（定义常量）
enum API {
    LOGIN_URL = '/user/doLogin',
}
// 暴露请求函数
// 登录
export const doLogin =  (data: any) => {
    return request({
        url: API.LOGIN_URL,
        method: 'post',
        data
    })
}