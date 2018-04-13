/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

/**
  * @class Cluster
  * @prop $clusterObject -- Exposes the marker clusterer to
        descendent Marker classes. Override this if you area
        extending the class
**/

import clone from 'lodash/clone'
import bindEvents from '../utils/bindEvents.js'
import {bindProps, getPropsValues} from '../utils/bindProps.js'
import MapElementMixin from './mapElementMixin'
import MarkerClusterer from 'marker-clusterer-plus'
import mapElementFactory from './mapElementFactory.js';

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
  minimumClusterSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Array,
    twoWay: false
  },
  zoomOnClick: {
    type: Boolean,
    twoWay: false
  }
}

const events = [
  'click',
  'rightclick',
  'dblclick',
  'drag',
  'dragstart',
  'dragend',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout'
]

export default mapElementFactory({
  mappedProps: props,
  events,
  name: 'cluster',
  ctr: () => {
    if (typeof MarkerClusterer === 'undefined') {
      /* eslint-disable no-console */
      console.error('MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js')
      throw new Error('MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js')
    }
    return MarkerClusterer
  },

  render (h) {
    // <div><slot></slot></div>
    return h(
      'div',
      this.$slots.default
    )
  },

  // Override the default `provide()`, because
  // MarkerClusterer has a special way of calling the constructor
  provide () {
    const clusterPromise = this.$mapPromise.then((map) => {
      this.$clusterObject = new MarkerClusterer(map, [], options)

      bindProps(this, this.$clusterObject, props)
      bindEvents(this, this.$clusterObject, events)

      const reinsertMarkers = () => {
        const oldMarkers = this.$clusterObject.getMarkers()
        this.$clusterObject.clearMarkers()
        this.$clusterObject.addMarkers(oldMarkers)
      }

      // After model changed, update everything
      for (let prop in props) {
        if (props[prop].twoWay) {
          this.$on(prop.toLowerCase() + '_changed', reinsertMarkers)
        }
      }

      return this.$clusterObject
    })

    this.$clusterPromise = clusterPromise
    
    return {
      $clusterPromise: clusterPromise
    }
  },

  updated () {
    this.$clusterObject.repaint()
  },

  beforeDestroy () {
    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach(marker => {
      if (marker.$clusterObject === this.$clusterObject) {
        marker.$clusterObject = null
      }
    })

    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers()
    }
  },
})
