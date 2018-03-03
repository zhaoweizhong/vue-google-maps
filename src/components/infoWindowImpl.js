import omit from 'lodash/omit'
import clone from 'lodash/clone'
import {bindProps, getPropsValues} from '../utils/bindProps.js'
import bindEvents from '../utils/bindEvents.js'
import MapElementMixin from './mapElementMixin'

const props = {
  options: {
    type: Object,
    required: false,
    default () {
      return {}
    }
  },
  opened: {
    type: Boolean,
    default: true,
  },
  position: {
    type: Object,
    twoWay: true,
  },
  zIndex: {
    type: Number,
    twoWay: true,
  }
}

const events = [
  'domready',
  'closeclick',
  'content_changed',
]

export default {
  mixins: [MapElementMixin],
  replace: false,
  props: props,

  inject: {
    '$markerPromise': {
      default: null,
    }
  },

  mounted () {
    const el = this.$refs.flyaway
    el.parentNode.removeChild(el)
  },

  created () {
    const markerPromise = this.$markerPromise
      ? this.$markerPromise.then(mo => this.$markerObject = mo)
      : Promise.resolve(null)

    const mapPromise = this.$mapPromise

    return mapPromise
      .then(map => this.$map = map)
      .then(() => markerPromise)
      .then(() => this.createInfoWindow())
  },

  destroyed () {
    if (this.disconnect) {
      this.disconnect()
    }
    if (this.$infoWindow) {
      this.$infoWindow.setMap(null)
    }
  },

  methods: {
    openInfoWindow () {
      if (this.opened) {
        if (this.$markerObject !== null) {
          this.$infoWindow.open(this.$map, this.$markerObject)
        } else {
          this.$infoWindow.open(this.$map)
        }
      } else {
        this.$infoWindow.close()
      }
    },

    createInfoWindow () {
      // setting options
      const options = clone(this.options)
      options.content = this.$refs.flyaway

      // only set the position if the info window is not bound to a marker
      if (this.$markerComponent === null) {
        options.position = this.position
      }

      this.$infoWindow = new google.maps.InfoWindow(options)

      // Binding
      bindProps(this, this.$infoWindow, omit(props, ['opened']))
      bindEvents(this, this.$infoWindow, events)

      this.openInfoWindow()
      this.$watch('opened', () => {
        this.openInfoWindow()
      })
    }
  },
  events, // FOR DOCUMENTATION PURPOSES
}
