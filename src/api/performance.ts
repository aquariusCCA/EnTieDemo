import request from '@/utils/request'

enum API {
    PERFORMANCE_DETAIL_URL = '/performance/detail',
    PERFORMANCE_DETAIL_PRECHECK_URL = '/performance/preCheck',
    PERFORMANCE_DETAIL_PRECHECK_FOR_AREACD_URL = '/performance/preCheckForAreaCd',
    PERFORMANCE_GRM_DETAIL_URL = '/performance/grmDetail',
    PERFORMANCE_GRM_DETAIL_PRECHECK_URL = '/performance/grmPreCheck',
    PERFORMANCE_GRM_DETAIL_PRECHECK_FOR_AREACD_URL = '/performance/grmPreCheckForAreaCd'
}

export interface PerformanceDetailParams {
    clientCd: string;
    rmEmpNr: string;
    areaCd: string;
    startDataMonth: string;
    endDataMonth: string;
}

export interface GrmPerformanceDetailParams {
    grmId: string;
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


export const getGrmPerformanceDetail = (params: GrmPerformanceDetailParams) => {
    return request({
        url: API.PERFORMANCE_GRM_DETAIL_URL,
        method: 'post',
        data: params,
        responseType: 'blob',                // 以二進位方式接收
    })
}

export const grmPerformanceDetailPreCheck = (params: GrmPerformanceDetailParams) => {
    return request({
        url: API.PERFORMANCE_GRM_DETAIL_PRECHECK_URL,
        method: 'post',
        data: params,
    })
}

export const grmPerformanceDetailPreCheckForAreaCd = (params: GrmPerformanceDetailParams) => {
    return request({
        url: API.PERFORMANCE_GRM_DETAIL_PRECHECK_FOR_AREACD_URL,
        method: 'post',
        data: params,
    })
}
