import mapValues from 'lodash/mapValues'
import bindEvents from '../utils/bindEvents.js'
import {bindProps} from '../utils/bindProps.js'
import MapElementMixin from './mapElementMixin'

const props = {
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object,
  },
  clickable: {
    type: Boolean,
    twoWay: true,
    default: true
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true,
    default: false
  },
  icon: {
    twoWay: true
  },
  label: {
  },
  opacity: {
    type: Number,
    default: 1
  },
  options: {
    type: Object
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
    twoWay: true,
  },
  shape: {
    type: Object,
    twoWay: true
  },
  title: {
    type: String,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  },
  visible: {
    twoWay: true,
    default: true,
  },
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

/**
 * @class Marker
 *
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
export default {
  mixins: [MapElementMixin],
  props: props,

  inject: {
    '$clusterPromise': {
      default: null,
    },
  },

  render (h) {
    if (!this.$slots.default || this.$slots.default.length === 0) {
      return ''
    } else if (this.$slots.default.length === 1) { // So that infowindows can have a marker parent
      return this.$slots.default[0]
    } else {
      return h(
        'div',
        this.$slots.default
      )
    }
  },

  destroyed () {
    if (!this.$markerObject) { return }

    if (this.$clusterObject) {
      this.$clusterObject.removeMarker(this.$markerObject, true)
    } else {
      this.$markerObject.setMap(null)
    }
  },

  provide () {
    const markerPromise = this.$mapPromise.then((map) => {
      const options = mapValues(props, (value, prop) => this[prop])
      options.map = map
      delete options.options
      Object.assign(options, this.options)

      // search ancestors for cluster object
      const clusterPromise = this.$clusterPromise
        ? this.$clusterPromise.then(co => {
          this.$clusterObject = co
          return co
        })
        : Promise.resolve(null)

      return clusterPromise.then(() => {
        const marker = this._createMarker(options)
        this.$markerObject = marker
        return marker
      })
    })

    return {
      '$markerPromise': markerPromise
    }
  },

  methods: {
    _createMarker (options) {
      const markerObject = new google.maps.Marker(options)
      bindProps(this, markerObject, props)
      bindEvents(this, markerObject, events)

      if (this.$clusterObject) {
        this.$clusterObject.addMarker(markerObject)
      }
      return markerObject
    }
  },

  events, // FOR DOCUMENTATION PURPOSES
}
