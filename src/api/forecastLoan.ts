import request from '@/utils/request'

enum API {
    FORECAST_LOAN_BOOTSTRAP_URL = '/api/forecast/loan/bootstrap'
}

export function getForecastLoanBootstrap() {
    return request({
        url: API.FORECAST_LOAN_BOOTSTRAP_URL,
        method: 'post',
    })
}
