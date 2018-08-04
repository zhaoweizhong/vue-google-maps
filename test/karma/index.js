
import Vue from 'vue'
import 'babel-polyfill'
Vue.config.productionTip = false

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)

const VueGoogleMaps = require('../../src/main')

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc'
  }
})
