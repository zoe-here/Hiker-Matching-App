package com.matchme.handlers;

import com.matchme.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // This is a reusable "template" method
    // Build a structured error response body as a Map and wraps it in a ResponseEntity
    private ResponseEntity<Object> buildErrorResponse(Exception exception, HttpStatus status) {
        // Create a Map to build the JSON body directly
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase()); // "Conflict", "Not Found"
        body.put("message", exception.getMessage()); // The specific error message from the exception
        // Return the Map as the response body with the given status
        return new ResponseEntity<>(body, status);
    }

    // Handler for UserAlreadyExistException
    @ExceptionHandler(UserAlreadyExistException.class)
    public ResponseEntity<Object> handleUserAlreadyExist(UserAlreadyExistException ex) {
        return buildErrorResponse(ex, HttpStatus.CONFLICT); // Return 409
    }

    // Handler for ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND); // Return 404
    }

    // Handler for login failures
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex) {
        return buildErrorResponse(ex, HttpStatus.UNAUTHORIZED); // Return 401
    }

    // Handler for permission denied errors
    // We treat access denied error the same as a "not found"
    // to avoid revealing the existence of a resource to unauthorized users
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex) {
        ResourceNotFoundException notFoundException = new ResourceNotFoundException(
                "The requested resource was not found or you do not have permission to access it."
        );
        return buildErrorResponse(notFoundException, HttpStatus.NOT_FOUND); // Return 404
    }

    // Handler for user's profile not completed
    @ExceptionHandler(ProfileNotCompleteException.class)
    public ResponseEntity<Object> handleProfileNotComplete(ProfileNotCompleteException ex) {
        return buildErrorResponse(ex, HttpStatus.FORBIDDEN); // Return 403
    }

    // Handler for connection already exist
    @ExceptionHandler(ConnectionAlreadyExistsException.class)
    public ResponseEntity<Object> handleConnectionAlreadyExists(ConnectionAlreadyExistsException ex) {
        return buildErrorResponse(ex, HttpStatus.CONFLICT); // Return 409
    }

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<Object> handleInvalidRequest(InvalidRequestException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST); // Return 400
    }

}
