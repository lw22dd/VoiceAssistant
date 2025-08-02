import { WebSocketMessageType } from '@/enums/WebSocketMessageType';

export interface WebSocketMessage {
    id: string;
    type: WebSocketMessageType;
    stream?: boolean; // 是否流式传输
    data?: any; // 注意json化
    sdp?: any;
    call?: string;    // offer
    answer?: string;  // answer
    candidate?: string;
    command?: string; // 用于指令

    //timestamp?: number; // 时间戳暂时不要
}
