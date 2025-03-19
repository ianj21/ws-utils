type WebSocketEventCallback = (event?: Event) => void;
type WebSocketMessageCallback = (event: MessageEvent) => void;
type WebSocketErrorCallback = (event: ErrorEvent) => void;

interface WebSocketClientOptions {
  reconnectInterval?: number;
  maxReconnectInterval?: number;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
  maxReconnectAttempts?: number;
  maxHeartbeatTimeouts?: number;
  onOpen?: WebSocketEventCallback;
  onMessage?: WebSocketMessageCallback;
  onClose?: WebSocketEventCallback;
  onError?: WebSocketErrorCallback;
}

class WebSocketClient {
  private url: string;
  private ws: WebSocket | null;
  private reconnectInterval: number;
  private maxReconnectInterval: number;
  private heartbeatInterval: number;
  private heartbeatTimeout: number;
  private maxReconnectAttempts: number;
  private maxHeartbeatTimeouts: number;
  private heartbeatTimer: NodeJS.Timeout | null;
  private reconnectTimer: NodeJS.Timeout | null;
  private isReconnecting: boolean;
  private reconnectAttempts: number;
  private heartbeatTimeoutCount: number;
  private messageQueue: any[];
  private onOpen: WebSocketEventCallback;
  private onMessage: WebSocketMessageCallback;
  private onClose: WebSocketEventCallback;
  private onError: WebSocketErrorCallback;
  private heartbeatTimeoutId: NodeJS.Timeout | null | undefined;

  constructor(url: string, options: WebSocketClientOptions = {}) {
    this.url = url;
    this.ws = null;
    this.reconnectInterval = options.reconnectInterval || 5000; // 初始重连间隔时间（毫秒）
    this.maxReconnectInterval = options.maxReconnectInterval || 60000; // 最大重连间隔时间（毫秒）
    this.heartbeatInterval = options.heartbeatInterval || 30000; // 心跳间隔时间（毫秒）
    this.heartbeatTimeout = options.heartbeatTimeout || 10000; // 心跳超时时间（毫秒）
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5; // 最大重连次数
    this.maxHeartbeatTimeouts = options.maxHeartbeatTimeouts || 3; // 最大心跳超时次数
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.isReconnecting = false;
    this.reconnectAttempts = 0;
    this.heartbeatTimeoutCount = 0; // 心跳超时计数器
    this.messageQueue = [];
    this.onOpen = options.onOpen || (() => {});
    this.onMessage = options.onMessage || (() => {});
    this.onClose = options.onClose || (() => {});
    this.onError = options.onError || (() => {});
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket 连接已打开");
      this.isReconnecting = false;
      this.reconnectAttempts = 0;
      this.heartbeatTimeoutCount = 0; // 重置心跳超时计数器
      this.startHeartbeat();
      this.flushMessageQueue();
      this.onOpen();
    };

    this.ws.onmessage = (event) => {
      console.log("收到消息:", event.data);
      if (event.data === JSON.stringify({ type: "heartbeat" })) {
        this.resetHeartbeatTimeout();
      }
      this.onMessage(event);
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket 连接已关闭", event.code, event.reason);
      this.stopHeartbeat();
      this.onClose(event);
      if (
        !this.isReconnecting &&
        event.code !== 1000 &&
        event.code !== 1001 &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnect();
      }
    };

    this.ws.onerror = (error: any) => {
      console.error("WebSocket 错误:", error);
      this.onError(error);
    };
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "heartbeat" }));
        this.setHeartbeatTimeout();
      }
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    clearInterval(this.heartbeatTimer!);
    clearTimeout(this.heartbeatTimeoutId!);
  }

  setHeartbeatTimeout() {
    clearTimeout(this.heartbeatTimeoutId!);
    this.heartbeatTimeoutId = setTimeout(() => {
      console.log("心跳超时，增加超时计数器");
      this.heartbeatTimeoutCount++;
      if (this.heartbeatTimeoutCount >= this.maxHeartbeatTimeouts) {
        console.log("达到最大心跳超时次数，尝试重新连接");
        this.ws!.close();
      } else {
        this.setHeartbeatTimeout(); // 重新设置超时定时器
      }
    }, this.heartbeatTimeout);
  }

  resetHeartbeatTimeout() {
    this.heartbeatTimeoutCount = 0; // 重置心跳超时计数器
    this.setHeartbeatTimeout();
  }

  reconnect() {
    this.isReconnecting = true;
    const interval = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectInterval
    );
    this.reconnectTimer = setTimeout(() => {
      console.log(`尝试重新连接...（第 ${this.reconnectAttempts + 1} 次）`);
      this.reconnectAttempts++;
      this.connect();
    }, interval);
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      this.messageQueue.push(data);
    }
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }

  close() {
    this.ws?.close(1000, "手动关闭");
    this.stopHeartbeat();
    clearTimeout(this.reconnectTimer!);
  }
}

export default WebSocketClient
