import { defineStore, storeToRefs } from "pinia";
import { getPerformanceDetail } from "@/api/performance";
import { reactive } from "vue";
import { useUserStore } from "@/stores/user";

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
    console.log("查詢條件:", fieldCondition);
    const { startDataMonth, endDataMonth } = fieldCondition;
    console.log("查詢條件:", fieldCondition);
    const payload = {
      ...fieldCondition,
      startDataMonth: startDataMonth.replace("-", ""),
      endDataMonth: endDataMonth.replace("-", ""),
    };

    try {
      const res = await getPerformanceDetail(payload); // Axios 攔截器已處理非 2xx
      return res.data as Blob;
    } catch (e) {
      return Promise.reject("下載報表失敗");
    }
  }

  return {
    fieldCondition,
    fetchPerformanceBlob,
    setAreaCd,
  };
});
