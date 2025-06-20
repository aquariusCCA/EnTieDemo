import { ref, watch } from "vue";
import { useWindowSize } from "@vueuse/core";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  // 是否展開側邊欄
  const { width } = useWindowSize();
  const isCollapse = ref(false); // 側邊欄是否折疊，默認為折疊狀態

  function toggleCollapse() {
    isCollapse.value = !isCollapse.value;
  }

  watch(
    width,
    (newWidth) => {
        if (newWidth < 1024) {
            isCollapse.value = true;
        } else {
            isCollapse.value = false;
        }
    },
    { immediate: true }
  );

  return {
    isCollapse,
    toggleCollapse,
  };
});
