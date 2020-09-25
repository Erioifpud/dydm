一个用来获取/发送斗鱼直播弹幕的工具，目前只实现了**获取**功能。

兼容 Node 与浏览器环境，Node 环境下会使用 ws 作为 WebSocket 客户端。

# 使用方式
```javascript
const danmu = new Danmu({
  // 房间号
  roomId: 301049
  // 弹幕接口
  // wsApi: 'wss://danmuproxy.douyu.com:8503/',
  // 心跳包发送间隔（最多不能超过 45 秒）
  // keepAlive: 40000
})

// connect, disconnect, message, error, rawData, decodeError
danmu.on('message', (payload) => {
  console.log(payload.type)
})

danmu.connect()
danmu.disconnect()
```

# 事件
```
- connect, disconnect, error
  均为 WebSocket 的事件，携带的 event 参考 WebSocket 文档。

- message
  表示接收到新的消息，携带的数据形如 { type: string, xxx: any}
  （不包括解析异常的数据）

- rawData
  表示接收到的新消息的原始形式，携带的数据为 ArrayBuffer 类型
  （不包括解析异常的数据）

- decodeError
  表示解析时发生了异常，携带的数据为 ArrayBuffer 类型
```

# 已知问题
目前发现了几种不符合规范的消息：
```
total@A=15000/num@A=7726/task_id@A=40252/type@A=0/...

parkwavt@=https://apic.douyucdn.cn/upload/avatar/006...
```
问题分别是将连接符号"@="进行了转义，和未将消息体中的"/"进行转义。

不清楚斗鱼还会整出什么奇怪的格式，所以加入了`decodeError`事件进行检查。

# TODO
- [ ] 登录、发送弹幕