package com.matchme.dto;

import java.time.LocalDateTime;

public record ChatListDTO(
        Long chatId,
        Long connectionId,
        Long otherUserId,
        LocalDateTime lastMessageAt,
        boolean hasUnread
) {}
