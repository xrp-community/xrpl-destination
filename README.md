# XRPLDestination

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

Optionally a second argument containing an options object with a `network` (`production` or `test`) can be supplied, since the proposed _X-Address format_ uses a `P` or `T` prefix to differentiate between accounts on livenet (production) or testnet (test):

```javacsript
const opts = {network: 'test'}
const addresses = new XRPLDestination('rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfTbxXR2tgs', opts)
```

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
    "network": "production"
  }
}

```

`untagged.tag` will either be `null` or an unsigned 32 bit integer.


## Format samples

| Format | Tag | Encoded |
| :--- | :---: | :--- |
| **Old** | _none_ | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** |
| | 0 | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `:0` |
| | 13371337 | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `:13371337` |
| **Packed** | _none_ | `r1WTvVjuoBM9vsm2p395AyzCQcJy` `Ep8aG4YHcqE3XLDehK` |
| | 0 | `r1WTvVjuoBM9vsm2p395AyzCQcJy` `EfcHYq9yDEBxVaZPrv` |
| | 13371337 |`r1WTvVjuoBM9vsm2p395AyzCQcJy` `EBQKHUQVCJ6dDGbYU7` |
| **Appended** | _none_ | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `TbxXR2tgs` |
| | 0 | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `RaqV96w6Bi` |
| | 13371337 | **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** `7vSBPCZR1h1tmgqHTkEp` |
| **X-Address** | _none_ | `XfHcYHS0` **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** |
| | 0 | `XsjB8w30` `0` **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** |
| | 13371337 |`XatLo2R0` `13371337` **`rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf`** |

