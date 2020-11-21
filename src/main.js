import Vue from 'vue'
import router from './router'
import store from '@/store'
import App from './App.vue'
//markdown插件
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.use(mavonEditor)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = true
/**
 * @description 全局变量
 */
Vue.store = store

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
}).$mount('#app');

