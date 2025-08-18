import request from '@/utils/request'

enum API {
    PERFORMANCE_DETAIL_URL = '/performance/detail',
    PERFORMANCE_DETAIL_PRECHECK_URL = '/performance/preCheck',
    PERFORMANCE_DETAIL_PRECHECK_FOR_AREACD_URL = '/performance/preCheckForAreaCd',
}

export interface PerformanceDetailParams {
    clientCd: string;
    rmEmpNr: string;
    areaCd: string;
    startDataMonth: string;
    endDataMonth: string;
}

export const getPerformanceDetail = (params: PerformanceDetailParams) => {
    return request({
        url: API.PERFORMANCE_DETAIL_URL,
        method: 'post',
        data: params,
        responseType: 'blob',                // 以二進位方式接收
    })
}

export const performanceDetailPreCheck = (params: PerformanceDetailParams) => {
    return request({
        url: API.PERFORMANCE_DETAIL_PRECHECK_URL,
        method: 'post',
        data: params,
    })
}

export const performanceDetailPreCheckForAreaCd = (params: PerformanceDetailParams) => {
    return request({
        url: API.PERFORMANCE_DETAIL_PRECHECK_FOR_AREACD_URL,
        method: 'post',
        data: params,
    })
}