const { isBrowser } = require('./index')

module.exports = function getWebSocket () {
  if (isBrowser()) {
    return window.WebSocket
  }
  /* eslint-disable-next-line */
  return eval('require')('ws')
}
