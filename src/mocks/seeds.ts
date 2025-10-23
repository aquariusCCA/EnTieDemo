import { setMany } from "idb-keyval";
import { doLogin, doLogout, doFetchUserInfo } from "./jsons/user.json";
import {
  performanceDetailPreCheck,
  grmPerformanceDetailPreCheck,
} from "./jsons/performance.json";
import { 
  forecastLoanBootstrap, 
  getForecastLoanList,
  fetchExchangeRate,
  addForecastLoan,
  deleteForecastLoan
} from "./jsons/forecastLoan.json";

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
      [`${BASE_URL}/performance/preCheck`, performanceDetailPreCheck],
      [`${BASE_URL}/performance/grmPreCheck`, grmPerformanceDetailPreCheck],
      [`${BASE_URL}/forecast/loan/bootstrap`, forecastLoanBootstrap],
      [`${BASE_URL}/forecast/loan/list`, getForecastLoanList],
      [`${BASE_URL}/forecast/loan/exchangeRate/USD`, fetchExchangeRate],
      [`${BASE_URL}/forecast/loan/add`, addForecastLoan],
      [`${BASE_URL}/forecast/loan/delete`, deleteForecastLoan],
    ]);
  } catch (err) {
    console.log(err);
  }
};
