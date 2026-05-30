package com.rohit.TaskApp.mapper.impl;

import com.rohit.TaskApp.domain.CreateTaskRequest;
import com.rohit.TaskApp.domain.dto.CreateTaskRequestDto;
import com.rohit.TaskApp.domain.dto.TaskDto;
import com.rohit.TaskApp.domain.entity.Task;
import com.rohit.TaskApp.mapper.TaskMapper;
import org.springframework.stereotype.Component;

@Component
public class TaskMapperImpl implements TaskMapper {
    @Override
    public CreateTaskRequest fromDto(CreateTaskRequestDto dto) {
        return new CreateTaskRequest(
                dto.title(),
                dto.description(),
                dto.dueDate(),
                dto.priority()
        );
    }

    @Override
    public TaskDto toDto(Task task) {
        if (null == task) return null;
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus()
        );
    }
}
