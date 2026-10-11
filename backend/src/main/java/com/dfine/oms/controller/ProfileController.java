package com.dfine.dfineoms.controller;

import com.dfine.dfineoms.service.CustomerProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    @Autowired
    private CustomerProfileService profileService;

    // Handles the on-load fetch
    @GetMapping
    public ResponseEntity<?> getProfile(Principal principal) {
        // principal.getName() safely extracts the email from the JWT
        Object profileData = profileService.getProfileByEmail(principal.getName());
        return ResponseEntity.ok(profileData);
    }

    // Handles the "Update Profile" form submission
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updateData, Principal principal) {
        // Passes the update data to the service layer we built earlier
        profileService.updateProfile(principal.getName(), updateData);
        return ResponseEntity.ok("Profile updated successfully");
    }
}