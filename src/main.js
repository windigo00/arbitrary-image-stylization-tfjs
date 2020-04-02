import Vue from 'vue';
//import VueWorker from 'vue-worker';

//Vue.use(VueWorker, '$worker');

Vue.filter("formatInteger", (val) => {
    return Math.round(val);
});

Vue.config.productionTip = false;

import App from  './App.vue';

new Vue({
    render: h => h(App),
}).$mount('#app');