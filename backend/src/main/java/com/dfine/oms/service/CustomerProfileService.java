package com.dfine.dfineoms.service;

import com.dfine.dfineoms.entity.Customer;
import com.dfine.dfineoms.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomerProfileService {

    @Autowired
    private CustomerRepository customerRepository;

    // fetch profile data on load
    public Customer getProfileByEmail(String email) {
        // finds the customer linked to the JWT email
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found for email: " + email));
    }

    // saves updated profile data
    public void updateProfile(String email, Map<String, String> updatedProfile) {
        // fetches the existing record
        Customer existingCustomer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found for email: " + email));

        // updates the entity with the new values from the React frontend
        existingCustomer.setFirstName(updatedProfile.get("firstName"));
        existingCustomer.setLastName(updatedProfile.get("lastName"));
        existingCustomer.setContactNumber(updatedProfile.get("contactNumber"));
        existingCustomer.setShippingAddress(updatedProfile.get("shippingAddress"));
        existingCustomer.setCity(updatedProfile.get("city"));
        existingCustomer.setDistrict(updatedProfile.get("district"));
        existingCustomer.setProvince(updatedProfile.get("province"));
        existingCustomer.setPostalCode(updatedProfile.get("postalCode"));

        // saves the changes back to the database
        customerRepository.save(existingCustomer);
    }
}
