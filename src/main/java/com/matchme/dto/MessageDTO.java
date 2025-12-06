package com.matchme.dto;

import com.matchme.entities.Message;

import java.time.LocalDateTime;

public record MessageDTO(
        Long messageId,
        Long senderId,
        Long chatId,
        String content,
        LocalDateTime createdAt
) {
    public static MessageDTO fromEntity(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getSenderId(),
                message.getChatId(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
