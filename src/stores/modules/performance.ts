import { defineStore, storeToRefs } from "pinia";
import {
  getPerformanceDetail,
  performanceDetailPreCheck,
  getGrmPerformanceDetail,
  grmPerformanceDetailPreCheck,
} from "@/api/performance";
import { reactive } from "vue";
import { useUserStore } from "@/stores/modules/user";

interface FieldCondition {
  clientCd: string;
  rmEmpNr: string;
  areaCd: string;
  startDataMonth: string;
  endDataMonth: string;
  dateRangePreset: string;
}

const initialFieldCondition: FieldCondition = {
  clientCd: "",
  rmEmpNr: "",
  areaCd: "",
  startDataMonth: "",
  endDataMonth: "",
  dateRangePreset: "",
};

interface GrmFieldCondition {
  grmId: string
  groupName: string;
  areaCd: string;
  assignedRegion: string
  startDataMonth: string;
  endDataMonth: string;
  dateRangePreset: string;
}

const initialGrmFieldCondition: GrmFieldCondition = {
  grmId: "",
  groupName: "",
  areaCd: "",
  assignedRegion: "",
  startDataMonth: "",
  endDataMonth: "",
  dateRangePreset: "",
}

export const usePerformanceStore = defineStore("performance", () => {
  const userStore = useUserStore();
  const { areaCd, isAreaCenter } = storeToRefs(userStore);

  const fieldCondition = reactive<FieldCondition>({
    ...initialFieldCondition,
  });

  const grmFieldCondition = reactive<GrmFieldCondition>({
    ...initialGrmFieldCondition,
  });

  // 設置區域中心代碼
  function setAreaCd() {
    // 如果是區域中心人員就需要設置
    if (isAreaCenter.value) {
      fieldCondition.areaCd = areaCd.value || "";
      grmFieldCondition.areaCd = areaCd.value || "";
    } else {
      // 否則清空區域中心代碼
      fieldCondition.areaCd = "";
      grmFieldCondition.areaCd = "";
    }
  }

  // 依查詢條件取得績效明細報表 (Blob)
  async function fetchPerformanceBlob(): Promise<Blob> {
    const payload = {
      ...fieldCondition,
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
    const payload = {
      ...fieldCondition,
    };

      return new Promise((resolve, reject) => {
        performanceDetailPreCheck(payload)
          .then((response) => {
            const { exist } = response.data;
            resolve(exist);
          })
          .catch((error) => {
            reject(error);
          });
      });
  }

  // 依查詢條件取得 GRM 績效明細報表 (Blob)
  async function fetchGrmPerformanceBlob(): Promise<Blob> {
    const payload = {
      ...grmFieldCondition,
    };

    const mappingAreaCd: Record<string, string> = {
      "711": "北一區",
      "712": "北二區",
      "713": "北三區",
      "717": "北五區",
      "718": "北六區",
      "722": "北八區",
      "726": "桃竹區",
      "731": "台中區",
      "736": "嘉南區",
      "741": "高屏區",
      "924": "法授部",
      "983": "法業部"
    }

    payload.assignedRegion = mappingAreaCd[payload.areaCd];

    try {
      const res = await getGrmPerformanceDetail(payload); // Axios 攔截器已處理非 2xx
      return res.data as Blob;
    } catch (e) {
      console.error("下載報表失敗:", e);
      return Promise.reject(e);
    }
  }

  async function doGrmPerformanceDetailPreCheck() {
    const payload = {
      ...grmFieldCondition,
    };

    const mappingAreaCd: Record<string, string> = {
      "711": "北一區",
      "712": "北二區",
      "713": "北三區",
      "717": "北五區",
      "718": "北六區",
      "722": "北八區",
      "726": "桃竹區",
      "731": "台中區",
      "736": "嘉南區",
      "741": "高屏區",
      "924": "法授部",
      "983": "法業部"
    }

    payload.assignedRegion = mappingAreaCd[payload.areaCd];

    return new Promise((resolve, reject) => {
      grmPerformanceDetailPreCheck(payload)
        .then((response) => {
          console.log("GRM 績效明細預檢查回應:", response);
          const { exist } = response.data;
          resolve(exist);
        })
        .catch((error) => {
          console.error("GRM 績效明細預檢查失敗:", error);
          reject(error);
        });
    });
  }

  return {
    fieldCondition,
    grmFieldCondition,
    setAreaCd,
    fetchPerformanceBlob,
    doPerformanceDetailPreCheck,
    fetchGrmPerformanceBlob,
    doGrmPerformanceDetailPreCheck,
  };
});
