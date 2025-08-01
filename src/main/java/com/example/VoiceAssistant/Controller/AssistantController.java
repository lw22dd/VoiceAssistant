package com.example.VoiceAssistant.Controller;


import com.example.VoiceAssistant.Model.Assistant;
import com.example.VoiceAssistant.Service.AssistantService;
import com.example.VoiceAssistant.Utils.PageResult;
import com.example.VoiceAssistant.Utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assistants")
public class AssistantController {

    @Autowired
    private AssistantService assistantService;

    @PostMapping
    public Result createAssistant(@RequestBody Assistant assistant) {
        try {
            Assistant created = assistantService.createAssistant(assistant);
            return new Result(200, created, "创建成功");
        } catch (Exception e) {
            return new Result(400, null, "创建失败: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result getAssistantById(@PathVariable int id) {
        try {
            Assistant assistant = assistantService.getAssistantById(id);
            return new Result(200, assistant, "获取成功");
        } catch (Exception e) {
            return new Result(404, null, "获取失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Result updateAssistant(@PathVariable int id, @RequestBody Assistant assistant) {
        try {
            Assistant updated = assistantService.updateAssistant(id, assistant);
            return new Result(200, updated, "更新成功");
        } catch (Exception e) {
            return new Result(400, null, "更新失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result deleteAssistant(@PathVariable int id) {
        try {
            boolean deleted = assistantService.deleteAssistant(id);
            if (deleted) {
                return new Result(200, null, "删除成功");
            } else {
                return new Result(404, null, "助手不存在");
            }
        } catch (Exception e) {
            return new Result(400, null, "删除失败: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public Result getAllAssistants() {
        try {
            List<Assistant> assistants = assistantService.getAllAssistants();
            return new Result(200, assistants, "获取成功");
        } catch (Exception e) {
            return new Result(400, null, "获取失败: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public Result listAssistants(@RequestParam(defaultValue = "1") int page,
                                 @RequestParam(defaultValue = "10") int size) {
        try {
            List<Assistant> assistants = assistantService.listAssistants(page, size);
            long total = assistantService.countAssistants();
            return new Result(200, new PageResult(assistants, total), "获取成功");
        } catch (Exception e) {
            return new Result(400, null, "获取失败: " + e.getMessage());
        }
    }
    @GetMapping("/ping")
    public String ping(){
        return "pongpong";
    }

}
