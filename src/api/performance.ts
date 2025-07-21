import request from '@/utils/request'

enum API {
    PERFORMANCE_DETAIL_URL = '/performance/detail',
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
        data: params
    })
}