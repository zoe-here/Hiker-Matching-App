package com.matchme.dto;

import com.matchme.entities.Chat;

import java.time.LocalDateTime;
import java.util.List;

public record ChatDTO(
        Long chatId,
        Long otherUserId,
        LocalDateTime lastMessageAt,
        List<MessageDTO> messages
) {}
