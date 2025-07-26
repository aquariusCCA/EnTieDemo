import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingStore = defineStore(
  "setting",
  () => {
    const fold = ref(false);
    const refresh = ref(false);
    const dark = ref(localStorage.getItem("dark") == "true");
    const color = ref(localStorage.getItem("color") || "rgb(30, 144, 255)");

    function changeFold() {
      fold.value = !fold.value;
    }
    function changeRefresh() {
      refresh.value = !refresh.value;
    }
    function changeDark() {
      localStorage.setItem("dark", String(dark.value));
    }
    function changeColor() {
      localStorage.setItem("color", String(color.value));
    }
    return {
      fold,
      refresh,
      dark,
      color,
      changeFold,
      changeRefresh,
      changeDark,
      changeColor,
    };
  }
);
