import request from '@/utils/request'

enum API {
    FORECAST_LOAN_BOOTSTRAP_URL = '/forecast/loan/bootstrap',
    FORECAST_LOAN_GET_LIST = '/forecast/loan/list',
    FORECAST_LOAN_GET_EXCHANGE_RATE = '/forecast/loan/exchangeRate',
    FORECAST_LOAN_ADD = '/forecast/loan/add',
    FORECAST_LOAN_DELETE = '/forecast/loan/delete',
    FORECAST_LOAN_SELECT_ONE = '/forecast/loan/selectOne',
    FORECAST_LOAN_GET_CLIENT_DATA = '/forecast/loan/clientdata',
    FORECAST_LOAN_UPDATE = '/forecast/loan/update',
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

export const fetchExchangeRate = (crncyCode: string) => {
    return request({
        url: API.FORECAST_LOAN_GET_EXCHANGE_RATE + `/${crncyCode}`,
        method: 'post',
    })
}

export interface AddForecastLoanDTO {
    areaCd: string;
    rmempnr: string;
    demandtype: string;
    proptype: string;
    clientcd: string;
    loantype: string;
    clientnamec: string;
    demanddate: string;
    currencytype: string;
    exchangeRate: number;
    demandamt: number;
    loandescription: string;
}

export const addForecastLoan = (data: AddForecastLoanDTO) => {
    return request({
        url: API.FORECAST_LOAN_ADD,
        method: 'post',
        data
    })
}

export interface DeleteForecastLoanDTO {
    sid: number;
}

export const deleteForecastLoan = (data: DeleteForecastLoanDTO) => {
    return request({
        url: API.FORECAST_LOAN_DELETE + `/${data.sid}`,
        method: 'post'
    })
}

export interface SelectOneForecastLoanDTO {
    sid: number;
}

export const selectOneForecastLoan = (data: SelectOneForecastLoanDTO) => {
    return request({
        url: API.FORECAST_LOAN_SELECT_ONE + `/${data.sid}`,
        method: 'post',
    })
}

export interface GetClientdataByClientcdDTO {
    clientcd: string;
}

export const getClientdataByClientcd = (data: GetClientdataByClientcdDTO) => {
    return request({
        url: API.FORECAST_LOAN_GET_CLIENT_DATA + `/${data.clientcd}`,
        method: 'post',
    })
}

interface UpdateForecastLoanDTO {
    areaCd: string;
    sid: number;
    rmempnr: string;
    demandtype: string;
    proptype: string;
    clientcd: string;
    loantype: string;
    clientnamec: string;
    demanddate: string;
    currencytype: string;
    exchangeRate: number;
    demandamt: number;
    loandescription: string;
}


export const updateForecastLoan = (data: UpdateForecastLoanDTO) => {
    return request({
        url: API.FORECAST_LOAN_UPDATE,
        method: 'post',
        data
    })
}