# XRPL-Destination

### Encode / decode XRPL Destination Addresses

Package to encode/decode tagged XRPL destination accounts addresses.

This allows combining account addresses and destination tags in one checksummed destination address, formatted in ripple base58 format.

```
Todo: some formats
```

If recipients & clients implement tagged addresses it'll be the end of user error when transfering funds on the XRP ledger: users can no longer forget to add a destination tag or enter the wrong one.

## API

The `TaggedAddress` constructor accepts a string. 

```
Todo: some formats
```

```
Todo: what will be returned
```

```json
{
// Todo
}
```

The `Address` is mandatory and should contain an untagged address, the `Tag` may be left out, and should contain a `null` or UInt32 value if present.

## History & Contributions

```
Todo: what started this (Nik) and who helped (Sublimator, Warbler, Richard, ...)

, as proposed by [nbougalis](https://github.com/nbougalis) in the XRP Community Standards Draft **[XLS-5d](https://github.com/xrp-community/standards-drafts/issues/6)**.
```
