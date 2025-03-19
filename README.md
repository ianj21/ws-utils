### ws-utils

### Instructions

实现了一个功能完善的 WebSocket 客户端类 WebSocketClient，支持心跳机制、断线重连和心跳超时重连等功能

### Example

```
import WebSocketClient from "@ianj15/ws-utils";

const wsClient = new WebSocketClient("ws://example.com/socket", {
  onOpen: () => console.log("连接已打开"),
  onMessage: (event) => console.log("收到消息:", event.data),
  onClose: (event) => console.log("连接已关闭", event.code, event.reason),
  onError: (error) => console.error("连接错误:", error),
});

// 发送消息
wsClient.send({ type: "message", content: "Hello, Server!" });

// 关闭连接
// wsClient.close();
```

### API


| 参数                 | 说明                     | 类型            | 默认值 |
| -------------------- | ------------------------ | --------------- | ------ |
| reconnectInterval    | 初始重连间隔时间（毫秒） | number          | 5000   |
| maxReconnectInterval | 最大重连间隔时间（毫秒） | number          | 60000  |
| heartbeatInterval    | 心跳间隔时间（毫秒）     | number          | 30000  |
| heartbeatTimeout     | 心跳超时时间（毫秒）     | number          | 10000  |
| maxReconnectAttempts | 最大重连次数             | number          | 5      |
| maxHeartbeatTimeouts | 最大心跳超时次数         | number          | 3      |
| onOpen               | 连接已打开               | Function        |        |
| onMessage            | 收到消息                 | Function(event) |        |
| onClose              | 连接已关闭               | Function(event) |        |
| onError              | 连接错误                 | Function(event) |        |

### Instructions

实现了一个功能完善的 WebSocket 客户端类 WebSocketClient，支持心跳机制、断线重连和心跳超时重连等功能

### Example

const wsClient = new WebSocketClient("ws://example.com/socket", {
  onOpen: () => console.log("连接已打开"),
  onMessage: (event) => console.log("收到消息:", event.data),
  onClose: (event) => console.log("连接已关闭", event.code, event.reason),
  onError: (error) => console.error("连接错误:", error),
});

// 发送消息
wsClient.send({ type: "message", content: "Hello, Server!" });

// 关闭连接
// wsClient.close();
### API


| 参数                 | 说明                     | 类型            | 默认值 |
| -------------------- | ------------------------ | --------------- | ------ |
| reconnectInterval    | 初始重连间隔时间（毫秒） | number          | 5000   |
| maxReconnectInterval | 最大重连间隔时间（毫秒） | number          | 60000  |
| heartbeatInterval    | 心跳间隔时间（毫秒）     | number          | 30000  |
| heartbeatTimeout     | 心跳超时时间（毫秒）     | number          | 10000  |
| maxReconnectAttempts | 最大重连次数             | number          | 5      |
| maxHeartbeatTimeouts | 最大心跳超时次数         | number          | 3      |
| onOpen               | 连接已打开               | Function        |        |
| onMessage            | 收到消息                 | Function(event) |        |
| onClose              | 连接已关闭               | Function(event) |        |
| onError              | 连接错误                 | Function(event) |        |
