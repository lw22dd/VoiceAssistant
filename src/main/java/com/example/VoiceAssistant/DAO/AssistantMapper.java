package com.example.VoiceAssistant.DAO;

import com.example.VoiceAssistant.Model.Assistant;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AssistantMapper {

    @Insert("INSERT INTO assistants(name, description, model, prompt, voice_style, extra_params) " +
            "VALUES(#{name}, #{description}, #{model}, #{prompt}, #{voiceStyleJson}, #{extraParamsJson})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Assistant assistant);

    @Select("SELECT id, name, description, model, prompt, voice_style, extra_params FROM assistants WHERE id = #{id}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "name", column = "name"),
        @Result(property = "description", column = "description"),
        @Result(property = "model", column = "model"),
        @Result(property = "prompt", column = "prompt"),
        @Result(property = "voiceStyleJson", column = "voice_style"),
        @Result(property = "extraParamsJson", column = "extra_params")
    })
    Assistant selectById(int id);

    @Select("SELECT id, name, description, model, prompt, voice_style, extra_params FROM assistants")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "name", column = "name"),
        @Result(property = "description", column = "description"),
        @Result(property = "model", column = "model"),
        @Result(property = "prompt", column = "prompt"),
        @Result(property = "voiceStyleJson", column = "voice_style"),
        @Result(property = "extraParamsJson", column = "extra_params")
    })
    List<Assistant> selectAll();

    @Update("UPDATE assistants SET name=#{name}, description=#{description}, model=#{model}, " +
            "prompt=#{prompt}, voice_style=#{voiceStyleJson}, extra_params=#{extraParamsJson} WHERE id=#{id}")
    int update(Assistant assistant);

    @Delete("DELETE FROM assistants WHERE id = #{id}")
    int deleteById(int id);

    @Select("SELECT id, name, description, model, prompt, voice_style, extra_params FROM assistants LIMIT #{limit} OFFSET #{offset}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "name", column = "name"),
        @Result(property = "description", column = "description"),
        @Result(property = "model", column = "model"),
        @Result(property = "prompt", column = "prompt"),
        @Result(property = "voiceStyleJson", column = "voice_style"),
        @Result(property = "extraParamsJson", column = "extra_params")
    })
    List<Assistant> selectWithPagination(@Param("limit") int limit, @Param("offset") int offset);

    @Select("SELECT COUNT(*) FROM assistants")
    int count();

    @Select("SELECT id, name, description, model, prompt, voice_style, extra_params FROM assistants WHERE name = #{name}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "name", column = "name"),
        @Result(property = "description", column = "description"),
        @Result(property = "model", column = "model"),
        @Result(property = "prompt", column = "prompt"),
        @Result(property = "voiceStyleJson", column = "voice_style"),
        @Result(property = "extraParamsJson", column = "extra_params")
    })
    Assistant selectByName(String name);
}
