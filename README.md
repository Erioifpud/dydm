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

// connect, disconnect, message, error
danmu.on('message', (payload) => {
  console.log(payload.type)
})

danmu.connect()
```

# TODO
- [ ] 登录、发送弹幕
- [ ] 根据信息类型进行封装