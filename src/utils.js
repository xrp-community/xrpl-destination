/* eslint-disable no-unused-expressions/no-unused-expressions */

'use strict'

const {Reader: OerReader, Writer: OerWriter} = require('oer-utils')

function toHex(bytes) {
  return new Buffer(bytes).toString('hex').toUpperCase()
}

function toBytes(hex) {
  return new Buffer(hex, 'hex').toJSON().data
}

function uInt32LE_ToUInt32(hex) {
  return Buffer.from(hex, 'hex').readUInt32LE()
}

function uInt32_ToUInt32LE(int) {
  const buf = new Buffer(8)
  buf.writeUInt32LE(int, 0)
  return buf.toString('hex').toUpperCase()
}

module.exports = {
  toHex,
  toBytes,
  uInt32LE_ToUInt32,
  uInt32_ToUInt32LE,
  OerReader,
  OerWriter
}
