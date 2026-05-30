package com.rohit.TaskApp.mapper;

import com.rohit.TaskApp.domain.CreateTaskRequest;
import com.rohit.TaskApp.domain.dto.CreateTaskRequestDto;
import com.rohit.TaskApp.domain.dto.TaskDto;
import com.rohit.TaskApp.domain.entity.Task;


public interface TaskMapper {
    CreateTaskRequest fromDto(CreateTaskRequestDto dto);
    TaskDto toDto(Task task);
}
