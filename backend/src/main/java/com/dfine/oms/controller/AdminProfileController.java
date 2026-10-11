package com.dfine.dfineoms.controller;

import com.dfine.dfineoms.service.StaffProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProfileController {

    @Autowired
    private StaffProfileService staffProfileService;

    @GetMapping
    public ResponseEntity<?> getProfile(Principal principal) {
        Object profileData = staffProfileService.getProfileByEmail(principal.getName());
        return ResponseEntity.ok(profileData);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updateData, Principal principal) {
        staffProfileService.updateProfile(principal.getName(), updateData);
        return ResponseEntity.ok("Staff profile updated successfully");
    }
}