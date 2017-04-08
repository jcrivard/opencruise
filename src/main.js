// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Toolbar from './components/toolbar'
import Dialog from './components/dialog'

Vue.config.productionTip = false

Vue.component('app-toolbar', Toolbar)
Vue.component('app-dialog', Dialog)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
