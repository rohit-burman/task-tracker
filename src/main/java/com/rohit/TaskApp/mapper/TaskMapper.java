package com.rohit.TaskApp.mapper;

import com.rohit.TaskApp.domain.CreateTaskRequest;
import com.rohit.TaskApp.domain.UpdateTaskRequest;
import com.rohit.TaskApp.domain.dto.CreateTaskRequestDto;
import com.rohit.TaskApp.domain.dto.TaskDto;
import com.rohit.TaskApp.domain.dto.UpdateTaskRequestDto;
import com.rohit.TaskApp.domain.entity.Task;


public interface TaskMapper {
    CreateTaskRequest fromDto(CreateTaskRequestDto dto);
    TaskDto toDto(Task task);
    UpdateTaskRequest fromDto(UpdateTaskRequestDto dto);

}
