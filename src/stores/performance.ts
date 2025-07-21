import { defineStore } from "pinia";
import { getPerformanceDetail } from "@/api/performance";
import { BizError } from "@/utils/request";
import { reactive } from "vue";
import { ElLoading, ElMessage } from "element-plus";

const initFieldCondition = {
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
    const fieldCondition = reactive({ ...initFieldCondition });

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
        // loadingInstance.close();
        setTimeout(() => {
          loadingInstance.close();
        }, 2000);
      }
    }

    return {
      fieldCondition,
      fetchPerformanceDetail,
    };
  },
  {
    // 啟用持久化
    persist: {
      storage: sessionStorage, // 使用 sessionStorage 來持久化
    },
  }
);
