package com.example.VoiceAssistant.Utils;

public class Result {
    private int code;
    private Object data;
    private String message;

    public Result(int code, Object data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public Object getData() {
        return data;
    }

    public String getMessage() {
        return message;
    }
}
