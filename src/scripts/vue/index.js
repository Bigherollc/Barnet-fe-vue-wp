import { createApp } from 'vue';

// STORE
import store from './store/';

// COMPONENT
import './components/';

// MODULES
import './modules/';

createApp({
  render: () => null,
}).use(store).mount('#app');

