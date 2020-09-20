function EventEmitter () {
  this.eventMap = {}
}

EventEmitter.prototype.on = function (eventName, handler) {
  if (!this.eventMap[eventName]) {
    this.eventMap[eventName] = []
  }
  this.eventMap[eventName].push(handler)
}

EventEmitter.prototype.emit = function (eventName, payload) {
  if (!this.eventMap[eventName]) {
    return
  }
  this.eventMap[eventName].forEach(handler => {
    handler(payload)
  })
}

module.exports = EventEmitter
