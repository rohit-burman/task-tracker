package com.rohit.TaskApp.controller;

import com.rohit.TaskApp.domain.dto.ErrorResponseDto;
import com.rohit.TaskApp.execption.TaskNotFoundExecption;
import org.springframework.beans.MethodInvocationException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExecptionHandler {

    @ExceptionHandler(MethodInvocationException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExecption(MethodArgumentNotValidException ex){
        String errorMessage = ex.getBindingResult().getFieldErrors().stream().findFirst()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .orElse("validation failed");

        System.out.println("*****************************************");
        System.out.println(ex.getBindingResult().getFieldErrors());
        System.out.println("*****************************************");

        ErrorResponseDto errorDto = new ErrorResponseDto(errorMessage);

        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({TaskNotFoundExecption.class})
    public ResponseEntity<ErrorResponseDto> handleExceptions(
            TaskNotFoundExecption ex) {

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(
                String.format("Task with ID '%s' not found", ex.getId())
        );
        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }
}
