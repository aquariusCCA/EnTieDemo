import request from '@/utils/request'

enum API {
    FORECAST_DEPOSIT_BOOTSTRAP_URL = '/forecast/deposit/bootstrap',
    FORECAST_DEPOSIT_GET_EXCHANGE_RATE = '/forecast/deposit/exchangeRate',
    FORECAST_DEPOSIT_ADD = '/forecast/deposit/add',
    FORECAST_DEPOSIT_GET_LIST = '/forecast/deposit/list',
}

export function getForecastDepositBootstrap() {
    return request({
        url: API.FORECAST_DEPOSIT_BOOTSTRAP_URL,
        method: 'post',
    })
}

export const fetchExchangeRate = (crncyCode: string) => {
    return request({
        url: API.FORECAST_DEPOSIT_GET_EXCHANGE_RATE + `/${crncyCode}`,
        method: 'post',
    })
}

export interface AddForecastDepositDTO {
    areaCd: string;
    rmEmpNo: string;
    demandType: string;
    clientNameC: string;
    currencyType: string;
    demandDate: string;
    exchangeRate: number;
    demandAmt: number;
    demandAmtTwd: number;
    depositDescription: string;
}

export const addForecastDeposit = (data: AddForecastDepositDTO) => {
    return request({
        url: API.FORECAST_DEPOSIT_ADD,
        method: 'post',
        data
    })
}

export interface ForecastDepositSelectDTO {
    rmEmpNo: string;
    areaCd: string;
    inputRmEmpNo: string;
    pageNum: number;
    pageSize: number;
}

export const getForecastDepositList = (params: ForecastDepositSelectDTO): Promise<any> => {
    return request({
        url: API.FORECAST_DEPOSIT_GET_LIST,
        method: 'post',
        data: params
    })
}