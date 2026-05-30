package com.rohit.TaskApp.execption;

import java.util.UUID;

public class TaskNotFoundExecption extends RuntimeException {
    public static final String ERROR_MESSAGE = "Task with id '%s' doesn't exists ";
    private final UUID id;

    public TaskNotFoundExecption(UUID id) {
        super(String.format(ERROR_MESSAGE, id));
        this.id = id;
    }

    public UUID getId() {
        return id;
    }
}
