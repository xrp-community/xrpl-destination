const XRPLDestination = require('../src')

console.log()
console.log()

console.log(
  JSON.stringify(new XRPLDestination('rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'), null, 2),
  JSON.stringify(new XRPLDestination('rpEV8JKNQpRdeTop5quDYMMA5ynxJLrUWpjbQvzzkQytLc5'), null, 2),
  JSON.stringify(new XRPLDestination('rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDYVaCSRUkH8'), null, 2)
)

console.log()
console.log()

console.log(
  JSON.stringify(new XRPLDestination('rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY:0'), null, 2),
  JSON.stringify(new XRPLDestination('rpEV8JKNQpRdeTop5quDYMMA5ynxJLap6KUDaXQA2L9LPh8'), null, 2),
  JSON.stringify(new XRPLDestination('rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDYT3KnHMu1D4'), null, 2)
)

console.log()
console.log()


console.log(
  JSON.stringify(new XRPLDestination('rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY:13371337'), null, 2),
  JSON.stringify(new XRPLDestination('rpEV8JKNQpRdeTop5quDYMMA5ynxJL9FjsZTcy7TEsu4eb5'), null, 2),
  JSON.stringify(new XRPLDestination('rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDYVW57KBSpCcZagTqMxyVS'), null, 2)
)

console.log()
console.log()