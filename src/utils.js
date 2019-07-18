/* eslint-disable no-unused-expressions/no-unused-expressions */

'use strict'

const crypto = require('crypto')
const {Reader: OerReader, Writer: OerWriter} = require('oer-utils')

function toHex(bytes) {
  return Buffer.from(bytes).toString('hex').toUpperCase()
}

function toBytes(hex) {
  return Buffer.from(hex, 'hex').toJSON().data
}

function uInt32LE_ToUInt32(hex) {
  return Buffer.from(hex, 'hex').readUInt32LE()
}

function uInt32_ToUInt32LE(int) {
  const buf = Buffer.alloc(8)
  buf.writeUInt32LE(int, 0)
  return buf.toString('hex').toUpperCase()
}

function sha256(payload) {
  return crypto.createHash('sha256').update(payload).digest()
}

function dateToInt(date) {
  const isDate = typeof date === 'object'
    && date !== null &&
    date.constructor === Date
  const isString = typeof date === 'string'
  if (isDate || isString) {
    return Math.round(Date.parse(date) / 1000) - 0x386D4380
  }
  return null
}

function intToDate(int) {
  if (typeof int === 'number' || typeof int === 'string') {
    const rippledTimestamp = parseInt(int, 10)
    if (!isNaN(rippledTimestamp)) {
      return new Date((rippledTimestamp + 0x386D4380) * 1000)
    }
  }
  return null
}

module.exports = {
  toHex,
  toBytes,
  uInt32LE_ToUInt32,
  uInt32_ToUInt32LE,
  OerReader,
  OerWriter,
  sha256,
  dateToInt,
  intToDate
}
