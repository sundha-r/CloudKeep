package com.project.cloudkeep.exception;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<?> handleDuplicateEmailException(DuplicateKeyException e){
        Map<String,Object> data=new HashMap<>();
        data.put("status", HttpStatus.CONFLICT);
        data.put("message",e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(data);
    }

    @ExceptionHandler(NotEnoughCreditsException.class)
    public ResponseEntity<?> handleNotEnoughCreditsException(NotEnoughCreditsException e){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
