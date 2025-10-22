import request from '@/utils/request'

enum API {
    FORECAST_LOAN_BOOTSTRAP_URL = '/forecast/loan/bootstrap',
    FORECAST_LOAN_GET_LIST = '/forecast/loan/list'   
}

export interface ForecastLoanSelectDTO {
    rmEmpNr: string;
    areaCd: string;
    inputRmEmpNr: string;
    pageNum: number;
    pageSize: number;
}

export function getForecastLoanBootstrap() {
    return request({
        url: API.FORECAST_LOAN_BOOTSTRAP_URL,
        method: 'post',
    })
}

export interface ForecastLoanListResponse {
    list: Array<any>;
    total: number;
}

export const getForecastLoanList = (params: ForecastLoanSelectDTO): Promise<any> => {
    return request({
        url: API.FORECAST_LOAN_GET_LIST,
        method: 'post',
        data: params
    })
}