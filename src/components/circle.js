import clone from 'lodash/clone'

import bindEvents from '../utils/bindEvents.js'
import {bindProps, getPropsValues} from '../utils/bindProps.js'
import MapElementMixin from './mapElementMixin'

const props = {
  center: {
    type: Object,
    twoWay: true,
    required: true
  },
  radius: {
    type: Number,
    default: 1000,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    twoWay: false
  }
}

const events = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'rightclick'
]

export default {
  mixins: [MapElementMixin],
  props: props,
  version: 2,

  render () { return '' },

  created () {
    this.$mapPromise.then((map) => {
      const options = clone(getPropsValues(this))
      options.map = map
      delete options.bounds
      this._createCircle(options)
    })
  },

  methods: {
    _createCircle (options) {
      this.$circleObject = new google.maps.Circle(options)
      // we cant bind bounds because there is no `setBounds` method
      // on the Circle object
      const boundProps = clone(props)
      delete boundProps.bounds
      bindProps(this, this.$circleObject, boundProps)
      bindEvents(this, this.$circleObject, events)

      const updateBounds = () => {
        this.$emit('bounds_changed', this.$circleObject.getBounds())
      }

      this.$on('radius_changed', updateBounds)
      this.$on('center_changed', updateBounds)
    }
  },

  destroyed () {
    if (this.$circleObject) {
      this.$circleObject.setMap(null)
    }
  },
  events, // FOR DOCUMENTATION PURPOSES
}
