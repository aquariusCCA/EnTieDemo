import request from '@/utils/request'

enum API {
    LOGIN_URL = '/public/user/login',
    LOUGOUT_URL = '/user/logout',
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

// 登出
export const doLogout = () => {
    return request({
        url: API.LOUGOUT_URL,
        method: 'post'
    })
}