/* eslint-disable no-unused-expressions/no-unused-expressions */

'use strict'

const codec = require('ripple-address-codec')
const utils = require('./utils')

class XRPLDestination {

  constructor(address = null, opts = {}) {

    /**
     * Defaults
     */
    this.tagged = {
      packed: null,
      appended: null,
      xaddress: null
    }
    this.untagged = {
      account: null,
      tag: null
    }
    this.options = {
      network: null,
      expire: null
    }

    /**
     * Constants
     */

    this.options = Object.assign({
      network: 'production',
      expire: null
    }, opts || {})

    this.options.expire = utils.dateToInt(this.options.expire)

    const c = codec.codecs.ripple
    const alphabet = c.alphabet
    const utf = `^(r[${alphabet}]{24,34})[\s:]{0,1}([0-9]*)$`
    const tf = `^(r[${alphabet}]{34,})$`
    const xA = `^([XT][${alphabet}0]{25,})$`
    const untaggedRegExp = new RegExp(utf)
    const taggedRegExp = new RegExp(tf)
    const xAddressRegExp = new RegExp(xA)

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

    const encodeXaddress = () => {
      // 1. Decode classicAddress to accountID
      const accountHex = utils.toHex(codec.decodeAddress(this.untagged.account))
      const accountID = Buffer.from(accountHex, 'hex')

      // 2. Encode networkID
      let myNetworkByte
      if (this.options.network === 'production') {
        myNetworkByte = Buffer.from('X')
      } else if (this.options.network === 'test') {
        myNetworkByte = Buffer.from('T')
      } else {
        throw new Error(`Invalid networkID: ${this.options.network}`)
      }
      const networkByte = myNetworkByte

      // 3. Convert tag to Buffer (UInt32LE)
      let myTagBuffer
      const tag = parseInt(this.untagged.tag, 10)
      if (this.untagged.tag !== undefined && this.untagged.tag !== null) {
        if (isNaN(tag) || !Number.isInteger(tag)) {
          throw new Error(`Invalid tag: ${this.untagged.tag}`)
        }
        myTagBuffer = Buffer.alloc(8)
        myTagBuffer.writeUInt32LE(tag, 0)
      } else {
        myTagBuffer = Buffer.alloc(0)
      }
      const tagBuffer = myTagBuffer

      let myExpirationBuffer
      if (this.options.expire !== undefined && this.options.expire !== null) {
        if (Number.isInteger(this.options.expire) === false) {
          throw new Error(`Invalid expiration: ${this.options.expire}`)
        }
        myExpirationBuffer = Buffer.alloc(4)
        myExpirationBuffer.writeUInt32LE(this.options.expire, 0)
      } else {
        myExpirationBuffer = Buffer.alloc(0)
      }
      const expirationBuffer = myExpirationBuffer

      const payload = Buffer.concat([
        networkByte,
        expirationBuffer,
        tagBuffer,
        accountID
      ])
      const checksum = utils.sha256(utils.sha256(payload)).slice(0, 4)
      const checksum_base58 = codec.encode(Buffer.concat([
        checksum,
        expirationBuffer
      ]))
      const DELIMITER = '0'

      const tagString = this.untagged.tag !== undefined
        && this.untagged.tag !== null
        ? this.untagged.tag.toString()
        : ''

      this.tagged.xaddress = networkByte.toString()
        + checksum_base58
        + DELIMITER
        + tagString
        + this.untagged.account
    }

    const encode = () => {
      if (this.tagged.packed === null) {
        encodePacked()
      }
      if (this.tagged.appended === null) {
        encodeAppended()
      }
      if (this.tagged.xaddress === null) {
        encodeXaddress()
      }
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
          encode()
          return
        }
      } catch (e) {
        // Ignore
      }
    }

    const decodeAppended = a => {
      try {
        const decoded = c.decodeChecked(a).reverse()
        const reader = new utils.OerReader(Buffer.from(decoded))
        const result = {
          address: a.slice(0, reader.readUInt8Number()),
          tag: Buffer.from(reader.readVarOctetString()).toString('utf8')
        }
        const valid = codec.isValidAddress(result.address)
        if (typeof result.address === 'string' && valid) {
          this.tagged.appended = a
          this.untagged.account = result.address
          this.untagged.tag = result.tag === ''
            ? null
            : result.tag
          encode()
          return
        }
      } catch (e) {
        // Ignore
      }
    }

    const decodeXaddress = a => {
      try {
        // 1. Encode first character, which must be X or T
        const first = a.slice(0, 1)
        if (first !== 'X' && first !== 'T') {
          throw new Error(`Invalid first character: ${first}`)
        }
        const networkByte = Buffer.from(first)

        // 2. Take everything between that character and the first
        // '0', as the expiration and full checksum
        const delimiterPosition = a.indexOf('0')
        if (delimiterPosition === -1) {
          throw new Error(`Missing delimiter: ${a}`)
        }
        const checksumAndExpirationBase58 = a.slice(1, delimiterPosition)
        const checksumAndExpiration = codec.decode(checksumAndExpirationBase58)

        let expirationBuffer
        let expiration
        if (checksumAndExpiration.length === 4) {
          // expiration is undefined
          expirationBuffer = Buffer.alloc(0)
          expiration = null
        } else if (checksumAndExpiration.length === 8) {
          expirationBuffer = Buffer.from(checksumAndExpiration.slice(4, 8))
          expiration = expirationBuffer.readUInt32LE(0)
        } else {
          // Must be exactly 4 or 8 bytes
          const l = checksumAndExpiration.length
          throw new Error(`Invalid checksum/expiration length: ${l}`)
        }

        const checksumBuffer = checksumAndExpiration.slice(0, 4)

        // 3. Take everything between that '0' and the next 'r', as the tag
        const classicAddressPosition = a.indexOf('r', delimiterPosition + 1)
        if (classicAddressPosition === -1) {
          throw new Error(`Missing classic address: ${a}`)
        }
        const tagString = a.slice(delimiterPosition + 1, classicAddressPosition)
        const tag = tagString === '' ? undefined : Number(tagString)
        if (tag !== undefined && isNaN(tag)) {
          throw new Error(`Invalid tag: ${tagString}`)
        }

        // 4. The rest is the classic address
        const classicAddress = a.slice(classicAddressPosition)
        const decodedClassic = codec.decodeAddress(classicAddress)
        const accountID = Buffer.from(decodedClassic, 'hex')

        // 5. Convert tag to Buffer (UInt32LE)
        let myTagBuffer
        if (tag !== undefined) {
          if (Number.isInteger(tag) === false) {
            throw new Error(`Invalid tag: ${tag}`)
          }
          myTagBuffer = Buffer.alloc(8)
          // 8 bytes = 64 bits
          myTagBuffer.writeUInt32LE(tag, 0)
        } else {
          myTagBuffer = Buffer.alloc(0)
        }
        const tagBuffer = myTagBuffer

        // 6. Concat networkByte, expirationBuffer, tagBuffer, and accountID
        //    to create the payload to be checksummed.
        //    NB: The ordering of these values has been changed from an
        //    earlier draft of this spec.
        const payload = Buffer.concat([
          networkByte,
          expirationBuffer,
          tagBuffer,
          accountID
        ])

        // 7. SHA256 x 2 and take first 4 bytes as checksum
        const computedChecksum = utils.sha256(utils.sha256(payload)).slice(0, 4)

        // 8. Ensure checksums match
        if (computedChecksum === Buffer.from(checksumBuffer)) {
          const hex = checksumBuffer.toString('hex').toUpperCase()
          throw new Error(`Invalid checksum (hex): ${hex}`)
        }

        // 9. Set networkID based on first character
        let networkID
        if (first === 'X') {
          networkID = 'production'
        } else if (first === 'T') {
          networkID = 'test'
        } else {
          throw new Error(`Invalid first character: ${first}`)
          // Cannot happen; just to double-check (invariant)
        }

        this.options.network = networkID
        this.tagged.xaddress = a
        this.untagged.account = classicAddress
        this.options.expire = expiration
        this.untagged.tag = tag === '' || tag === undefined
          ? null
          : String(tag)
        encode()
        return

      } catch (e) {
        // Ignore
        console.log(e)
      }
    }

    const decode = a => {
      if (this.untagged.account === null) {
        decodePacked(a)
      }
      if (this.untagged.account === null) {
        decodeAppended(a)
      }
      if (this.untagged.account === null) {
        decodeXaddress(a)
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
      } else if (taggedRegExp.test(address) || xAddressRegExp.test(address)) {
        try {
          decode(address)
        } catch (e) {
          const msg = 'Invalid tagged address:' +
            'tag not packed, not appended, not x-address'
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
        appended: this.tagged.appended,
        xaddress: this.tagged.xaddress
      },
      untagged: {
        account: this.untagged.account,
        tag: this.untagged.tag === null
          ? null
          : parseInt(this.untagged.tag, 10)
      },
      options: {
        network: this.options.network,
        expire: this.options.expire === null
          ? null
          : utils.intToDate(this.options.expire)
      }
    }
  }

}

module.exports = XRPLDestination
