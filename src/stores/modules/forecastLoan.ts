import { defineStore } from "pinia";
import { ref } from "vue";
import { getForecastLoanBootstrap } from "@/api/forecastLoan";

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
          console.log("獲取預測貸款頁面初始化數據:", response);
          pageBooststrap.value = response.data;
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
  };
});
