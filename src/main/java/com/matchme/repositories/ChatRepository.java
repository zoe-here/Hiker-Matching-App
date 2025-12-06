package com.matchme.repositories;

import com.matchme.entities.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    // Find a chat by connection ID
    Optional<Chat> findByConnectionId(Long connectionId);

    // Find all chats that a specific user is a part of, sort by latest message
    List<Chat> findByUser1IdOrUser2IdOrderByLastMessageAtDesc(Long userId, Long userIdAgain);

    // Check if user is part of this chat
    @Query("""
        SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
        FROM Chat c
        WHERE c.id = :chatId AND (c.user1Id = :userId OR c.user2Id = :userId)
    """)
    boolean isUserInChat(@Param("chatId") Long chatId, @Param("userId") Long userId);
}
