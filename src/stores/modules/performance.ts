import { defineStore, storeToRefs } from "pinia";
import {
  getPerformanceDetail,
  performanceDetailPreCheck,
  performanceDetailPreCheckForAreaCd,
} from "@/api/performance";
import { reactive } from "vue";
import { useUserStore } from "@/stores/modules/user";

interface FieldCondition {
  clientCd: string;
  rmEmpNr: string;
  areaCd: string;
  startDataMonth: string;
  endDataMonth: string;
}

const initialFieldCondition: FieldCondition = {
  clientCd: "",
  rmEmpNr: "",
  areaCd: "",
  startDataMonth: "",
  endDataMonth: "",
};

export const usePerformanceStore = defineStore("performance", () => {
  const userStore = useUserStore();
  const { areaCd } = storeToRefs(userStore);

  const fieldCondition = reactive<FieldCondition>({
    ...initialFieldCondition,
  });

  // 設置區域中心代碼
  function setAreaCd() {
    fieldCondition.areaCd = areaCd.value || "";
  }

  // 依查詢條件取得績效明細報表 (Blob)
  async function fetchPerformanceBlob(): Promise<Blob> {
    const { startDataMonth, endDataMonth } = fieldCondition;
    const payload = {
      ...fieldCondition,
      startDataMonth: startDataMonth.replace("-", ""),
      endDataMonth: endDataMonth.replace("-", ""),
    };

    try {
      const res = await getPerformanceDetail(payload); // Axios 攔截器已處理非 2xx
      return res.data as Blob;
    } catch (e) {
      console.error("下載報表失敗:", e);
      return Promise.reject(e);
    }
  }

  async function doPerformanceDetailPreCheck() {
    const { startDataMonth, endDataMonth } = fieldCondition;
    const payload = {
      ...fieldCondition,
      startDataMonth: startDataMonth.replace("-", ""),
      endDataMonth: endDataMonth.replace("-", ""),
    };
    const ALLOWED_AREA_SET = new Set(["924", "983"]);
    // 檢查是否為區域中心代碼(不存在於 allowed 中)
    const api = ALLOWED_AREA_SET.has(fieldCondition.areaCd)
      ? performanceDetailPreCheck
      : performanceDetailPreCheckForAreaCd;

      return new Promise((resolve, reject) => {
        api(payload)
          .then((response) => {
            console.log("績效明細預檢查回應:", response);
            const { exist } = response.data;
            resolve(exist);
          })
          .catch((error) => {
            console.error("績效明細預檢查失敗:", error);
            reject(error);
          });
      });
  }

  return {
    fieldCondition,
    fetchPerformanceBlob,
    setAreaCd,
    doPerformanceDetailPreCheck,
  };
});
