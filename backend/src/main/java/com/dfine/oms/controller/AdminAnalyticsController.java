package com.dfine.dfineoms.controller;

import com.dfine.dfineoms.dto.AnalyticsSummary;
import com.dfine.dfineoms.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminAnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {
        AnalyticsSummary summary = analyticsService.getStoreAnalytics();
        return ResponseEntity.ok(summary);
    }
}