package com.rohit.TaskApp.controller;

import com.rohit.TaskApp.domain.CreateTaskRequest;
import com.rohit.TaskApp.domain.UpdateTaskRequest;
import com.rohit.TaskApp.domain.dto.CreateTaskRequestDto;
import com.rohit.TaskApp.domain.dto.TaskDto;
import com.rohit.TaskApp.domain.dto.UpdateTaskRequestDto;
import com.rohit.TaskApp.domain.entity.Task;
import com.rohit.TaskApp.mapper.TaskMapper;
import com.rohit.TaskApp.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1/tasks")
@CrossOrigin(
        origins = {
                "https://task-tracker-production-b534.up.railway.app/",
                "http://localhost:8080/"
        }
)
public class TaskController {
    private final TaskService taskService;
    private final TaskMapper taskMapper;


    public TaskController(TaskService taskService, TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(
            @Valid @RequestBody CreateTaskRequestDto createTaskRequestDto){
        CreateTaskRequest taskToCreate = taskMapper.fromDto(createTaskRequestDto);

        Task createdTask = taskService.createTask(taskToCreate);

        TaskDto createdTaskDto = taskMapper.toDto(createdTask);

        return new ResponseEntity<>(createdTaskDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> listTask(){
        List<Task> tasks = taskService.listTask();
        List<TaskDto> taskDtoList = tasks.stream().map(taskMapper::toDto).toList();
        return ResponseEntity.ok(taskDtoList);
    }

    @PutMapping(path = "/{taskId}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskRequestDto updateTaskRequestDto){

        UpdateTaskRequest updateTaskRequest = taskMapper.fromDto(updateTaskRequestDto);
        Task updatedTask = taskService.updateTask(taskId,updateTaskRequest);
        TaskDto taskMapDto = taskMapper.toDto(updatedTask);
        return ResponseEntity.ok(taskMapDto);
    }

    @DeleteMapping(path = "/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID taskId) {

        taskService.deleteTask(taskId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }
}
