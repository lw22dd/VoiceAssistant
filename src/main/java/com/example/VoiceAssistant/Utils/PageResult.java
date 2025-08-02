package com.example.VoiceAssistant.Utils;

import com.example.VoiceAssistant.Model.Assistant;

import java.util.List;

public class PageResult<T> {
    private List<T> items;
    private long totalCount;

    public PageResult(List<T> items, long totalCount) {
        this.items = items;
        this.totalCount = totalCount;
    }

    public List<T> getItems() {
        return items;
    }

    public long getTotalCount() {
        return totalCount;
    }
}
