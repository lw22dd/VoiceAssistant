package com.example.VoiceAssistant.Model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Session {
    private String sessionId;
    private String assistantId;
    private LocalDateTime createTime;
    private LocalDateTime lastActive;
    private List<Message> messages;

    // 构造函数
    public Session() {
        this.messages = new ArrayList<>();
    }

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }



    public String getAssistantId() {
        return assistantId;
    }

    public void setAssistantId(String assistantId) {
        this.assistantId = assistantId;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public LocalDateTime getLastActive() {
        return lastActive;
    }

    public void setLastActive(LocalDateTime lastActive) {
        this.lastActive = lastActive;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}
