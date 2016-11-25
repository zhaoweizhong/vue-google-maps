import _ from 'lodash';
import eventsBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'
import MapElementMixin from './mapElementMixin';
import Clusterer from './cluster';
import assert from 'assert';

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
    type: Object,
    twoWay: true
  },
  label: {
  },
  opacity: {
    type: Number,
    default: 1
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
];

var container;

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
  mixins: [MapElementMixin, getPropsValuesMixin],
  props: props,

  component: {
    GmapCluster: Clusterer
  },

  render() { return '' },

  created() {
    let search = this.$findAncestor(
      ans => ans instanceof this.constructor.component('GmapCluster')
    );
    let clusterObjectPromise = null;

    this.$clusterAncestor = search;

    if (search) {
      clusterObjectPromise = search.$deferredReadyPromise
        .then(() => {
          this.$clusterObject = search.$clusterObject;
        })
    }

    this.$clusterObjectPromise = clusterObjectPromise || Promise.resolve(null);
  },

  destroyed() {
    if (!this.$markerObject)
        return;

    if (this.$clusterObject) {
      this.$clusterObject.removeMarker(this.$markerObject);
    }
    else {
      this.$markerObject.setMap(null);
    }
  },

  deferredReady() {
    const options = _.mapValues(props, (value, prop) => this[prop]);
    options.map = this.$map;

    this.$clusterObjectPromise.then(() =>
      this.createMarker(options, this.$map));
  },

  methods: {
    createMarker (options, map) {
      this.$markerObject = new google.maps.Marker(options);
      propsBinder(this, this.$markerObject, props);
      eventsBinder(this, this.$markerObject, events);

      if (this.$clusterObject) {
        this.$clusterObject.addMarker(this.$markerObject);
      }
    }
  },
}
