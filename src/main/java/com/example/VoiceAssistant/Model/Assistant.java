package com.example.VoiceAssistant.Model;

import com.example.VoiceAssistant.Utils.JsonUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Map;
import java.util.HashMap;

public class Assistant {
    private int id;
    private String name;
    private String description;
    private String model;
    private String prompt;
    private VoiceStyle voiceStyle;
    private Map<String, String> extraParams;

    // 用于JSON序列化的字段
    private String voiceStyleJson;
    private String extraParamsJson;

    public Assistant() {
        this.extraParams = new HashMap<>();
        this.voiceStyle = new VoiceStyle();
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public VoiceStyle getVoiceStyle() {
        // 如果voiceStyle为null但有JSON数据，则反序列化
        if (voiceStyle == null && voiceStyleJson != null) {
            voiceStyle = JsonUtils.fromJson(voiceStyleJson, VoiceStyle.class);
        }
        return voiceStyle;
    }

    public void setVoiceStyle(VoiceStyle voiceStyle) {
        this.voiceStyle = voiceStyle;
        // 同时更新JSON字段
        this.voiceStyleJson = JsonUtils.toJson(voiceStyle);
    }

    public Map<String, String> getExtraParams() {
        // 如果extraParams为null但有JSON数据，则反序列化
        if (extraParams == null && extraParamsJson != null) {
            extraParams = JsonUtils.fromJson(extraParamsJson,
                new com.fasterxml.jackson.core.type.TypeReference<Map<String, String>>() {});
        }
        return extraParams;
    }

    public void setExtraParams(Map<String, String> extraParams) {
        this.extraParams = extraParams;
        // 同时更新JSON字段
        this.extraParamsJson = JsonUtils.toJson(extraParams);
    }

    // JSON字段的getter和setter，供MyBatis使用
    @JsonIgnore
    public String getVoiceStyleJson() {
        // 如果有对象但没有JSON，则序列化
        if (voiceStyleJson == null && voiceStyle != null) {
            voiceStyleJson = JsonUtils.toJson(voiceStyle);
        }
        return voiceStyleJson;
    }

    public void setVoiceStyleJson(String voiceStyleJson) {
        this.voiceStyleJson = voiceStyleJson;
    }

    @JsonIgnore
    public String getExtraParamsJson() {
        // 如果有对象但没有JSON，则序列化
        if (extraParamsJson == null && extraParams != null) {
            extraParamsJson = JsonUtils.toJson(extraParams);
        }
        return extraParamsJson;
    }

    public void setExtraParamsJson(String extraParamsJson) {
        this.extraParamsJson = extraParamsJson;
    }
}
