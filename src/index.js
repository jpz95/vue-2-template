import Vue from 'vue';

// Import global styles
import 'styles/';

import Root from './root.vue';

new Vue({
  render: (h) => h(Root),
}).$mount('#root');
