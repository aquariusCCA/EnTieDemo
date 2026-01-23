import { setMany } from "idb-keyval";
import { 
  doLogin, 
  doLogout, 
  doFetchUserInfo 
} from "./jsons/user.json";

import {
  performanceBootstrap,
  performanceDetailPreCheck,
  grmPerformanceDetailPreCheck,
} from "./jsons/performance.json";

import { 
  forecastLoanBootstrap, 
  getForecastLoanList,
  fetchExchangeRate,
  addForecastLoan,
  deleteForecastLoan,
  selectOneForecastLoan,
  getClientdataByClientcd,
  updateForecastLoan
} from "./jsons/forecastLoan.json";

import { 
  forecastDepositBootstrap,
  feorecastDepositExchangeRate,
  addForecastDeposit,
  getForecastDepositList,
  selectOneForecastDeposit,
  updateForecastDeposit,
  deleteForecastDeposit
} from "./jsons/forecastDeposit.json";

const BASE_URL = import.meta.env.VITE_SERVER;

/** 注入假資料 */
export const setSeeds = async () => {
  try {
    await setMany([
      // 這裡設定假資料 json mapping
      // [url, json key]
      [`${BASE_URL}/public/user/login`, doLogin],
      [`${BASE_URL}/user/logout`, doLogout],
      [`${BASE_URL}/user/info`, doFetchUserInfo],
      [`${BASE_URL}/user/info`, doFetchUserInfo],
      [`${BASE_URL}/performance/bootstrap`, performanceBootstrap],
      [`${BASE_URL}/performance/preCheck`, performanceDetailPreCheck],
      [`${BASE_URL}/performance/grmPreCheck`, grmPerformanceDetailPreCheck],
      [`${BASE_URL}/forecast/loan/bootstrap`, forecastLoanBootstrap],
      [`${BASE_URL}/forecast/loan/list`, getForecastLoanList],
      [`${BASE_URL}/forecast/loan/exchangeRate/USD`, fetchExchangeRate],
      [`${BASE_URL}/forecast/loan/add`, addForecastLoan],
      [`${BASE_URL}/forecast/loan/delete/23063`, deleteForecastLoan],
      [`${BASE_URL}/forecast/loan/selectOne/23063`, selectOneForecastLoan],
      [`${BASE_URL}/forecast/loan/clientdata/A123205433`, getClientdataByClientcd],
      [`${BASE_URL}/forecast/loan/update`, updateForecastLoan],
      [`${BASE_URL}/forecast/deposit/bootstrap`, forecastDepositBootstrap],
      [`${BASE_URL}/forecast/deposit/exchangeRate/EUR`, feorecastDepositExchangeRate],
      [`${BASE_URL}/forecast/deposit/add`, addForecastDeposit],
      [`${BASE_URL}/forecast/deposit/list`, getForecastDepositList],
      [`${BASE_URL}/forecast/deposit/selectOne/31`, selectOneForecastDeposit],
      [`${BASE_URL}/forecast/deposit/update`, updateForecastDeposit],
      [`${BASE_URL}/forecast/deposit/delete/31/983`, deleteForecastDeposit],
    ]);
  } catch (err) {
    console.log(err);
  }
};
