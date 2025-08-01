package com.example.VoiceAssistant.Model;

public class VoiceStyle {
    private double speed;       // 语速 (0.5-2.0)
    private double pitch;       // 音高 (0.5-2.0)
    private double volume;      // 音量 (0.0-1.0)
    private String emotion;     // 情感 (neutral, happy, sad, angry)
    private double temperature; // 语言模型温度 (0.1-1.0)

    public VoiceStyle() {
        // 设置默认值
        this.speed = 1.0;
        this.pitch = 1.0;
        this.volume = 1.0;
        this.emotion = "neutral";
        this.temperature = 0.7;
    }

    // Getters and Setters
    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public double getPitch() {
        return pitch;
    }

    public void setPitch(double pitch) {
        this.pitch = pitch;
    }

    public double getVolume() {
        return volume;
    }

    public void setVolume(double volume) {
        this.volume = volume;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        VoiceStyle that = (VoiceStyle) obj;
        return Double.compare(that.speed, speed) == 0 &&
               Double.compare(that.pitch, pitch) == 0 &&
               Double.compare(that.volume, volume) == 0 &&
               Double.compare(that.temperature, temperature) == 0 &&
               emotion.equals(that.emotion);
    }

    @Override
    public String toString() {
        return "VoiceStyle{" +
                "speed=" + speed +
                ", pitch=" + pitch +
                ", volume=" + volume +
                ", emotion='" + emotion + '\'' +
                ", temperature=" + temperature +
                '}';
    }
}
