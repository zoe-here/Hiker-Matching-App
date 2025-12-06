package com.matchme.services;

import com.matchme.dto.ChatDTO;
import com.matchme.dto.ChatListDTO;
import com.matchme.dto.MessageDTO;
import com.matchme.entities.Chat;
import com.matchme.entities.Connection;
import com.matchme.entities.Message;
import com.matchme.enums.ConnectionStatus;
import com.matchme.exceptions.InvalidRequestException;
import com.matchme.repositories.ChatRepository;
import com.matchme.repositories.ConnectionRepository;
import com.matchme.repositories.MessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ChatService {
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private final ChatRepository chatRepository;
    private final ConnectionRepository connectionRepository;
    private static final int PAGE_SIZE = 20;
    private final MessageRepository messageRepository;


    public ChatService(ChatRepository chatRepository, ConnectionRepository connectionRepository, MessageRepository messageRepository) {
        this.chatRepository = chatRepository;
        this.connectionRepository = connectionRepository;
        this.messageRepository = messageRepository;
    }

    @Transactional
    public ChatDTO findOrCreateChatAndGetHistory(Long connectionId, Long currentUserId) {
        // Find or create a Chat
        Chat chat = findOrCreateChat(connectionId, currentUserId);
        updateLastReadAt(currentUserId, chat);
        // Create a pageable object to get the latest messages (most recent first)
        Pageable pageable = PageRequest.of(0, PAGE_SIZE, Sort.by(Sort.Direction.DESC, "createdAt"));
        // Fetch the paginated messages (latest first)
        Page<Message> messagePage = messageRepository.findByChatIdOrderByCreatedAtDesc(chat.getId(), pageable);
        logger.info("Fetched {} messages for chat {} for user {}",
                messagePage.getNumberOfElements(), chat.getId(), currentUserId);
        // Convert the Message entities into MessageDTOs and reverse to show oldest first in UI
        List<MessageDTO> messages = messagePage.getContent().stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
        // Reverse the list so oldest messages appear first in the chat UI
        Collections.reverse(messages);
        Long otherUserId = getOtherUserId(chat, currentUserId);
        return new ChatDTO(chat.getId(), otherUserId, chat.getLastMessageAt(), messages);
    }

    // Helper method to safely find or create a chat
    private Chat findOrCreateChat(Long connectionId, Long currentUserId) {
        // Find the connection ONLY if it is ACCEPTED
        Connection connection = connectionRepository.findByIdAndStatus(connectionId, ConnectionStatus.ACCEPTED)
                .orElseThrow(() -> new InvalidRequestException("Chat requires an active connection!"));
        verifyUser(connection, currentUserId);
        return chatRepository.findByConnectionId(connectionId)
                .orElseGet(() -> createChat(connection));
    }

    // Helper function to check if the user is part of the connection
    private void verifyUser(Connection connection, Long currentUserId) {
        if (!currentUserId.equals(connection.getRequester().getId()) &&
            !currentUserId.equals(connection.getRecipient().getId())) {
            throw new AccessDeniedException("You do not have permission to access it");
        }
    }

    // Helper function to safely create a Chat
    private Chat createChat(Connection connection) {
        try {
            Long user1Id = connection.getRequester().getId();
            Long user2Id = connection.getRecipient().getId();

            Chat newChat = new Chat();
            newChat.setConnectionId(connection.getId());
            newChat.setUser1Id(Math.min(user1Id, user2Id));
            newChat.setUser2Id(Math.max(user1Id, user2Id));
            newChat.setLastMessageAt(null);
            return chatRepository.save(newChat);
        } catch (DataIntegrityViolationException e) {
            logger.warn("Race condition handled while creating chat for connection {}", connection.getId(), e);
            // If another thread created it first, fetch it instead
            return chatRepository.findByConnectionId(connection.getId())
                    .orElseThrow(() -> e);
        }
    }

    public void updateLastReadAt(Long currentUserId, Long chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new AccessDeniedException("Chat not found"));
        // Verify user is part of this chat
        if (!currentUserId.equals(chat.getUser1Id()) && !currentUserId.equals(chat.getUser2Id())) {
            throw new AccessDeniedException("You do not have permission to update this chat");
        }
        // Update the last read timestamp for the current user
        updateLastReadAt(currentUserId, chat);
        chatRepository.save(chat);
    }

    // Helper function to update last read at
    private void updateLastReadAt(Long currentUserId, Chat chat) {
        if (currentUserId.equals(chat.getUser1Id())) {
            chat.setUser1LastReadAt(LocalDateTime.now());
        } else {
            chat.setUser2LastReadAt(LocalDateTime.now());
        }
    }

    public List<ChatListDTO> getAllChats(Long currentUserId) {
        // Get all chats involving the current user
        List<Chat> chats = chatRepository.findByUser1IdOrUser2IdOrderByLastMessageAtDesc(currentUserId, currentUserId);
        return chats.stream()
                    .map(chat -> mapToChatListDTO(chat, currentUserId))
                    .collect(Collectors.toList());
    }

    // Helper function to determine unread status
    private boolean hasUnread(Chat chat, Long currentUserId) {
        LocalDateTime lastReadAt = currentUserId.equals(chat.getUser1Id())
                ? chat.getUser1LastReadAt()
                : chat.getUser2LastReadAt();
        return chat.getLastMessageAt() != null &&
                (lastReadAt == null || chat.getLastMessageAt().isAfter(lastReadAt));
    }

    // Helper function to determine other user's ID
    private Long getOtherUserId(Chat chat, Long currentUserId) {
        if (currentUserId.equals(chat.getUser1Id())) return chat.getUser2Id();
        if (currentUserId.equals(chat.getUser2Id())) return chat.getUser1Id();
        throw new AccessDeniedException("User is not part of this chat");
    }

    // Helper function for mapping to DTO
    private ChatListDTO mapToChatListDTO(Chat chat, Long currentUserId) {
        Long otherUserId = getOtherUserId(chat, currentUserId);
        boolean hasUnread = hasUnread(chat, currentUserId);
        return new ChatListDTO(
                chat.getId(),
                chat.getConnectionId(),
                otherUserId,
                chat.getLastMessageAt(),
                hasUnread
        );
    }

    // Loads older chat messages before a given message ID, for infinite scroll on chat history
    @Transactional(readOnly = true)
    public List<MessageDTO> loadOlderMessages(Long chatId, Long beforeMessageId, Long currentUserId) {
        // Make sure the user is part of this chat
        if (!chatRepository.isUserInChat(chatId, currentUserId)) {
            throw new AccessDeniedException("User is not part of this chat");
        }
        // Default sort is by ID DESC via repository
        Pageable pageable = PageRequest.of(0, PAGE_SIZE);
        Page<Message> messagePage = messageRepository.findByChatIdAndIdLessThanOrderByIdDesc(chatId, beforeMessageId, pageable);
        List<MessageDTO> messages = new ArrayList<>(
                messagePage.getContent().stream()
                        .map(MessageDTO::fromEntity)
                        .toList()
        );
        // Reverse to maintain chronological order for UI
        Collections.reverse(messages);
        return messages;
    }
}
