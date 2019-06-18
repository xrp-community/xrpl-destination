/* eslint-disable no-unused-expressions/no-unused-expressions */

'use strict'

const assert = require('assert')
const XRPLDestination = require('../')

describe('XRPL-Destination', () => {
  // it('Should encode an address without tag', () => {
  //   const account = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'
  //   const encoded = new TaggedAddress(account)
  //   const expected = 'r1WTvVjuoBM9vsm2p395AyzCQcJyEp8aG4YHcqE3XLDehK'
  //   assert.equal(encoded, expected)
  // })

  // it('Should encode an address with tag 0', () => {
  //   const accountWithTag = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf:0'
  //   const encoded = new TaggedAddress(accountWithTag)
  //   const expected = 'r1WTvVjuoBM9vsm2p395AyzCQcJyEfcHYq9yDEBxVaZPrv'
  //   assert.equal(encoded, expected)
  // })

  // it('Should encode an address with tag 4294967295', () => {
  //   const accountWithTag = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf:4294967295'
  //   const encoded = new TaggedAddress(accountWithTag)
  //   const expected = 'r1WTvVjuoBM9vsm2p395AyzCQcJyEUS7qHkuz3AD8zhAbQ'
  //   assert.equal(encoded, expected)
  // })

  // it('Should encode an object with address with tag 276', () => {
  //   const objectWithTag = {
  //     Address: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf',
  //     Tag: '276'
  //   }
  //   const encoded = new TaggedAddress(objectWithTag)
  //   const expected = 'r1WTvVjuoBM9vsm2p395AyzCQcJyEfzBRqiF1pyW3aoKhN'
  //   assert.equal(encoded, expected)
  // })

  // it('Should decode an address without tag', () => {
  //   const encoded = 'r1WTvVjuoBM9vsm2p395AyzCQcJyEp8aG4YHcqE3XLDehK'
  //   const decoded = new TaggedAddress(encoded)
  //   const expected = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'
  //   assert.equal(decoded, expected)
  // })

  // it('Should decode an address with tag 0', () => {
  //   const encoded = 'r1WTvVjuoBM9vsm2p395AyzCQcJyEfcHYq9yDEBxVaZPrv'
  //   const decoded = new TaggedAddress(encoded)
  //   const expected = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf:0'
  //   assert.equal(decoded, expected)
  // })

  // it('Should decode an address with tag 4294967295', () => {
  //   const encoded = 'r1WTvVjuoBM9vsm2p395AyzCQcJyEUS7qHkuz3AD8zhAbQ'
  //   const decoded = new TaggedAddress(encoded)
  //   const expected = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf:4294967295'
  //   assert.equal(decoded, expected)
  // })

  // Todo: check throws, strictEqual

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
