/* eslint-disable no-unused-expressions/no-unused-expressions */

'use strict'

const assert = require('assert')
const XRPLDestination = require('../')

describe('XRPL-Destination', () => {

  // Todo: check throws, strictEqual, check with/without/zero etc. tag.

  it('EncodeDecode 1', () => {
    const p1 = 'r1WTvVjuoBM9vsm2p395AyzCQcJyEp8aG4YHcqE3XLDehK'
    const p2 = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfTbxXR2tgs'
    const j1 = new XRPLDestination(p1)
    const j2 = new XRPLDestination(p2)
    console.log(j1)
    console.log(j2)
    assert.deepEqual(j1.toJSON(), j2.toJSON())
  })

  it('EncodeDecode 2', () => {
    const p1 = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'
    const p2 = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfTbxXR2tgs'
    const j1 = new XRPLDestination(p1)
    const j2 = new XRPLDestination(p2)
    console.log(j1)
    console.log(j2)
    assert.deepEqual(j1.toJSON(), j2.toJSON())
  })

})
