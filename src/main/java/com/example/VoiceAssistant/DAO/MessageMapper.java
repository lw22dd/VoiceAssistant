package com.example.VoiceAssistant.DAO;

import com.example.VoiceAssistant.Model.Message;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MessageMapper {

    @Insert("INSERT INTO message(session_id, role, content, type, timestamp) " +
            "VALUES(#{sessionId}, #{role}, #{content}, #{type}, #{timestamp})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Message message);

    @Select("SELECT * FROM message WHERE session_id = #{sessionId} ORDER BY timestamp ASC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "sessionId", column = "session_id"),
        @Result(property = "role", column = "role"),
        @Result(property = "content", column = "content"),
        @Result(property = "type", column = "type"),
        @Result(property = "timestamp", column = "timestamp")
    })
    List<Message> findBySessionId(String sessionId);
}
