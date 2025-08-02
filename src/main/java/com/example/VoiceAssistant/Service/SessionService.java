package com.example.VoiceAssistant.Service;

import com.example.VoiceAssistant.Model.Message;
import com.example.VoiceAssistant.Model.Session;
import com.example.VoiceAssistant.Utils.PageResult;

import java.util.List;

public interface SessionService {

    Session createSession(Session session);

    Session getSessionById(String sessionId);

    List<Session> getSessionsByAssistantId(String assistantId);

    Session updateSession(Session session);

    boolean deleteSession(String sessionId);

    boolean deleteSessionsByAssistantId(String assistantId);

    PageResult getAllSessions(int page, int size);

    Session appendMessage(String sessionId, Message message);

    // 在 SessionService.java 中添加
    Session createSessionByAssistantId(String assistantId);

}
