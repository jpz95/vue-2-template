import Vue from 'vue';

// Import global styles
import 'styles/';

// import router from 'routes';
// import store from 'store';

import Root from './root.vue';

new Vue({
  render: (h) => h(Root),
  // router,
  // store,
}).$mount('#root');
