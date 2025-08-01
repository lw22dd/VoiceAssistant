package com.example.VoiceAssistant.DAO;

import com.example.VoiceAssistant.Model.Assistant;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AssistantMapper {

    /**
     * 结果集映射（解决数据库字段与实体类驼峰命名映射问题）
     */
    @Results(id = "AssistantResultMap", value = {
            @Result(column = "id", property = "id"),
            @Result(column = "name", property = "name"),
            @Result(column = "description", property = "description"),
            @Result(column = "model", property = "model"),
            @Result(column = "prompt", property = "prompt"),
            @Result(column = "voice_style_json", property = "voiceStyleJson"),
            @Result(column = "extra_params_json", property = "extraParamsJson")
    })
    @Select("SELECT * FROM assistant WHERE id = #{id}")
    Assistant selectById(int id);

    /**
     * 根据名称查询助手
     */
    @ResultMap("AssistantResultMap")
    @Select("SELECT * FROM assistant WHERE name = #{name}")
    Assistant selectByName(String name);

    /**
     * 插入助手
     */
    @Insert("INSERT INTO assistant (" +
            "name, description, model, prompt, " +
            "voice_style_json, extra_params_json" +
            ") VALUES (" +
            "#{name}, #{description}, #{model}, #{prompt}, " +
            "#{voiceStyleJson}, #{extraParamsJson}" +
            ")")
    @Options(useGeneratedKeys = true, keyProperty = "id") // 自动生成主键并赋值给id字段
    int insert(Assistant assistant);

    /**
     * 更新助手信息
     */
    @Update("UPDATE assistant SET " +
            "name = #{name}, " +
            "description = #{description}, " +
            "model = #{model}, " +
            "prompt = #{prompt}, " +
            "voice_style_json = #{voiceStyleJson}, " +
            "extra_params_json = #{extraParamsJson} " +
            "WHERE id = #{id}")
    int update(Assistant assistant);

    /**
     * 根据ID删除助手
     */
    @Delete("DELETE FROM assistant WHERE id = #{id}")
    int deleteById(int id);

    /**
     * 查询所有助手
     */
    @ResultMap("AssistantResultMap")
    @Select("SELECT * FROM assistant")
    List<Assistant> selectAll();

    /**
     * 分页查询助手
     */
    @ResultMap("AssistantResultMap")
    @Select("SELECT * FROM assistant LIMIT #{offset}, #{size}")
    List<Assistant> selectWithPagination(@Param("size") int size, @Param("offset") int offset);

    /**
     * 统计助手总数
     */
    @Select("SELECT COUNT(*) FROM assistant")
    long count();
}