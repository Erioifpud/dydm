const { toBytes, readAsInt32, readAsString } = require('./utils')
const EventEmitter = require('./utils/event')
const getWebSocket = require('./utils/websocket')
const fromEntries = require('object.fromentries')

function Danmu ({ roomId, wsApi = 'wss://danmuproxy.douyu.com:8503/', keepAlive = 40000 }) {
  this.roomId = roomId
  this.wsApi = wsApi
  this.keepAlive = keepAlive
  this.emitter = new EventEmitter()
  this.wsInstance = undefined
  this.timer = undefined
}

Danmu.prototype.__serialize = function (payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('payload must be an object')
  }
  return Object.keys(payload).map(key => {
    const escapeValue = `${payload[key]}`.replace('@', '@A').replace('/', '@S')
    return `${key}@=${escapeValue}/`
  }).join('')
}
Danmu.prototype.__deserialize = function (str) {
  if (!str || !str.trim()) {
    return
  }
  const list = str.split('/')
  if (str[str.length - 1] === '/') {
    list.pop()
  }
  return fromEntries(list.map(str => {
    const sepIndex = str.indexOf('@=')
    const key = str.substring(0, sepIndex)
    const value = str.substring(sepIndex + 2)
    return [key, value].map(item => item.replace(/@A/g, '@').replace(/@S/g, '/'))
  }))
}

Danmu.prototype.__encode = function (payload) {
  const str = this.__serialize(payload)
  const len = `${str}`.length
  const strLen = len + 9
  const strLenBytes = toBytes(strLen)
  const headerBytes = [0xb1, 0x02, 0x00, 0x00]
  const strBytes = toBytes(str)
  return new Int8Array([...strLenBytes, ...strLenBytes, ...headerBytes, ...strBytes, 0x00])
}

Danmu.prototype.__decode = function (arrayBuffer) {
  try {
    const int8Array = new Int8Array(arrayBuffer)
    const length = readAsInt32(int8Array)
    const checkLength = readAsInt32(int8Array.slice(4))
    if (length !== checkLength) {
      throw new Error('invalid argument arrayBuffer')
    }
    // const type = readAsInt16(int8Array.slice(8))
    const bodyStr = readAsString(int8Array.slice(12))
    return this.__deserialize(bodyStr)
  } catch (err) {
    this.emitter.emit('decodeError', arrayBuffer)
  }
}

Danmu.prototype.__sendPacket = function (payload) {
  if (!this.wsInstance || typeof this.wsInstance.send !== 'function') {
    return
  }
  const packet = this.__encode(payload)
  this.wsInstance.send(packet)
}

Danmu.prototype.__getLoginReqPacket = function () {
  return {
    type: 'loginreq',
    roomid: this.roomId
  }
}

Danmu.prototype.__getKeepAlivePacket = function () {
  return {
    type: 'mrkl'
  }
}

Danmu.prototype.__getJoinGroupPacket = function () {
  return {
    type: 'joingroup',
    rid: this.roomId,
    gid: -9999
  }
}

Danmu.prototype.connect = function () {
  const WebSocket = getWebSocket()
  this.wsInstance = new WebSocket(this.wsApi)
  this.wsInstance.binaryType = 'arraybuffer'
  this.wsInstance.onopen = (event) => {
    this.__sendPacket(this.__getLoginReqPacket())
    this.__sendPacket(this.__getJoinGroupPacket())
    this.timer = setInterval(() => {
      this.__sendPacket(this.__getKeepAlivePacket())
    }, this.keepAlive)
    this.emitter.emit('connect', event)
  }
  this.wsInstance.onmessage = (event) => {
    const arrayBuffer = event.data
    const decoded = this.__decode(arrayBuffer)
    if (!decoded) {
      return
    }
    this.emitter.emit('message', decoded)
    this.emitter.emit('rawData', arrayBuffer)
  }
  this.wsInstance.onclose = (event) => {
    this.emitter.emit('disconnect', event)
  }
  this.wsInstance.onerror = (event) => {
    this.emitter.emit('error', event)
  }
}

Danmu.prototype.disconnect = function () {
  if (!this.wsInstance || !this.wsInstance.close) {
    return
  }
  clearInterval(this.timer)
  this.wsInstance.close()
}

Danmu.prototype.on = function (eventName, handler) {
  this.emitter.on(eventName, handler)
}

module.exports = Danmu
