package com.rohit.TaskApp.domain.dto;

import com.rohit.TaskApp.domain.entity.TaskPriority;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;

public record CreateTaskRequestDto(
        @NotBlank(message = ERROR_MESSAGE_TITLE_LENGTH)
        @Length(max = 255, message = ERROR_MESSAGE_TITLE_LENGTH)
        String title,

        @Length(max = 1000, message = ERROR_MESSAGE_DESC_LENGTH)
        String description,

        @FutureOrPresent(message = ERROR_MESSAGE_DD)
        LocalDate dueDate,

        @NotNull(message = ERROR_MESSAGE_PRIORITY)
        TaskPriority priority
) {
    private static final String ERROR_MESSAGE_TITLE_LENGTH = "Title must be between 1 and 255 characters";
    private static final String ERROR_MESSAGE_DESC_LENGTH = "Description must be less than 1000 characters";
    private static final String ERROR_MESSAGE_DD = "Date should be in future";
    private static final String ERROR_MESSAGE_PRIORITY = "Priority must be provided";
}
