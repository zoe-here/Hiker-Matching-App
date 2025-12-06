package com.matchme.controllers;

import com.matchme.services.RecommendationService;
import com.matchme.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<Long>> getRecommendations() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        List<Long> Ids = recommendationService.getRecommendations(currentUserId);
        return ResponseEntity.ok(Ids);
    }

    @PostMapping("/{id}/dismiss")
    public ResponseEntity<Void> dismissRecommendation(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        recommendationService.dismissRecommendation(currentUserId, id);
        return ResponseEntity.ok().build();
    }
}
