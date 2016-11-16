/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

/**
  * @class Cluster
  * @prop $clusterObject -- Exposes the marker clusterer to
        descendent Marker classes. Override this if you area
        extending the class
**/

<template>
  <div> <!-- needed because Vue 2 disallows root slot element -->
    <slot></slot>
  </div>
</template>

<script>

import _ from 'lodash';
import Vue from 'vue';
import propsBinder from '../utils/propsBinder.js'
import MapElementMixin from './mapElementMixin';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
require('js-marker-clusterer');

const props = {
  maxZoom: {
    type: Number,
    twoWay: false
  },
  calculator: {
    type: Function,
    twoWay: false
  },
  gridSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Array,
    twoWay: false
  }
};

export default Vue.extend({
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,

  deferredReady () {
    const options = _.clone(this.getPropsValues());
    this.$clusterObject = new MarkerClusterer(this.$map, [], options);

    propsBinder(this, this.$clusterObject, props, {
      afterModelChanged: (a, v) => {
        const oldMarkers = this.$clusterObject.getMarkers();
        this.$clusterObject.clearMarkers();
        this.$clusterObject.addMarkers(oldMarkers);
      }
    });
  },

  detached() {
    this.$clusterObject.clearMarkers();
  },
})

</script>
