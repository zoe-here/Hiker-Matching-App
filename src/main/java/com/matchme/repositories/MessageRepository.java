package com.matchme.repositories;

import com.matchme.entities.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Fetch messages by chat, ordered, paginated
    Page<Message> findByChatIdOrderByCreatedAtDesc(Long chatId, Pageable pageable);
    // Fetch a page of messages in a given chat with IDs less than the specified cursor
    Page<Message> findByChatIdAndIdLessThanOrderByIdDesc(Long chatId, Long beforeId, Pageable pageable);
}
