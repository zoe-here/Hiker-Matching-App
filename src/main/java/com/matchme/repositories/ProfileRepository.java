package com.matchme.repositories;

import com.matchme.enums.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.matchme.entities.Profile;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long>{
    boolean existsByEmail(String email);

    Optional<Profile> findByEmail(String email);

    // Find candidates in a specific region, excluding the requester themselves
    @Query("SELECT p FROM Profile p WHERE p.ownRegion = :region AND p.profileCompleted = true AND p.id NOT IN :excludedIds")
    List<Profile> findCandidatesByRegion(@Param("region")Region region, @Param("excludedIds") List<Long> excludedIds);

    // Find all potential candidates, excluding a given list of IDs
    @Query("SELECT p FROM Profile p WHERE p.profileCompleted = true AND p.id NOT IN :excludedIds")
    List<Profile> findAllCandidates(@Param("excludedIds") List<Long> excludedIds);
}

