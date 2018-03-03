window.MarkerClusterer = function () {}

import Vue from 'vue'
import * as VueGoogleMaps from '../../src/main.js'
import API from './API.vue'
import Documentation from './Documentation'
import {doc} from './Documentation'
const _ = require('lodash')
const components = []

function extractSchema(name, v) {
  return {
    props: _.sortBy(Object.keys(v.props || {})),
    nonReactive: _.sortBy(Object.keys(
      (doc[name] && doc[name].nonReactive) || {}
    )),
    events: _.sortBy(Object.keys(v.props || {})
      .filter(p => v.props[p].twoWay).map(x => `${x}_changed`))
      .concat(_.sortBy(v.events || [])),
    methods: _.sortBy(Object.keys(v.methods || {}))
      .filter(p => !p.startsWith('_')),
      provide: doc[name] && doc[name].provide,
    mixins: doc[name] && doc[name].mixins,
  }
}

for (let [key, value] of Object.entries(VueGoogleMaps)) {
  if (key[0] >= 'A' && key[0] <= 'Z') {
    // is a component
    if (VueGoogleMaps[key].render) {
      components.push([
        'Gmap' + key,
        extractSchema('Gmap' + key, VueGoogleMaps[key] || {})
      ])
    } else {
      components.push([
        key,
        extractSchema(key, VueGoogleMaps[key] || {})
      ])
    }
  } else {
    components.push([
      key,
      ''
    ])
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    components: {
      API
    },
    render (h) {
      return h('API', {
        props: {
          components: _.sortBy(components, x => x[0]),
          documentation: Documentation,
        }
      })
    },
    data: {
      components,
    }
  }).$mount('#app')
})
