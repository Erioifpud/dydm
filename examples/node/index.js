const Danmu = require('../../dist/index')

const danmu = new Danmu({
  roomId: 301049
})

danmu.on('message', (payload) => {
  if (payload.type !== 'chatmsg') {
    return
  }
  const { nn, txt, bnn } = payload
  console.log(`[${bnn}]${nn}: ${txt}`)
})

danmu.connect()
