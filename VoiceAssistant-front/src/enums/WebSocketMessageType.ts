export enum WebSocketMessageType {
    Ping = 'Ping', // 服务器主动ping
    Pong = 'Pong', // 客户端主动pong
    Voice = 'Voice',
    Text = 'Text',
    call = 'call',
    heartbeat = 'heartbeat', // 心跳消息
    answer = 'answer',
    offer = 'offer',
    candidate = 'candidate',
    llm_reply = "llm_reply",
    asr = "asr",
    tool_status = "tool_status",
  
    hangup = "hangup",
    llm_reply_stream = 'llm_reply_stream',
    

}

