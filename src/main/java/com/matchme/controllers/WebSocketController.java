package com.matchme.controllers;

import com.matchme.dto.SendMessageRequest;
import com.matchme.dto.TypingEventDTO;
import com.matchme.dto.TypingNotifyDTO;
import com.matchme.exceptions.InvalidRequestException;
import com.matchme.services.ChatService;
import com.matchme.services.CustomUserDetails;
import com.matchme.services.MessageService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
public class WebSocketController {

    private final ChatService chatService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final MessageService messageService;
    private final Validator validator;

    public WebSocketController(SimpMessageSendingOperations messagingTemplate, MessageService messageService, Validator validator, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.validator = validator;
        this.chatService = chatService;
    }

    @MessageMapping("/chat/{chatId}/send")
    public void sendMessage(@DestinationVariable Long chatId,
                           @Payload @Valid SendMessageRequest request,
                           Principal principal) {
        // Get the user from SecurityContext instead of using @AuthenticationPrincipal
        UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) principal;
        CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
        
        Set<ConstraintViolation<SendMessageRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            String errorMsg = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining("; "));
            throw new InvalidRequestException(errorMsg);
        }
        messageService.sendMessage(chatId, request.content(), user.getId());
    }
    @MessageMapping("/chat/{chatId}/markAsRead")
    public void markAsRead(@DestinationVariable Long chatId, Principal principal) {
        // Get the user from SecurityContext instead of using @AuthenticationPrincipal
        UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) principal;
        CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();

        chatService.updateLastReadAt(user.getId(), chatId);
    }

    @MessageMapping("/chat/{chatId}/typing")
    public void handleTyping(
            @DestinationVariable Long chatId,
            @Payload TypingEventDTO event,
            Principal principal
    ) {
        // Get the user from SecurityContext instead of using @AuthenticationPrincipal
        UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) principal;
        CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
        
        TypingNotifyDTO notification = new TypingNotifyDTO(user.getId(), event.type());
        messagingTemplate.convertAndSend("/topic/chat/" + chatId + "/typing", notification);
    }

}
