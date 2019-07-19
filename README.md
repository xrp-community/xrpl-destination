# DEPRECATED, MOVED TO https://www.npmjs.com/xrpl-tagged-address-codec / https://github.com/xrp-community/xrpl-tagged-address-codec

---

# XRPLDestination [![NPM](https://img.shields.io/npm/v/xrpl-destination.svg)](https://npmjs.org/package/xrpl-destination) 

#### Abstract

When sending XRP to "shared accounts", like exchanges and custodial wallets, users receive a **deposit address** and **destination tag** (unsigned 32 bit integer). The receipient can use the destination tag on the incoming transactions to credit the received funds to the right user. 

As [@nbougalis](https://github.com/xrp-community/standards-drafts/issues/6) explained in the abstract of the first proposal to encode destination accounts and destination tags into one address:
> Destination tags provide a way for exchanges, payment processors, corporates or entities which accept incoming payments, escrows, checks and similar transcations to use a single receiving wallet while being able to disambiguate incoming transactions by instructing the senders to include a destination tag.

The problem is many users don't understand (the importance of using correct) destination tags. As a result users omit them or don't pay attention to them, resulting in typo's. This leads to manual corrections on the receiving end, or even lost funds (if the receiving party doesn't reroute the funds manually).

## This library

To improve the use of destination tags, clients & beneficiaries (like exchanges and custodial wallets) could switch to encoded addresses, combining both the destination address and destination tag into one string. 

**Several encodings are proposed by developers / community members. This library combines the encoding and decoding of all the proposals, allowing developers to play around with the different formats.**

So: this lib. allows combining account addresses and destination tags in checksummed destination addresses.

#### Supported proposals & encodings

| Name             | By           | Single buffer? | Original account visible? | Easy to recognize new format? |
| :---             | :---         | :---:          | :---:                     | :---:                    |
| "**Packed**" [🔗](https://github.com/xrp-community/standards-drafts/issues/6) | [@nbougalis](https://github.com/nbougalis) |  ✅ | ❌ | ❌ |
| "**Appended**" [🔗](https://github.com/sublimator/x-address-codec/tree/nd-tagged-addresses) | [@sublimator](https://github.com/sublimator) | ❌ | ✅ | ❌ |
| "**X-Address**" [🔗](https://github.com/intelliot/x-address-proposal) | [@intelliot](https://github.com/intelliot) | ❌ | ✅ | ✅ |

#### ⚠️ Once a format has been selected as "the winning format", I'll replace this library by a definitive library in **TypeScript**.

## API

The `TaggedAddress` constructor accepts a string in the existing notation (address, colon, tag, `rAddress:tag`) or any of the supported encoded formats.

To encode & decode an address into all supported formats, simply enter the address into the constructor:

```javacsript
const addresses = new XRPLDestination('rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf:1234')
```

Or of course one of the encoded formats:

```javacsript
const addresses = new XRPLDestination('rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfTbxXR2tgs')
```

For the **proposed _X-Address format_**, optionally a second argument containing an options object can be supplied. This format supports a network prefix, `P` or `T`, to differentiate between accounts on livenet (production) or testnet (test) and an optional expiration can be supplied:

```javacsript
// const opts = {network: 'test', expire: null}
// or
const opts = {network: 'test', expire: '2019-12-31 23:59:59Z'}
const addresses = new XRPLDestination('rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfTbxXR2tgs', opts)
```

The expiration (`expire`) can be entered as a date+time string (will be parsed with `Date.parse()`) or as a Date object.

The output object will always contain all encoded formats:

```json
{
  "tagged": {
    "packed": "r1WTvVjuoBM9vsm2p395AyzCQcJyEBQKHUQVCJ6dDGbYU7",
    "appended": "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf7vSBPCZR1h1tmgqHTkEp",
    "xaddress": "XatLo2R013371337rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf"
  },
  "untagged": {
    "account": "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf",
    "tag": 13371337
  },
  "options": {
    "network": "production",
    "expire": null
  }
}

```

`untagged.tag` will either be `null` or an unsigned 32 bit integer. `options.expire` will be null or an international date+time string, eg. `"2019-12-31T23:59:59.000Z"`.


## Format samples

| Format | Tag | Encoded |
| :--- | :---: | :--- |
| **Old** | _none_ | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** |
| | 0 | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `:0` |
| | 13371337 | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `:13371337` |
| **Packed** | _none_ | `r1WTvVjuoBM9vsm2p395AyzCQcJy` `...` |
| | 0 | `r1WTvVjuoBM9vsm2p395AyzCQcJy` `...` |
| | 13371337 |`r1WTvVjuoBM9vsm2p395AyzCQcJy` `...` |
| **Appended** | _none_ | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `...` |
| | 0 | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `...` |
| | 13371337 | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `...` |
| **X-Address** | _none_ | `X...` **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** |
| | 0 | `X...` `0` **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** |
| | 13371337 |`X...` `13371337` **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** |

## Final note

I am really happy with a migration to an address format containing both the destination account and destination tag. But it's really hard to pick one;

**Existing**

`+` Everybody knows it  
`-` Lots of mistakes

**Packed**

`+` Tech is the best, easiest for all programming languages, no double checksum  
`-` Existing address not recognizable

**Appended**

`+` Easy to spot the existing address at the start  
`-` (Beautiful and creative) Hocus pocus encoding/decoding (harder to build in all programming languages

**X-Address**

`+` Existing address recognizable at the end  
`+` Starts with an "X" so easy to communicate to users, "You can use the X format here"  
`-` Hard to spot the existing address, Invalid alphabet with the zero (not in the ripple encoding alphabet)
`-` Breaking change with the base58 Ripple alphabet (added zero)
`-` Another round of sha256 encoding

