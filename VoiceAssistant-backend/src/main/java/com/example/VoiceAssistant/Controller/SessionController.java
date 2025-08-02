package com.example.VoiceAssistant.Controller;

import com.example.VoiceAssistant.Model.Message;
import com.example.VoiceAssistant.Model.Session;
import com.example.VoiceAssistant.Service.SessionService;
import com.example.VoiceAssistant.Utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/session")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public Result createSession(@RequestBody Session session) {
        try {
            Session createdSession = sessionService.createSession(session);
            return new Result(200, createdSession, "Session created successfully");
        } catch (Exception e) {
            return new Result(500, null, "Failed to create session: " + e.getMessage());
        }
    }

    // 在 SessionController.java 中添加
    @PostMapping("/create/{assistantId}")
    public Result createSessionByAssistantId(@PathVariable String assistantId) {
        try {
            Session createdSession = sessionService.createSessionByAssistantId(assistantId);
            return new Result(200, createdSession, "Session created successfully");
        } catch (Exception e) {
            return new Result(500, null, "Failed to create session: " + e.getMessage());
        }
    }

    @GetMapping("/{sessionId}")
    public Result getSessionById(@PathVariable String sessionId) {
        try {
            Session session = sessionService.getSessionById(sessionId);
            if (session != null) {
                return new Result(200, session, "Session found");
            } else {
                return new Result(404, null, "Session not found");
            }
        } catch (Exception e) {
            return new Result(500, null, "Failed to retrieve session: " + e.getMessage());
        }
    }

    @GetMapping("/assistant/{assistantId}")
    public Result getSessionsByAssistantId(@PathVariable String assistantId) {
        try {
            List<Session> sessions = sessionService.getSessionsByAssistantId(assistantId);
            return new Result(200, sessions, "Sessions retrieved successfully");
        } catch (Exception e) {
            return new Result(500, null, "Failed to retrieve sessions: " + e.getMessage());
        }
    }

    @PutMapping
    public Result updateSession(@RequestBody Session session) {
        try {
            Session updatedSession = sessionService.updateSession(session);
            return new Result(200, updatedSession, "Session updated successfully");
        } catch (Exception e) {
            return new Result(500, null, "Failed to update session: " + e.getMessage());
        }
    }

    @DeleteMapping("/{sessionId}")
    public Result deleteSession(@PathVariable String sessionId) {
        try {
            boolean deleted = sessionService.deleteSession(sessionId);
            if (deleted) {
                return new Result(200, null, "Session deleted successfully");
            } else {
                return new Result(404, null, "Session not found");
            }
        } catch (Exception e) {
            return new Result(500, null, "Failed to delete session: " + e.getMessage());
        }
    }

    @DeleteMapping("/assistant/{assistantId}")
    public Result deleteSessionsByAssistantId(@PathVariable String assistantId) {
        try {
            boolean deleted = sessionService.deleteSessionsByAssistantId(assistantId);
            if (deleted) {
                return new Result(200, null, "Sessions deleted successfully");
            } else {
                return new Result(404, null, "No sessions found for this assistant");
            }
        } catch (Exception e) {
            return new Result(500, null, "Failed to delete sessions: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public Result getAllSessions(@RequestParam(defaultValue = "1") int page,
                                 @RequestParam(defaultValue = "10") int size) {
        try {
            return new Result(200, sessionService.getAllSessions(page, size), "Sessions retrieved successfully");
        } catch (Exception e) {
            return new Result(500, null, "Failed to retrieve sessions: " + e.getMessage());
        }
    }

    @PostMapping("/{sessionId}/context/appendMessage")
    public Result appendMessage(@PathVariable String sessionId, @RequestBody Message message) {
        try {
            Session updatedSession = sessionService.appendMessage(sessionId, message);
            if (updatedSession != null) {
                return new Result(200, updatedSession, "Message appended successfully");
            } else {
                return new Result(404, null, "Session not found");
            }
        } catch (Exception e) {
            return new Result(500, null, "Failed to append message: " + e.getMessage());
        }
    }
}
