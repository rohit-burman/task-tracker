package com.rohit.TaskApp.service;

import com.rohit.TaskApp.domain.CreateTaskRequest;
import com.rohit.TaskApp.domain.entity.Task;

import java.util.List;

public interface TaskService {
    Task createTask(CreateTaskRequest request);

    List<Task> listTask();
}
