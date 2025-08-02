import { WebSocketMessage } from '@/model/WebSocketMessageModel';


// WebSocket 客户端包括构造函数，连接，发送消息，关闭连接，重连，和事件监听器功能
// 这里是直接调用WS API的实现， 第一个 WebSocket 实例：连接到 Go 后端，用于常规的文本消息交互。

export default class WebSocketClient {
    private ws: WebSocket | null = null; // 浏览器提供的WebSocket 实例
    private readonly maxReconnectAttempts = 5;
    private readonly reconnectDelay = 3000; // 重连延迟时间（毫秒）在handleReconnect使用
    private isConnecting = false;
    private baseUrl: string;
    private msgCallback: (msg: WebSocketMessage) => void;


    constructor(msgCallback: (msg: any) => void, baseUrl: string) {
        this.msgCallback = msgCallback;
        this.baseUrl = baseUrl;

    }

    // 设置 WebSocket 事件监听器，当WebSocket连接建立，关闭，错误，收到消息时自动触发
    //这些事件监听器相当于WebSocket的生命周期函数,用于监听WebSocket连接的不同状态和事件
    private setupEventListeners() {
        if (!this.ws) return;

        this.ws.onopen = () => {
            console.log('WebSocket 连接已建立');
            this.ws?.send(JSON.stringify({ type: 'pong' })); 
            this.isConnecting = false;
        };

        this.ws.onclose = async () => {
            console.log('WebSocket 连接已关闭');
            await this.handleReconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket 错误:', error);
        };

        // 收到消息时触发
        this.ws.onmessage = (event) => {
            try {
                //console.log('收到消息:', event.data);
                const data: WebSocketMessage | undefined = JSON.parse(event.data);
                if (!data || !("type" in data)) {
                    return;
                }
                this.msgCallback(data);
            } catch (error) {
                console.error('消息解析失败:', error);
            }
        };
    }

    // 尝试重连函数私有方法，在连接异常断开时自动调用，实现重试计数和延迟机制，用于异常情况的自动恢复
    private async handleReconnect(retried: number = 0) {
        if (retried >= this.maxReconnectAttempts) {
            console.error('WebSocket 重连次数已达上限');
            return;
        }
        console.log(`尝试重连 (${retried + 1}/${this.maxReconnectAttempts})...`);
        //通过 Promise 实现延迟，每次重连间隔固定延迟时间，避免高频请求冲击服务器
        await new Promise((resolve) => { //创建延迟 Promise
            //启动定时器 setTimeout
            setTimeout(() => {
                resolve(true); //等待 reconnectDelay 时间后执行resolve(true)
            }, this.reconnectDelay);
            // Promise 状态变为 fulfilled
        });
        await this.connect(retried + 1);
    }

    // 连接 WebSocket
    public async connect(retried: number = 0) {
        if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
            return;
        }

        this.isConnecting = true;

        try {
            // 创建 WebSocket 实例
            this.ws = new WebSocket(`${this.baseUrl}`);
            this.setupEventListeners();// 设置监听器
            await new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    if (this.ws?.readyState === WebSocket.OPEN) {
                        clearInterval(interval);
                        resolve(true);
                    } else if (this.ws?.readyState === WebSocket.CLOSED) {
                        reject(new Error('WebSocket 连接已关闭'));
                    }
                }, 100);
            });
        } catch (error) {
            console.error('WebSocket 连接失败:', error);
            await this.handleReconnect(retried);
        }
    }

    // 前端主动发送消息
    public send(data: any) {
        if (this.ws?.readyState !== WebSocket.OPEN) {
            console.error('WebSocket 未连接');
            return false;
        }

        try {
            // 触发后端 WebSocket 的 @OnMessage 方法
            this.ws.send(JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('发送消息失败:', error);
            return false;
        }
    }
    public disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    // 获取WS状态，主要是用来检查和debug的
    public getStatus(): string {
        if (!this.ws) return 'CLOSED';

        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return 'CONNECTING';
            case WebSocket.OPEN:
                return 'OPEN';
            case WebSocket.CLOSING:
                return 'CLOSING';
            case WebSocket.CLOSED:
                return 'CLOSED';
            default:
                return 'UNKNOWN';
        }
    }
/*
    
    //(手动重连)公开方法，供外部主动调用，不包含重试机制，用于主动重置连接
    public async reconnect() {
        this.disconnect();
        await this.connect();
    }
    */
}