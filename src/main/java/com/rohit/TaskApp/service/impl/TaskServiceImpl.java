package com.rohit.TaskApp.service.impl;

import com.rohit.TaskApp.domain.CreateTaskRequest;
import com.rohit.TaskApp.domain.UpdateTaskRequest;
import com.rohit.TaskApp.domain.entity.Task;
import com.rohit.TaskApp.domain.entity.TaskStatus;
import com.rohit.TaskApp.execption.TaskNotFoundExecption;
import com.rohit.TaskApp.repository.TaskRepository;
import com.rohit.TaskApp.service.TaskService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

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

    @Override
    public Task updateTask(UUID taskId, UpdateTaskRequest request) {
        Task existingTask = taskRepository.findById(taskId).orElseThrow(()-> new TaskNotFoundExecption(taskId));

        existingTask.setTitle(request.title());
        existingTask.setDescription(request.description());
        existingTask.setDueDate(request.dueDate());
        existingTask.setPriority(request.priority());
        existingTask.setStatus(request.status());
        existingTask.setUpdated(Instant.now());

        return taskRepository.save(existingTask);
    }

    @Transactional
    @Override
    public void deleteTask(UUID taskId) {
        taskRepository.deleteById(taskId);
    }
}
