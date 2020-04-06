import Vue from 'vue';

// Import global styles
import './app.css';

import App from './app';

var main = new Vue({
  render: h => h(App)
}).$mount('#app');

if (module.hot) {
  module.hot.accept('./app.vue', () => {
    console.log("accept");
  });
}
