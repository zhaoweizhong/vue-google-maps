import bindEvents from '../utils/bindEvents.js'
import {bindProps, getPropsValues} from '../utils/bindProps.js'
import MapElementMixin from './mapElementMixin'
import mapElementFactory from './mapElementFactory.js';

/**
 * 
 * @param {Object} options 
 * @param {Object} options.mappedProps - Definitions of props
 * @param {Object} options.mappedProps.PROP.type - Value type
 * @param {Boolean} options.mappedProps.PROP.twoWay
 *  - Whether the prop has a corresponding PROP_changed
 *   event
 * @param {Boolean} options.mappedProps.PROP.noBind
 *  - If true, do not apply the default bindProps / bindEvents.
 * However it will still be added to the list of component props
 * @param {Object} options.props - Regular Vue-style props.
 *  Note: must be in the Object form because it will be
 *  merged with the `mappedProps`
 * 
 * @param {Object} options.events - Google Maps API events
 *  that are not bound to a corresponding prop
 * @param {String} options.name - e.g. `polyline`
 * @param {=> String} options.ctr - constructor, e.g.
 *  `google.maps.Polyline`. However, since this is not
 *  generally available during library load, this becomes
 *  a function instead, e.g. () => google.maps.Polyline
 *  whcih will be called only after the API has been loaded
 * 
 * @param {Object => Any} options.beforeCreate -
 *  Hook to modify the options passed to the initializer
 * @param {(options.ctr, Object) => Any} options.onCreate -
 *  Hook called when 
 *  
 */
export default function (options) {
  const {
    mappedProps,
    name,
    ctr,
    events,
    beforeCreate,
    afterCreate,
    ...rest
  } = options

  const promiseName = `$${name}Promise`
  const instanceName = `$${name}Object`
  
  assert(!(rest.props instanceof Array), "`props` should be an object, not Array")

  return {
    mixins: [MapElementMixin],
    props: {
      ...rest.props,
      mappedPropsToVueProps(mappedProps),
    },
    render () { return '' },
    provide () {
      const promise = this.$mapPromise.then(async (map) => {
        // Initialize the maps with the given options
        const options = {
          ...this.options,
          map,
          getPropsValues(this)
          // FIXME: eliminate the options inside getPropsValues
        }
        
        if (beforeCreate) {
          const result = beforeCreate.bind(this)(options)

          if (result instanceof Promise) {
            await result
          }
        }

        this[instanceName] = (new (ctr()))(options)

        bindProps(this, this[instanceName], props)
        bindEvents(this, this[instanceName], events)

        if (onCreate) {
          onCreate.bind(this)(this[instanceName])
        }
      })
      this[promiseName] = promise
      return {[promiseName]: promise}
    },
    destroyed () {
      // Note: not all Google Maps components support maps
      if (this[instanceName] && this[instanceName].setMap) {
        this[instanceName].setMap(null)
      }
    },
    ...rest
  }
}

function assert(v, message) {
  if (!v) throw new Error(message)
}

/**
 * Strips out the extraneous properties we have in our 
 * props definitions
 * @param {Object} props 
 */
export function mappedPropsToVueProps (mappedProps) {
  return Object.entries(props)
    .map(([key, prop]) => {
      const value = {}

      if ('type' in prop) value.type = prop.type
      if ('default' in prop) value.default = prop.default
      if ('required' in prop) value.required = prop.required

      return [key, {type}]
    })
    .reduce((acc, [key, val]) => {
      acc[key] = val
      return acc
    })
}