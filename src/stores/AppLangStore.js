import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import axios from "axios";
export const useAppLangStore = defineStore("appLangStore", {
  state: () => ({
    appLang: useStorage("appLang", "ar"),
    isRtl: useStorage("isRtl", false),
  }),
  getters: {
    getAppLang() {
      return this.appLang;
    },
    getAppRtl() {
      return this.isRtl;
    },
  },
  actions: {
    setAppLang(locale) {
      this.appLang = locale;
      // axios.defaults.headers.common["lang"] = localStorage.getItem("appLang");
      axios
        .post("/api/set-language", { lang: locale })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setAppRtl(isRtl) {
      this.isRtl = isRtl;
    },
  },
});
