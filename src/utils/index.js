const _this = this
const textDecoder = new TextDecoder()

exports.isBrowser = function () {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

exports.toBytes = function (data) {
  if (typeof data === 'number') {
    return data.toString(16).padStart(8, '0').match(/.{1,2}/g).reverse().map(c => parseInt(c, 16))
  } else {
    return `${data}`.split('').map(c => c.charCodeAt(0))
  }
}

exports.readAsInt32 = function (bytes) {
  const bigEndianBytes = _this.readAsBigBytes(bytes, 4)
  if (isNaN(bigEndianBytes.length) || bigEndianBytes.length < 4) {
    throw new Error('invalid argument bytes length')
  }
  return _this.toNumber(bigEndianBytes)
}

exports.readAsInt16 = function (bytes) {
  const bigEndianBytes = _this.readAsBigBytes(bytes, 2)
  if (isNaN(bigEndianBytes.length) || bigEndianBytes.length < 2) {
    throw new Error('invalid argument bytes length')
  }
  return _this.toNumber(bigEndianBytes)
}

exports.readAsString = function (bytes) {
  const bigEndianBytes = bytes
  // if (isNaN(bigEndianBytes.length) || bigEndianBytes.length < length) {
  //   throw new Error('invalid argument bytes length')
  // }
  if (bigEndianBytes[bigEndianBytes.length - 1] !== 0) {
    throw new Error('invalid format')
  }
  const length = bigEndianBytes.length - 1
  const strBytes = bigEndianBytes.slice(0, length)
  return textDecoder.decode(strBytes)
}

exports.readAsBigBytes = function (bytes, count) {
  return _this.readBytes(bytes, count).reverse()
}

exports.readBytes = function (bytes, count) {
  if (!bytes.slice || isNaN(bytes.length)) {
    throw new Error('invalid argument bytes')
  }
  return Array.from(bytes.slice(0, count))
}

exports.toNumber = function (bigEndianBytes) {
  if (!(bigEndianBytes instanceof Array)) {
    throw new Error('bigEndianBytes must be an Array')
  }
  const hexStr = bigEndianBytes.reduce((str, byte) => {
    return str + byte.toString(16).padStart(2, '0')
  }, '')
  return parseInt(hexStr, 16)
}
