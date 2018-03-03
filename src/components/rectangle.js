import clone from 'lodash/clone'

import bindEvents from '../utils/bindEvents.js'
import {bindProps, getPropsValues} from '../utils/bindProps.js'
import MapElementMixin from './mapElementMixin'

const props = {
  bounds: {
    type: Object,
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

  render () {
    return ''
  },

  created () {
    this.$mapPromise.then((map) => {
      const options = clone(getPropsValues(this))
      options.map = map
      this._createRectangle(options)
    })
  },

  methods: {
    _createRectangle (options) {
      this.$rectangleObject = new google.maps.Rectangle(options)
      bindProps(this, this.$rectangleObject, props)
      bindEvents(this, this.$rectangleObject, events)
    },

  },

  destroyed () {
    if (this.$rectangleObject) {
      this.$rectangleObject.setMap(null)
    }
  },
  events, // FOR DOCUMENTATION PURPOSES
}
