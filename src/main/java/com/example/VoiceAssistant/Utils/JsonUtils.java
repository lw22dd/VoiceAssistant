package com.example.VoiceAssistant.Utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * JSON工具类，提供对象与JSON字符串的相互转换功能
 */
public class JsonUtils {

    // 单例ObjectMapper实例
    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 将对象序列化为JSON字符串
     *
     * @param obj 要序列化的对象
     * @return JSON字符串
     * @throws JsonProcessingException 序列化异常
     */
    public static String toJson(Object obj) throws JsonProcessingException {
        if (obj == null) {
            return null;
        }
        return objectMapper.writeValueAsString(obj);
    }

    /**
     * 将JSON字符串反序列化为指定类型的对象
     *
     * @param json  JSON字符串
     * @param clazz 目标对象类型
     * @param <T>   泛型参数
     * @return 反序列化后的对象
     * @throws IOException 反序列化异常
     */
    public static <T> T fromJson(String json, Class<T> clazz) throws IOException {
        if (json == null || json.isEmpty()) {
            return null;
        }
        return objectMapper.readValue(json, clazz);
    }

    /**
     * 将JSON字符串反序列化为指定类型的List集合
     *
     * @param json  JSON字符串
     * @param clazz 集合元素类型
     * @param <T>   泛型参数
     * @return 反序列化后的List集合
     * @throws IOException 反序列化异常
     */
    public static <T> List<T> fromJsonList(String json, Class<T> clazz) throws IOException {
        if (json == null || json.isEmpty()) {
            return null;
        }
        JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, clazz);
        return objectMapper.readValue(json, javaType);
    }

    /**
     * 将JSON字符串反序列化为Map<String, Object>
     *
     * @param json JSON字符串
     * @return 反序列化后的Map
     * @throws IOException 反序列化异常
     */
    public static Map<String, Object> fromJsonToMap(String json) throws IOException {
        if (json == null || json.isEmpty()) {
            return null;
        }
        return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
    }

    /**
     * 将JSON字符串反序列化为指定键值类型的Map
     *
     * @param json        JSON字符串
     * @param keyClass    键类型
     * @param valueClass  值类型
     * @param <K>         键泛型
     * @param <V>         值泛型
     * @return 反序列化后的Map
     * @throws IOException 反序列化异常
     */
    public static <K, V> Map<K, V> fromJsonToMap(String json, Class<K> keyClass, Class<V> valueClass) throws IOException {
        if (json == null || json.isEmpty()) {
            return null;
        }
        JavaType javaType = objectMapper.getTypeFactory().constructParametricType(Map.class, keyClass, valueClass);
        return objectMapper.readValue(json, javaType);
    }

    /**
     * 私有构造方法，防止实例化
     */
    private JsonUtils() {
        throw new AssertionError("工具类不允许实例化");
    }






}
