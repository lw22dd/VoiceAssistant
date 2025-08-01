package com.example.VoiceAssistant.Utils;

import com.example.VoiceAssistant.Model.Assistant;

import java.util.List;

public class PageResult {
    private List<Assistant> items;
    private long totalCount;

    public PageResult(List<Assistant> items, long totalCount) {
        this.items = items;
        this.totalCount = totalCount;
    }

    public List<Assistant> getItems() {
        return items;
    }

    public long getTotalCount() {
        return totalCount;
    }
}
