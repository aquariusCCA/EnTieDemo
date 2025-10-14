import { defineStore } from "pinia";
import { ref } from "vue";
import { getForecastLoanBootstrap, getForecastLoanListPreCheck } from "@/api/forecastLoan";
import type { ForecastLoanGetListPreCheckParams } from "@/api/forecastLoan";

export const useForecastLoanStore = defineStore("forecastLoan", () => {
  const pageBooststrap = ref({
    propTypeList: [],
    loanTypeList: [],
    currencyTypeList: [],
  });

  async function fetchPageBootstrap() {
    return new Promise((resolve, reject) => {
      getForecastLoanBootstrap()
        .then((response) => {
          pageBooststrap.value = response.data;
          resolve("ok");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function getListPreCheck(params: ForecastLoanGetListPreCheckParams) {
    return new Promise((resolve, reject) => {
      getForecastLoanListPreCheck(params)
        .then((response) => {
          console.log('response', response)
          resolve("ok");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    pageBooststrap,
    fetchPageBootstrap,
    getListPreCheck,
  };
});
