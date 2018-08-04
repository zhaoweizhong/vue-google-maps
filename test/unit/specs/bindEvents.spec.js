import Vue from 'vue'
import {mount} from '@vue/test-utils'
import bindEvents from '../../../src/utils/bindEvents'
import {delay} from './util'

describe("Events Binder", async function () {
  beforeAll(async () => {
    await Vue.$gmapApiPromiseLazy()
  })

  it("Bind events to a Vue object", async function () {
    let mvc = new google.maps.MVCObject()

    let wrapper = mount({
      render () {
        return null
      },
      created () {
        bindEvents(
          this,
          mvc,
          ['event_one', 'event_two', 'hello_test']
        )
      }
    }, {
      listeners: {
        event_one () {},
        event_two () {},
        hello_test () {},
      }
    })

    await delay(1)

    google.maps.event.trigger(mvc, 'event_one', 1)
    await delay(1)
    google.maps.event.trigger(mvc, 'hello_test', 2)
    await delay(1)
    google.maps.event.trigger(mvc, 'event_two', 3)

    await delay(1)

    expect(wrapper.emittedByOrder()).toEqual([
      {name: 'event_one', args: [1]},
      {name: 'hello_test', args: [2]},
      {name: 'event_two', args: [3]},
    ])
  })

  it("No event listener => no event emitted", async function () {
    let mvc = new google.maps.MVCObject()

    let wrapper = mount({
      render () {
        return null
      },
      created () {
        bindEvents(
          this,
          mvc,
          ['event_one', 'event_two', 'hello_test']
        )
      }
    }, {
      listeners: {
        event_one () {},
        hello_test () {},
      }
    })

    await delay(1)

    google.maps.event.trigger(mvc, 'event_one', 1)
    await delay(1)
    google.maps.event.trigger(mvc, 'hello_test', 2)
    await delay(1)
    google.maps.event.trigger(mvc, 'event_two', 3)

    await delay(1)

    expect(wrapper.emittedByOrder()).toEqual([
      {name: 'event_one', args: [1]},
      {name: 'hello_test', args: [2]},
    ])
  })
})
