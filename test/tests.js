/* eslint-disable no-unused-expressions/no-unused-expressions */

'use strict'

const assert = require('assert')
const XRPLDestination = require('../')

describe('XRPL-Destination', () => {

  const deepEqTests = [
    {
      title: 'without tag',
      address: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf',
      tag: null,
      check: {
        packed: 'r1WTvVjuoBM9vsm2p395AyzCQcJyEp8aG4YHcqE3XLDehK',
        appended: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfTbxXR2tgs',
        xaddress: 'Xaew8rJ0rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'
      }
    },
    {
      title: 'with tag 0',
      address: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf',
      tag: 0,
      check: {
        packed: 'r1WTvVjuoBM9vsm2p395AyzCQcJyEfcHYq9yDEBxVaZPrv',
        appended: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfRaqV96w6Bi',
        xaddress: 'Xscra3e00rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'
      }
    },
    {
      title: 'with tag 65591',
      address: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf',
      tag: 65591,
      check: {
        packed: 'r1WTvVjuoBM9vsm2p395AyzCQcJyE3eVsfqQrBa3X4q4qF',
        appended: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfV6eFVsdMCYQW3Tcu',
        xaddress: 'XhFYJZN065591rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'
      }
    },
    {
      title: 'with tag 4294967295',
      address: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf',
      tag: 4294967295,
      check: {
        packed: 'r1WTvVjuoBM9vsm2p395AyzCQcJyEUS7qHkuz3AD8zhAbQ',
        appended: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfVaaraza7gaUcau6EtLKDfRG',
        xaddress: 'XhxQwkp04294967295rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'
      }
    },
    {
      title: 'without tag, expiration 2019-12-31 23:59:59 as string',
      address: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf',
      tag: null,
      expire: '2019-12-31 23:59:59Z',
      check: {
        xaddress: 'XsS5UpBRdZR40rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'
      }
    },
    {
      title: 'with tag 4294967295, expiration 2019-12-31 23:59:59 as Date obj.',
      address: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf',
      tag: 4294967295,
      expire: new Date('2019-12-31 23:59:59Z'),
      check: {
        xaddress: 'Xp4JvGrzSAhg04294967295rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'
      }
    }
  ]

  deepEqTests.forEach(test => {
    describe(`Address ${test.title}`, () => {
      Object.keys(test.check).forEach(type => {
        describe(type, () => {
          const opts = {
            expire: typeof test.expire === 'undefined'
              ? null
              : test.expire
          }
          it('Must encode to', () => {
            const a = new XRPLDestination(test.check[type], opts)
            assert.deepEqual(test.check[type], a.tagged[type])
          })
          it('Must decode from', () => {
            const a = new XRPLDestination(test.check[type])
            const address = test.address +
              (test.tag === null ? '' : ':' + test.tag)
            const decoded = a.untagged.account +
              (a.untagged.tag === null ? '' : ':' + a.untagged.tag)
            assert.strictEqual(address, decoded)
          })
          it('Must be equal when JSON encoded', () => {
            const address = test.address +
              (test.tag === null ? '' : ':' + test.tag)
            const a = new XRPLDestination(address, opts)
            const b = new XRPLDestination(test.check[type])
            assert.deepEqual(a.toJSON(), b.toJSON())
          })
        })
      })
    })
  })

})
