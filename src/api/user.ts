import request from '@/utils/request'

//枚举请求地址，（定义常量）
enum API {
    LOGIN_URL = '/login',
}

// 定義登錄請求參數接口
export interface LoginParams {
    empId: string;
    password: string;
}

// 暴露请求函数
// 登录
export const doLogin =  (data: LoginParams) => {
    return request({
        url: API.LOGIN_URL,
        method: 'post',
        data
    })
}