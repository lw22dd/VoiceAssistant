package com.example.VoiceAssistant.DAO;

import com.example.VoiceAssistant.Model.Session;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SessionMapper {

    @Insert("INSERT INTO session(session_id,  assistant_id, create_time, last_active) " +
            "VALUES(#{sessionId},  #{assistantId}, #{createTime}, #{lastActive})")
    @Options(useGeneratedKeys = true, keyProperty = "sessionId")
    int insert(Session session);

    @Select("SELECT * FROM session WHERE session_id = #{sessionId}")
    @Results({
            @Result(property = "sessionId", column = "session_id"),
            @Result(property = "assistantId", column = "assistant_id"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "lastActive", column = "last_active")
    })
    Session findById(String sessionId);

    @Select("SELECT * FROM session WHERE assistant_id = #{assistantId}")
    @Results({
        @Result(property = "sessionId", column = "session_id"),
        @Result(property = "assistantId", column = "assistant_id"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "lastActive", column = "last_active")
    })
    List<Session> findByAssistantId(String assistantId);

    @Update("UPDATE session SET  assistant_id = #{assistantId}, " +
            "last_active = #{lastActive} WHERE id = #{sessionId}")
    int update(Session session);

    @Delete("DELETE FROM session WHERE id = #{sessionId}")
    int deleteById(String sessionId);

    @Delete("DELETE FROM session WHERE assistant_id = #{assistantId}")
    int deleteSessionsByAssistantId(String assistantId);

    @Select("SELECT * FROM session LIMIT #{offset}, #{limit}")
    @Results({
        @Result(property = "sessionId", column = "session_id"),
        @Result(property = "assistantId", column = "assistant_id"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "lastActive", column = "last_active")
    })
    List<Session> findAll(@Param("offset") int offset, @Param("limit") int limit);

    @Select("SELECT COUNT(*) FROM session")
    long countAll();

    @Insert("INSERT INTO message(session_id, role, content, type, timestamp) " +
            "VALUES(#{sessionId}, #{role}, #{content}, #{type}, #{timestamp})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertMessage(com.example.VoiceAssistant.Model.Message message);

    @Select("SELECT * FROM message WHERE session_id = #{sessionId} ORDER BY timestamp ASC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "sessionId", column = "session_id"),
        @Result(property = "role", column = "role"),
        @Result(property = "content", column = "content"),
        @Result(property = "type", column = "type"),
        @Result(property = "timestamp", column = "timestamp")
    })
    List<com.example.VoiceAssistant.Model.Message> findMessagesBySessionId(String sessionId);
}
