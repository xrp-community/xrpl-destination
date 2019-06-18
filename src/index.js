/* eslint-disable no-unused-expressions/no-unused-expressions */

'use strict'

const codec = require('ripple-address-codec')
const utils = require('./utils')

class XRPLDestination {

  constructor(address = null) {

    /**
     * Defaults
     */
    this.tagged = {
      packed: null,
      appended: null
    }
    this.untagged = {
      account: null,
      tag: null
    }

    /**
     * Constants
     */

    const c = codec.codecs.ripple
    const alphabet = c.alphabet
    const utf = `^(r[${alphabet}]{24,34})[\s:]{0,1}([0-9]*)$`
    const tf = `^(r[${alphabet}]{34,})$`
    const untaggedRegExp = new RegExp(utf)
    const taggedRegExp = new RegExp(tf)

    /**
     * Private methods
     */

    const findPrefixFixed = (desiredPrefix, payloadLength) => {
      // Fixes infinity-problem, @sublimator
      if (c.base !== 58) {
        throw new Error('Only works for base58')
      }
      const factor = Math.log(256) / Math.log(c.base)
      const totalLength = payloadLength + 4 // for checksum
      const chars = totalLength * factor
      const requiredChars = Math.ceil(chars + 0.2)
      const padding = alphabet[Math.floor((alphabet.length) / 2) - 1]
      const rcPad = new Array(requiredChars + 1).join(padding)
      const template = desiredPrefix + rcPad
      const bytes = c.decodeRaw(template)
      const version = bytes.slice(0, -totalLength)
      return version
    }

    const encodePacked = () => {
      const accountBytes = codec.decodeAddress(this.untagged.account)
      const accountHex = utils.toHex(accountBytes)
      const tagTypeHex = this.untagged.tag === null ? '00' : '01'
      const tagHex = utils.uInt32_ToUInt32LE(this.untagged.tag || 0)
      const bytes = utils.toBytes(accountHex + tagTypeHex + tagHex)

      const encodeOpts = {version: 0, expectedLength: 29}
      this.tagged.packed = c.encode(bytes, encodeOpts)
    }

    const encodeAppended = () => {
      const tagBuffer = Buffer.from(String(this.untagged.tag || ''), 'utf8')
      const writer = new utils.OerWriter()
      writer.writeUInt8(this.untagged.account.length)
      writer.writeVarOctetString(tagBuffer)
      const reversed = writer.getBuffer().reverse()
      const l = reversed.length
      const prefix = findPrefixFixed(this.untagged.account, l)
      this.tagged.appended = c.encodeVersioned(reversed, prefix, l)
    }

    const encode = () => {
      encodePacked()
      encodeAppended()
    }

    const decodePacked = a => {
      try {
        const hex = utils.toHex(c.decode(a, {version: 0, expectedLength: 29}))
        const account = hex.slice(0, -18)
        const tagTypeHex = hex.slice(-18, -16)
        const tagHex = hex.slice(-16)

        const result = {
          address: codec.encodeAddress(utils.toBytes(account)),
          tagType: tagTypeHex === '00' ? 'NO_TAG' : 'TAG_32',
          tag: tagTypeHex === '00'
            ? null
            : String(utils.uInt32LE_ToUInt32(tagHex))
        }
        const valid = codec.isValidAddress(result.address)
        if (typeof result.address === 'string' && valid) {
          this.tagged.packed = a
          this.untagged.account = result.address
          if (result.tagType !== 'NO_TAG') {
            this.untagged.tag = result.tag
          }
          encodeAppended()
          return
        }
      } catch (e) {
        // Ignore
      }
    }

    const decodeAppended = a => {
      try {
        const decoded = c.decodeChecked(a).reverse()
        const reader = new utils.OerReader(new Buffer(decoded))
        const result = {
          address: a.slice(0, reader.readUInt8Number()),
          tag: new Buffer(reader.readVarOctetString()).toString('utf8')
        }
        const valid = codec.isValidAddress(result.address)
        if (typeof result.address === 'string' && valid) {
          this.tagged.appended = a
          this.untagged.account = result.address
          this.untagged.tag = result.tag === ''
            ? null
            : result.tag
          encodePacked()
          return
        }
      } catch (e) {
        // Ignore
      }
    }

    const decode = a => {
      if (this.untagged.account === null) {
        decodePacked(a)
      }
      if (this.untagged.account === null) {
        decodeAppended(a)
      }
    }

    /**
     * Logic
     */

    if (typeof address === 'string') {
      if (untaggedRegExp.test(address)) {
        const exploded = untaggedRegExp.exec(address)

        if (codec.isValidAddress(exploded[1])) {
          this.untagged.account = exploded[1]
          this.untagged.tag = exploded[2] === ''
            ? null
            : exploded[2]

          encode()
        } else {
          throw new Error('Invalid untagged address')
        }
      } else if (taggedRegExp.test(address)) {
        try {
          decode(address)
        } catch (e) {
          const msg = 'Invalid tagged address: tag not packed and not appended'
          throw new Error(msg)
        }
      } else {
        const msg = 'Could not find valid untagged or tagged address'
        throw new Error(msg)
      }
    } else {
      const msg = 'Input should be string'
      throw new Error(msg)
    }

    /**
     * Constructor done
     */

    return this
  }

  /**
   * Typecast output
   */

  toString() {
    return '<XRPLDestination(Object)>'
  }

  toJSON() {
    return {
      tagged: {
        packed: this.tagged.packed,
        appended: this.tagged.appended
      },
      untagged: {
        account: this.untagged.account,
        tag: this.untagged.tag === null
          ? null
          : parseInt(this.untagged.tag, 10)
      }
    }
  }

}

module.exports = XRPLDestination
