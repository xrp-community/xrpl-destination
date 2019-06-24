const XRPLDestination = require('../src')

console.log(`\n`)

const account = 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'

console.log(
  JSON.stringify(new XRPLDestination(account), null, 2),
)

console.log(`\n-------\n`)

console.log(
  JSON.stringify(new XRPLDestination(`${account}:0`), null, 2),
)

console.log(`\n-------\n`)

console.log(
  JSON.stringify(new XRPLDestination('XhdLt3N013371337rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'), null, 2)
)

console.log(`\n-------\n`)

console.log(
  // Encode with expiration
  JSON.stringify(new XRPLDestination(account, { expire: new Date('2019-12-31 23:59:59Z') }), null, 2),
  // Decode with expiration
  JSON.stringify(new XRPLDestination('Xp4JvGrzSAhg04294967295rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf'), null, 2),
)

console.log(`\n`)


