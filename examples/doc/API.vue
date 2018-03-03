<template>
  <div id="app">
    <h1>Table of Contents</h1>
    <ul>
      <li v-for="[name, defn] in visibleComponents">
        <a :href="`#${genId([name])}`">
          {{name}}
          <template v-if="documentation.get([name], 'type')">
            : {{documentation.get([name]).type}}
          </template>
        </a>
      </li>
    </ul>


    <div v-if="documentation.preamble"
      v-html="markdown(documentation.preamble)"
      >
    </div>

    <template v-for="[name, defn] in visibleComponents">
      <h1 :id="genId([name])">
        <code>
          {{name}}
          <template v-if="documentation.get([name], 'type')">
            : {{documentation.get([name]).type}}
          </template>
        </code>
      </h1>

      <div v-if="documentation.get([name], 'description')"
        v-html="markdown(documentation.get([name], 'description'))"
        >
      </div>

      <template v-if="defn.mixins && defn.mixins.length > 0">
        <h2>Mixins:</h2>
        <ul>
          <li v-for="mixin in defn.mixins">
            <code>{{mixin}}</code>
          </li>
        </ul>
      </template>

      <template v-if="defn.nonReactive && defn.nonReactive.length > 0">
        <h2>Non-reactive Props</h2>
        <ul>
          <li v-for="prop of defn.nonReactive">
            <code>
              {{ prop }}
              <template v-if="documentation.get([name, 'nonReactive', prop])">
                : {{documentation.get([name, 'nonReactive', prop]).type}}
              </template>
            </code>
            <template v-if="documentation.get([name, 'nonReactive', prop])">
              {{documentation.get([name, 'nonReactive', prop]).description}}
            </template>
          </li>
        </ul>
      </template>

      <template v-if="defn.props && defn.props.length > 0">
        <h2>Props</h2>
        <ul>
          <li v-for="prop of defn.props">
            <code>
              {{ prop }}
              <template v-if="documentation.get([name, prop])">
                : {{documentation.get([name, prop]).type}}
              </template>
            </code>
            <template v-if="documentation.get([name, prop])">
              {{documentation.get([name, prop]).description}}
            </template>
          </li>
        </ul>
      </template>
      <template v-if="defn.events && defn.events.length > 0">
        <h2>Events</h2>
        <ul>
          <li v-for="prop of defn.events">
            <code>
              {{ prop }}
              <template v-if="documentation.get([name, 'events', prop])">
                : {{documentation.get([name, 'events', prop]).type}}
              </template>
            </code>
            <template v-if="documentation.get([name, 'events', prop])">
              {{documentation.get([name, 'events', prop]).description}}
            </template>
          </li>
        </ul>
      </template>
      <template v-if="defn.methods && defn.methods.length > 0">
        <h2>Methods</h2>
        <ul>
          <li v-for="prop of defn.methods">
            <code>
              {{ prop }}
              <template v-if="documentation.get([name, 'methods', prop], 'type')">
                : {{documentation.get([name, 'methods', prop]).type}}
              </template>
            </code>
            <div v-if="documentation.get([name, 'methods', prop], 'description')"
              v-html="markdown(documentation.get([name, 'methods', prop]).description)"
              >
            </div>
          </li>
        </ul>
      </template>
    </template>
  </div>
</template>

<script>
const {Parser, HtmlRenderer} = require('commonmark')

const reader = new Parser()
const writer = new HtmlRenderer()

export default {
  props: ['components', 'documentation'],

  computed: {
    visibleComponents () {
      return this.components.filter(([name, defn]) => {
        return !this.documentation.get([name], 'hide')
      })
    }
  },

  methods: {
    genId(path) {
      return 'autogen_' + path.join('_')
    },
    markdown(md) {
      return writer.render(reader.parse(md))
    }
  }
}
</script>
