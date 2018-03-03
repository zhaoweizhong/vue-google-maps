

export const doc = {
  loaded: {
    type: 'Promise<google.maps.Map>',
    description: `
Promise resolved once the Google Maps API is loaded.

\`\`\`
new google.maps.Point(100, 100) // 'google' is not defined

loaded.then(() => {
  new google.maps.Point(100, 100) // Yay, success
})
\`\`\`
    `
  },
  MountableMixin: {
    hide: true,
  },
  load: {hide: true},
  install: {hide: true},

  MapElementMixin: {
    description: `
Used to create components.

**Injects:** \`$mapPromise\`

The \`$mapPromise\` can be used to wait for the parent's Google Map to
load. Once it's loaded, the child component can use it to add a component
to the map ([Example](../overlay.html))
    `
  },
  GmapAutocomplete: {
    type: 'VueComponent',
    description: `
This is simply an &lt;INPUT> with the Autocomplete mounted over it.
While you cannot use \`v-model\` on it, you can listen for
\`@place_changed\` and \`@change.native\`
`
  },
  GmapMap: {
    type: 'VueComponent',
    provides: ['$mapPromise'],
    nonReactive: {
      '$mapObject': {
        type: 'google.maps.Map',
        description: 'The underlying Map object'
      }
    },
    methods: {
      panToBounds: {
        type: `google.maps.LatLngBounds =>`,
        description: `Proxies to their corresponding \`$mapObject.*\` functions`,
      },
      resize: {
        description: `Proxy to \`google.maps.event.trigger($mapObject, 'resize')\``,
      },
      resizePreserveCenter: {
        type: '() =>',
        description: `
Proxy to \`google.maps.event.trigger($mapObject, 'resize')\`, but
preserves the center of the map (not needed in newer versions of the Google Maps API)`,
      }
    }
  },
  GmapStreetViewPanorama: {
    type: 'VueComponent',
    provides: ['$panoPromise'],
    nonReactive: {
      '$panoObject': {
        type: 'google.maps.StreetViewPanorama',
      }
    }
  },
  GmapCluster: {
    type: 'VueComponent + MapElementMixin',
    nonReactive: {
      '$clusterObject': {
        type: 'MarkerClusterer',
        description: 'The underlying MarkerClusterer object'
      }
    }
  },
  GmapInfoWindow: {
    type: 'VueComponent + MapElementMixin',
    nonReactive: {
      '$infoWindowObject': {
        type: 'google.maps.InfoWindow',
        description: 'The underlying InfoWindow object'
      }
    }
  },
  GmapMarker: {
    type: 'VueComponent + MapElementMixin',
    nonReactive: {
      '$markerObject': {
        type: 'google.maps.Marker',
        description: 'The underlying Marker object'
      }
    }
  },
  GmapCircle: {
    type: 'VueComponent + MapElementMixin',
    nonReactive: {
      '$circleObject': {
        type: 'google.maps.Circle',
        description: 'The underlying Circle object'
      }
    }
  },
  GmapRectangle: {
    type: 'VueComponent + MapElementMixin',
    nonReactive: {
      '$rectangleObject': {
        type: 'google.maps.Rectangle',
        description: 'The underlying Rectangle object'
      }
    }
  },
  GmapPolyline: {
    type: 'VueComponent + MapElementMixin',
    nonReactive: {
      '$polylineObject': {
        type: 'google.maps.Polyline',
        description: 'The underlying Polyline object'
      }
    }
  },
  GmapPolygon: {
    type: 'VueComponent + MapElementMixin',
    nonReactive: {
      '$polygonObject': {
        type: 'google.maps.Polygon',
        description: 'The underlying Polygon object'
      }
    }
  },
}

export default {
  get (path, what) {
    let current = doc
    for (let p of path) {
      if (current[p])
        current = current[p]
      else
        return false
    }
    return what ? current[what] : current
  }
}
