const XRPLDestination = require('../src')

console.log(`\n`)

const account = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'

console.log(
  JSON.stringify(new XRPLDestination(account), null, 2),
  JSON.stringify(new XRPLDestination('r1WTvVjuoBM9vsm2p395AyzCQcJyEp8aG4YHcqE3XLDehK'), null, 2),
  JSON.stringify(new XRPLDestination('rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfTbxXR2tgs'), null, 2),
  JSON.stringify(new XRPLDestination('XfHcYHS0rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'), null, 2)
)

console.log(`\n-------\n`)

console.log(
  JSON.stringify(new XRPLDestination(`${account}:0`), null, 2),
  JSON.stringify(new XRPLDestination('r1WTvVjuoBM9vsm2p395AyzCQcJyEfcHYq9yDEBxVaZPrv'), null, 2),
  JSON.stringify(new XRPLDestination('rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpfRaqV96w6Bi'), null, 2),
  JSON.stringify(new XRPLDestination('XsjB8w300rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'), null, 2)
)

console.log(`\n-------\n`)


console.log(
  JSON.stringify(new XRPLDestination(`${account}:13371337`), null, 2),
  JSON.stringify(new XRPLDestination('r1WTvVjuoBM9vsm2p395AyzCQcJyEBQKHUQVCJ6dDGbYU7'), null, 2),
  JSON.stringify(new XRPLDestination('rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf7vSBPCZR1h1tmgqHTkEp'), null, 2),
  JSON.stringify(new XRPLDestination('XatLo2R013371337rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'), null, 2)
)

console.log(`\n`)