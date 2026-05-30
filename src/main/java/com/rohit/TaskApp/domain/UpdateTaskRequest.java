package com.rohit.TaskApp.domain;

import com.rohit.TaskApp.domain.entity.TaskPriority;
import com.rohit.TaskApp.domain.entity.TaskStatus;

import java.time.LocalDate;

public record UpdateTaskRequest(
        String title,
        String description,
        LocalDate dueDate,
        TaskPriority priority,
        TaskStatus status
) {
}
