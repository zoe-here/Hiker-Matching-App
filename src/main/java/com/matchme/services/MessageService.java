package com.matchme.services;

import com.matchme.dto.MessageDTO;
import com.matchme.entities.Chat;
import com.matchme.entities.Message;
import com.matchme.exceptions.ResourceNotFoundException;
import com.matchme.repositories.ChatRepository;
import com.matchme.repositories.MessageRepository;
import com.matchme.repositories.ProfileRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.repository.CrudRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class MessageService {
    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);
    
    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private ProfileRepository profileRepository;

    public MessageService(MessageRepository messageRepository, 
                         ChatRepository chatRepository,
                         SimpMessagingTemplate messagingTemplate,
                         ProfileRepository profileRepository) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
        this.messagingTemplate = messagingTemplate;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public MessageDTO sendMessage(Long chatId, String content, Long currentUserId) {
        // 1. Validate chat exists
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat not found"));
        
        // 2. Verify user is part of this chat
        if (!currentUserId.equals(chat.getUser1Id()) && !currentUserId.equals(chat.getUser2Id())){
            throw new AccessDeniedException("You do not have permission to use this chat");
        }

        // 3. Create and save the message
        Message message = new Message();
        message.setChatId(chatId);
        message.setSenderId(currentUserId);
        message.setContent(content);
        message = messageRepository.save(message);
        
        // 4. Update the managed 'chat' entity in one go
        // JPA will persist these changes automatically on transaction commit
        chat.setLastMessageAt(LocalDateTime.now());
        // Update the sender's read timestamp so their own message isn't "unread"
        if (currentUserId.equals(chat.getUser1Id())){
            chat.setUser1LastReadAt(LocalDateTime.now());
        } else {
            chat.setUser2LastReadAt(LocalDateTime.now());
        }
        
        // 5. Create DTO and broadcast
        MessageDTO messageDTO = MessageDTO.fromEntity(message);
        broadcastMessageToChat(chat, messageDTO);
        
        logger.info("Message sent from user {} via chat {}", currentUserId, chatId);
        return messageDTO;
    }

    private void broadcastMessageToChat(Chat chat, MessageDTO messageDTO) {
        // Send to both users in the chat using their user IDs, for the live chat view
        String chatTopic = "/topic/chat/" + chat.getId();
        messagingTemplate.convertAndSend(chatTopic, messageDTO);

        String user1Email = profileRepository.findById(chat.getUser1Id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getEmail();

        String user2Email = profileRepository.findById(chat.getUser2Id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getEmail();

        // Also send individual notifications for triggering global notifications
        messagingTemplate.convertAndSendToUser(
            user1Email, 
            "/queue/messages", 
            messageDTO
        );
        messagingTemplate.convertAndSendToUser(
            user2Email, 
            "/queue/messages", 
            messageDTO
        );
    }
}
