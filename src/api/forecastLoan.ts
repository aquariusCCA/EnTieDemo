import request from '@/utils/request'

enum API {
    FORECAST_LOAN_BOOTSTRAP_URL = '/api/forecast/loan/bootstrap',
    FORECAST_LOAN_GET_LIST_PRECHECK_URL  = '/api/forecast/loan/preCheck'
}

export interface ForecastLoanGetListPreCheckParams {
    rmEmpNr: string;
    areaCd: string;
    inputRmEmpNr: string;
}

export function getForecastLoanBootstrap() {
    return request({
        url: API.FORECAST_LOAN_BOOTSTRAP_URL,
        method: 'post',
    })
}

export const getForecastLoanListPreCheck = (params: ForecastLoanGetListPreCheckParams) => {
    return request({
        url: API.FORECAST_LOAN_GET_LIST_PRECHECK_URL,
        method: 'post',
        data: params,
    })
}