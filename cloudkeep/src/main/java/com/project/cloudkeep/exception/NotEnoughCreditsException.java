package com.project.cloudkeep.exception;

public class NotEnoughCreditsException extends RuntimeException{
    public NotEnoughCreditsException(String message){
        super(message);
    }
}
