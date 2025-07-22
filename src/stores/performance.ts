import { defineStore } from "pinia";
import { getPerformanceDetail } from "@/api/performance";
import { BizError } from "@/utils/request";
import { reactive } from "vue";
import { ElLoading, ElMessage } from "element-plus";
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

function isValidDateRange(start?: string, end?: string): boolean {
  if (!start || !end) return false;
  const startDate = new Date(start + "-01");
  const endDate = new Date(end + "-01");
  return endDate >= startDate;
}

export const usePerformanceStore = defineStore(
  "performance",
  () => {
    const userStore = useUserStore();
    const { extractAreaCd } = userStore;

    const fieldCondition = reactive<FieldCondition>({
      ...initialFieldCondition,
    });

    // 初始化方法
    function resetFieldCondition() {
      fieldCondition.areaCd = "";
      fieldCondition.clientCd = "";
      fieldCondition.rmEmpNr = "";
      fieldCondition.startDataMonth = "";
      fieldCondition.endDataMonth = "";
    }

    // 設置區域中心代碼
    function setAreaCd() {
      fieldCondition.areaCd = extractAreaCd();
    }

    async function fetchPerformanceDetail() {
      console.log("Fetching performance detail with:", fieldCondition);
      const { startDataMonth, endDataMonth } = fieldCondition;

      if (!isValidDateRange(startDataMonth, endDataMonth)) {
        ElMessage.warning("結束月份不可早於起始月份");
        return;
      }

      const loadingInstance = ElLoading.service({
        lock: true,
        text: "報表生成中，請稍候...",
        background: "rgba(0, 0, 0, 0.3)",
      });

      try {
        const payload = {
          ...fieldCondition,
          startDataMonth: startDataMonth.replace("-", ""),
          endDataMonth: endDataMonth.replace("-", ""),
        };

        // 處理 API 回應
        const response = await getPerformanceDetail(payload);
      } catch (error) {
        if (error instanceof BizError) {
          ElMessage.error(error.message);
        }
      } finally {
        loadingInstance.close();
      }
    }

    return {
      fieldCondition,
      fetchPerformanceDetail,
      setAreaCd,
      resetFieldCondition,
    };
  },
  {
    // 啟用持久化
    persist: {
      storage: sessionStorage, // 使用 sessionStorage 來持久化
    },
  }
);
