import Vue from 'vue'
import {mount} from '@vue/test-utils'
import {bindProps} from '../../../src/utils/bindProps'
import { delay } from './util';

describe("Props Binder", async function () {
  beforeAll(async () => {
    await Vue.$gmapApiPromiseLazy()
  })

  it("Bind two-way props to a Vue object", async function () {
    let calledValue = null
    let emittedValue = null

    class MyClass extends google.maps.MVCObject {
      setMapTypeId (a) {calledValue = a}
      getMapTypeId () { return 'third' }
    }

    let mvc = new MyClass()

    let wrapper = mount({
      props: ['mapTypeId'],
      render: () => {},
      created () {
        bindProps(
          this,
          mvc,
          {
            mapTypeId: {
              twoWay: true,
              type: String
            }
          }
        )
      }
    }, {
      propsData: { mapTypeId: 'first' },
      listeners: {
        'maptypeid_changed' (e) { emittedValue = e }
      }
    })

    expect(calledValue).toEqual('first')

    wrapper.setProps({ mapTypeId: 'second' })

    expect(calledValue).toEqual('second')

    google.maps.event.trigger(mvc, 'maptypeid_changed')
    await delay(1)
    expect(emittedValue).toEqual('third')
  })

  it("No-bind props are not bound", async function () {
    let calledValue = null
    let otherValue = null

    class MyClass extends google.maps.MVCObject {
      setMapTypeId (a) {calledValue = a}
      setOther (a) {otherValue = a}
    }

    let mvc = new MyClass()

    let wrapper = mount({
      props: ['mapTypeId', 'other'],
      render: () => {},
      created () {
        bindProps(
          this,
          mvc,
          {
            mapTypeId: {
              type: String,
              noBind: true,
            },
            other: {
              type: String
            }
          }
        )
      }
    }, {
      propsData: { mapTypeId: 'first', other: 'second' }
    })

    expect(calledValue).toEqual(null)
    expect(otherValue).toEqual('second')
  })
})
