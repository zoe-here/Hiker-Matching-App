package com.matchme.services;

import com.matchme.entities.Dismissal;
import com.matchme.entities.Profile;
import com.matchme.enums.*;
import com.matchme.exceptions.ProfileNotCompleteException;
import com.matchme.exceptions.ResourceNotFoundException;
import com.matchme.repositories.ConnectionRepository;
import com.matchme.repositories.DismissalRepository;
import com.matchme.repositories.ProfileRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);
    private final ProfileRepository profileRepository;
    private final DismissalRepository dismissalRepository;
    private final ConnectionRepository connectionRepository;
    private final ConnectionService connectionService;
    private final RelationshipService relationshipService;

    public RecommendationService(ProfileRepository profileRepository, DismissalRepository dismissalRepository, 
                               ConnectionRepository connectionRepository, ConnectionService connectionService,
                                 RelationshipService relationshipService) {
        this.profileRepository = profileRepository;
        this.dismissalRepository = dismissalRepository;
        this.connectionRepository = connectionRepository;
        this.connectionService = connectionService;
        this.relationshipService = relationshipService;
    }

    public List<Long> getRecommendations(Long userId) {
        // 1. Check if user's profile is complete
        Profile user = profileRepository.findById(userId).
                orElseThrow(() -> new ResourceNotFoundException("User profile not found with id: " + userId));
        if (!user.isProfileCompleted()) {
            throw new ProfileNotCompleteException("Profile must be complete to see recommendations");
        }
        // 2. Get a candidate pool (location filter, exclude self/connections/dismissals)
        List<Profile> candidatePool = getCandidatePool(user);
        // 3. Score each candidate from the pool
        Map<Long, Integer> scoredCandidates = new HashMap<>();
        for (Profile candidate : candidatePool) {
            int score = calculateScore(user, candidate);
            if (score > 20) { // Filter out weak recommendations
                scoredCandidates.put(candidate.getId(), score);
            }
        }
        // 4. sort the strong matches and return top 10
        List<Long> recommendedList = scoredCandidates.entrySet().stream()
                    .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                    .limit(10)
                    .map(Map.Entry::getKey) // Only get ID
                    .toList();
        relationshipService.setRecommendedUsersCache(userId, recommendedList);
        return recommendedList;
    }

    // Helper function to handle all pre-filtering based on location and exclusions
    private List<Profile> getCandidatePool(Profile user) {
        Long userId = user.getId();
        List<Long> dismissedIds = dismissalRepository.findDismissedUserIdsByUserId(userId);
        List<Long> excludedIds = new ArrayList<>(dismissedIds); // Exclude dismissed users
        
        List<Long> connectedIds = connectionRepository.findConnectedUserIds(userId);
        excludedIds.addAll(connectedIds); // Exclude connected users
        
        // Exclude users with pending incoming requests  
        List<Long> incomingRequestUserIds = connectionService.getIncomingRequests().stream()
                .map(connection -> connection.getRequester().getId())
                .toList();
        excludedIds.addAll(incomingRequestUserIds);
        
        // Exclude users with pending outgoing requests 
        List<Long> outgoingRequestUserIds = connectionService.getOutgoingRequests().stream()
                .map(connection -> connection.getRecipient().getId())
                .toList();
        excludedIds.addAll(outgoingRequestUserIds);
        
        excludedIds.add(userId); // Exclude self

        Region preferredRegion = user.getPreferredRegion();
        if (preferredRegion != null) {
            // Case 1: User has a specific region preference
            return profileRepository.findCandidatesByRegion(preferredRegion, excludedIds);
        } else {
            // Case 2: User has no region preference
            return profileRepository.findAllCandidates(excludedIds);
        }
    }

    private static final int SINGLE_CHOICE_SCORE = 20;
    private static final int MULTI_CHOICE_SCORE = 10;
    // Helper function to implement scoring logic
    private int calculateScore(Profile user, Profile candidate) {
        int score = 0;
        // Score based on Experience, Pace, Hike Types, and Languages
        if (user.getPreferredExperienceLevel() == null) {
            score += SINGLE_CHOICE_SCORE / 2; // +10 for no preference
        } else if (user.getPreferredExperienceLevel() == candidate.getOwnExperienceLevel()){
            score += SINGLE_CHOICE_SCORE; // +20 for exact match
        }
        if (user.getPreferredPace() == null) {
            score += SINGLE_CHOICE_SCORE / 2;
        } else if (user.getPreferredPace() == candidate.getOwnPace()) {
            score += SINGLE_CHOICE_SCORE;
        }

        if (user.getPreferredHikeTypes() == null || user.getPreferredHikeTypes().isEmpty()) {
            score += MULTI_CHOICE_SCORE / 2;
        } else {
            Set<HikeType> commonHikeTypes = new HashSet<>(user.getPreferredHikeTypes());
            commonHikeTypes.retainAll(candidate.getOwnHikeTypes());
            score += commonHikeTypes.size() * MULTI_CHOICE_SCORE;
        }

        if (user.getPreferredLanguages() == null || user.getPreferredLanguages().isEmpty()) {
            score += MULTI_CHOICE_SCORE / 2;
        } else {
            Set<Language> commonLanguages = new HashSet<>(user.getPreferredLanguages());
            commonLanguages.retainAll(candidate.getOwnLanguages());
            score += commonLanguages.size() * MULTI_CHOICE_SCORE;
        }
        return score;
    }

    @Transactional
    public void dismissRecommendation(Long userId, Long dismissedUserId) {
        Profile user = profileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found with id: " + userId));
        Profile dismissedUser = profileRepository.findById(dismissedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Dismissed user not found with id: " + dismissedUserId));
        Dismissal dismissal = new Dismissal();
        dismissal.setUser(user);
        dismissal.setDismissedUser(dismissedUser);
        dismissalRepository.save(dismissal);
        logger.info("User {} dismissed user {}", userId, dismissedUserId);
    }
}
