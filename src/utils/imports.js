import Vue from "vue";

// ElementUI
import ElementUI from 'element-ui';
import '../assets/styles.scss'
import enLang from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  locale: enLang //  set element-ui default language
})

window.$ = window.jQuery = require("jquery");
window.Vue = Vue;
