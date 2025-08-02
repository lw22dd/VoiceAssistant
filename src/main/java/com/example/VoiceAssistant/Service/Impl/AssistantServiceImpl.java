package com.example.VoiceAssistant.Service.Impl;

import com.example.VoiceAssistant.DAO.AssistantMapper;
import com.example.VoiceAssistant.Model.Assistant;
import com.example.VoiceAssistant.Service.AssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssistantServiceImpl implements AssistantService {

    @Autowired
    private AssistantMapper assistantMapper;

    @Override
    public Assistant createAssistant(Assistant assistant) {
        // 验证参数
        validateAssistant(assistant);

        // 检查名称是否已存在
        Assistant existing = assistantMapper.selectByName(assistant.getName());
        if (existing != null) {
            throw new IllegalArgumentException("助手名称 '" + assistant.getName() + "' 已存在");
        }

        assistantMapper.insert(assistant);
        return assistant;
    }

    @Override
    public Assistant getAssistantById(int id) {
        Assistant assistant = assistantMapper.selectById(id);
        if (assistant == null) {
            throw new IllegalArgumentException("助手ID " + id + " 不存在");
        }
        return assistant;
    }

    @Override
    public Assistant updateAssistant(int id, Assistant assistant) {
        // 验证参数
        validateAssistant(assistant);

        Assistant existing = assistantMapper.selectById(id);
        if (existing == null) {
            throw new IllegalArgumentException("助手ID " + id + " 不存在");
        }

        // 检查名称是否与其他助手冲突
        Assistant existingByName = assistantMapper.selectByName(assistant.getName());
        if (existingByName != null && existingByName.getId() != id) {
            throw new IllegalArgumentException("助手名称 '" + assistant.getName() + "' 已存在");
        }

        // 更新助手信息
        existing.setName(assistant.getName());
        existing.setDescription(assistant.getDescription());
        existing.setModel(assistant.getModel());
        existing.setPrompt(assistant.getPrompt());

        assistantMapper.update(existing);
        return existing;
    }

    @Override
    public boolean deleteAssistant(int id) {
        return assistantMapper.deleteById(id) > 0;
    }

    @Override
    public List<Assistant> getAllAssistants() {
        return assistantMapper.selectAll();
    }

    @Override
    public List<Assistant> listAssistants(int page, int size) {
        if (page < 1) page = 1;
        if (size < 1) size = 10;

        int offset = (page - 1) * size;
        return assistantMapper.selectWithPagination(size, offset);
    }

    @Override
    public long countAssistants() {
        return assistantMapper.count();
    }

    /**
     * 验证助手参数
     * @param assistant 助手对象
     */
    private void validateAssistant(Assistant assistant) {
        if (assistant == null) {
            throw new IllegalArgumentException("助手对象不能为空");
        }

        if (assistant.getName() == null || assistant.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("助手名称不能为空");
        }

        if (assistant.getModel() == null || assistant.getModel().trim().isEmpty()) {
            throw new IllegalArgumentException("模型不能为空");
        }
    }
}
