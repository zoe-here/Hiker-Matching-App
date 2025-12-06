package com.matchme.exceptions;

public class ConnectionAlreadyExistsException extends RuntimeException {
    public ConnectionAlreadyExistsException(String message) {
        super(message);
    }
}
