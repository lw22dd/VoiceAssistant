package com.example.VoiceAssistant.Model;

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
        return voiceStyle;
    }

    public void setVoiceStyle(VoiceStyle voiceStyle) {
        this.voiceStyle = voiceStyle;
    }

    public Map<String, String> getExtraParams() {
        return extraParams;
    }

    public void setExtraParams(Map<String, String> extraParams) {
        this.extraParams = extraParams;
    }
}
