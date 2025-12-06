package com.matchme.repositories;

import com.matchme.entities.Dismissal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DismissalRepository extends JpaRepository<Dismissal, Long> {
    // Find the IDs of all users that have been dismissed by a specific user
    @Query("SELECT d.dismissedUser.id FROM Dismissal d WHERE d.user.id = :userId")
    List<Long> findDismissedUserIdsByUserId(@Param("userId")Long userId);
}
