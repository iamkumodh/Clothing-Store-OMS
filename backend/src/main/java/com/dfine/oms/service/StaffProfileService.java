package com.dfine.dfineoms.service;

import com.dfine.dfineoms.entity.StoreStaff;
import com.dfine.dfineoms.repository.StoreStaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class StaffProfileService {

    @Autowired
    private StoreStaffRepository staffRepository;

    public StoreStaff getProfileByEmail(String email) {
        return staffRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Staff profile not found for email: " + email));
    }

    public void updateProfile(String email, Map<String, String> updatedProfile) {
        StoreStaff existingStaff = staffRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Staff profile not found for email: " + email));

        // staff tables do not have shipping addresses, therefore only updates names
        existingStaff.setFirstName(updatedProfile.get("firstName"));
        existingStaff.setLastName(updatedProfile.get("lastName"));

        staffRepository.save(existingStaff);
    }
}
