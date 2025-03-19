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
declare class WebSocketClient {
    private url;
    private ws;
    private reconnectInterval;
    private maxReconnectInterval;
    private heartbeatInterval;
    private heartbeatTimeout;
    private maxReconnectAttempts;
    private maxHeartbeatTimeouts;
    private heartbeatTimer;
    private reconnectTimer;
    private isReconnecting;
    private reconnectAttempts;
    private heartbeatTimeoutCount;
    private messageQueue;
    private onOpen;
    private onMessage;
    private onClose;
    private onError;
    private heartbeatTimeoutId;
    constructor(url: string, options?: WebSocketClientOptions);
    connect(): void;
    startHeartbeat(): void;
    stopHeartbeat(): void;
    setHeartbeatTimeout(): void;
    resetHeartbeatTimeout(): void;
    reconnect(): void;
    send(data: any): void;
    flushMessageQueue(): void;
    close(): void;
}

export { WebSocketClient as default };
