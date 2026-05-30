package com.rohit.TaskApp.service.impl;

import com.rohit.TaskApp.domain.CreateTaskRequest;
import com.rohit.TaskApp.domain.entity.Task;
import com.rohit.TaskApp.domain.entity.TaskStatus;
import com.rohit.TaskApp.repository.TaskRepository;
import com.rohit.TaskApp.service.TaskService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Task createTask(CreateTaskRequest request) {
        Instant now = Instant.now();

        Task newTask = new Task(
                null,
                request.title(),
                request.description(),
                request.dueDate(),
                TaskStatus.OPEN,
                request.priority(),
                now,
                now
        );
        return taskRepository.save(newTask);
    }

    @Override
    public List<Task> listTask() {
        return taskRepository.findAll(Sort.by(Sort.Direction.ASC,"created"));
    }
}
