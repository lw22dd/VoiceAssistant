package com.example.VoiceAssistant.Service.Impl;

import com.example.VoiceAssistant.DAO.MessageMapper;
import com.example.VoiceAssistant.DAO.SessionMapper;
import com.example.VoiceAssistant.Model.Message;
import com.example.VoiceAssistant.Model.Session;
import com.example.VoiceAssistant.Service.SessionService;
import com.example.VoiceAssistant.Utils.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SessionServiceImpl implements SessionService {

    @Autowired
    private SessionMapper sessionMapper;

    @Autowired
    private MessageMapper messageMapper;

    @Override
    public Session createSession(Session session) {
        if (session.getCreateTime() == null) {
            session.setCreateTime(LocalDateTime.now());
        }
        session.setLastActive(LocalDateTime.now());
        // 确保 messages 列表已初始化
        if (session.getMessages() == null) {
            session.setMessages(new ArrayList<>());
        }
        sessionMapper.insert(session);
        return session;
    }


    @Override
    public Session createSessionByAssistantId(String assistantId) {
        Session session = new Session();
        session.setSessionId(java.util.UUID.randomUUID().toString());
        session.setAssistantId(assistantId);
        session.setCreateTime(LocalDateTime.now());
        session.setLastActive(LocalDateTime.now());
        sessionMapper.insert(session);
        return session;
    }

    @Override
    public Session getSessionById(String sessionId) {
        Session session = sessionMapper.findById(sessionId);
        if (session != null) {
            List<Message> messages = messageMapper.findBySessionId(sessionId);
            session.setMessages(messages);
        }
        return session;
    }

    @Override
    public List<Session> getSessionsByAssistantId(String assistantId) {
        List<Session> sessions = sessionMapper.findByAssistantId(assistantId);
        // 为每个会话加载消息
        for (Session session : sessions) {
            List<Message> messages = messageMapper.findBySessionId(session.getSessionId());
            session.setMessages(messages);
        }
        return sessions;
    }

    @Override
    public Session updateSession(Session session) {
        session.setLastActive(LocalDateTime.now());
        sessionMapper.update(session);
        return session;
    }

    @Override
    public boolean deleteSession(String sessionId) {
        return sessionMapper.deleteById(sessionId) > 0;
    }

    @Override
    public boolean deleteSessionsByAssistantId(String assistantId) {
        return sessionMapper.deleteSessionsByAssistantId(assistantId) > 0;
    }

    @Override
    public PageResult getAllSessions(int page, int size) {
        int offset = (page - 1) * size;
        List<Session> sessions = sessionMapper.findAll(offset, size);
        long totalCount = sessionMapper.countAll();
        return new PageResult(sessions, totalCount);
    }

    @Override
    public Session appendMessage(String sessionId, Message message) {
        // 设置消息的会话ID和时间戳
        message.setSessionId(sessionId);
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }

        // 插入消息
        messageMapper.insert(message);

        // 获取更新后的会话
        Session session = sessionMapper.findById(sessionId);
        if (session != null) {
            // 更新会话的最后活跃时间
            session.setLastActive(LocalDateTime.now());
            sessionMapper.update(session);

            // 获取会话的所有消息
            List<Message> messages = messageMapper.findBySessionId(sessionId);
            session.setMessages(messages);
        }

        return session;
    }
}
