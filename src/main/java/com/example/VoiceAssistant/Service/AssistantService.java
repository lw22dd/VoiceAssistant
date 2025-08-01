package com.example.VoiceAssistant.Service;

import com.example.VoiceAssistant.Model.Assistant;

import java.util.List;


public interface AssistantService {
    /**
     * 创建助手
     * @param assistant 助手对象
     * @return 创建成功的助手
     */
    Assistant createAssistant(Assistant assistant);

    /**
     * 根据ID获取助手
     * @param id 助手ID
     * @return 助手对象
     */
    Assistant getAssistantById(int id);

    /**
     * 更新助手
     * @param id 助手ID
     * @param assistant 更新的助手信息
     * @return 更新后的助手对象
     */
    Assistant updateAssistant(int id, Assistant assistant);

    /**
     * 删除助手
     * @param id 助手ID
     * @return 是否删除成功
     */
    boolean deleteAssistant(int id);

    /**
     * 获取所有助手
     * @return 助手列表
     */
    List<Assistant> getAllAssistants();

    /**
     * 分页获取助手列表
     * @param page 页码
     * @param size 每页大小
     * @return 助手列表
     */
    List<Assistant> listAssistants(int page, int size);

    /**
     * 获取助手总数
     * @return 助手总数
     */
    long countAssistants();
}
