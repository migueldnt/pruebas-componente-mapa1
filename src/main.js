import Vue from 'vue'
import App from './App.vue'

import daiMapComponents from 'dai-map-components'
import "dai-map-components/dist/dai-map-components.css"
import "bulma/bulma.sass"

Vue.use(daiMapComponents);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
