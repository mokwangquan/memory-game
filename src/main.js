// NPM: MAIN
import Vue from "vue";

// PROJECT: MAIN
import App from "./App.vue";
// import store from "./store";

// PROJECT: OTHER
require("./utils/imports");

/**************************************************************************
 * VUE INSTANCE
 **************************************************************************/
Vue.config.productionTip = false;

export default new Vue({
  install: function(Vue) {
    Vue.prototype.$jQuery = require("jquery"); // you'll have this.$jQuery anywhere in your vue project
  },
  // store,
  render: h => h(App)
}).$mount("#app");
