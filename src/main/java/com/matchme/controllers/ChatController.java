package com.matchme.controllers;

import com.matchme.dto.ChatDTO;
import com.matchme.dto.ChatListDTO;
import com.matchme.dto.MessageDTO;
import com.matchme.dto.SendMessageRequest;
import com.matchme.services.ChatService;
import com.matchme.services.CustomUserDetails;
import com.matchme.services.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/chats")
public class ChatController {
    private final ChatService chatService;
    private final MessageService messageService;

    public ChatController(ChatService chatService, MessageService messageService) {
        this.chatService = chatService;
        this.messageService = messageService;
    }

    @GetMapping
    public ResponseEntity<List<ChatListDTO>> findAllChats(@AuthenticationPrincipal CustomUserDetails user) {
        Long currentUserId = user.getId();
        List<ChatListDTO> chats = chatService.getAllChats(currentUserId);
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/{connectionId}")
    public ResponseEntity<ChatDTO> openChat(@PathVariable Long connectionId,
                                           @AuthenticationPrincipal CustomUserDetails user) {
        Long currentUserId = user.getId();
        ChatDTO chat = chatService.findOrCreateChatAndGetHistory(connectionId, currentUserId);
        return ResponseEntity.ok(chat);
    }

    // Send message using chatId
    @PostMapping("/{chatId}/messages")
    public ResponseEntity<MessageDTO> sendMessage(@PathVariable Long chatId,
                                                  @RequestBody @Valid SendMessageRequest request,
                                                  @AuthenticationPrincipal CustomUserDetails user) {
        Long currentUserId = user.getId();
        MessageDTO message = messageService.sendMessage(chatId, request.content(), currentUserId);
        return ResponseEntity.ok(message);
    }

    // To fetch older messages before a given message ID (for infinite scroll)
    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<MessageDTO>> getOlderMessages(
        @PathVariable Long chatId,
        @RequestParam Long beforeId,
        @AuthenticationPrincipal CustomUserDetails user
    ) {
        List<MessageDTO> messages = chatService.loadOlderMessages(chatId, beforeId, user.getId());
        return ResponseEntity.ok(messages);
    }
}
