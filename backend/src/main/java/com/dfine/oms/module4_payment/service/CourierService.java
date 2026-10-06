package com.dfine.oms.module4_payment.service;

import com.dfine.oms.module4_payment.dto.CreateCourierRequest;
import com.dfine.oms.module4_payment.entity.CourierPartner;
import com.dfine.oms.module4_payment.repository.CourierRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Service that manages courier partners (e.g., Domex Express, Pronto Logistics).
@Service
public class CourierService {

    private final CourierRepository courierRepository;

    public CourierService(CourierRepository courierRepository) {
        this.courierRepository = courierRepository;
    }

    // Register a new courier partner using request DTO
    @Transactional(rollbackFor = Exception.class)
    public CourierPartner createCourier(CreateCourierRequest request) {
        CourierPartner courier = new CourierPartner();
        courier.setCourierName(request.courierName());
        courier.setContactNumber(request.contactNumber());
        courier.setTrackingApiUrl(request.trackingApiUrl());
        courier.setIsActive(request.isActive() != null ? request.isActive() : true);
        return courierRepository.save(courier);
    }

    // Save a courier partner entity directly
    @Transactional(rollbackFor = Exception.class)
    public CourierPartner save(CourierPartner courier) {
        if (courier.getIsActive() == null) {
            courier.setIsActive(true);
        }
        return courierRepository.save(courier);
    }

    // Update existing courier details
    @Transactional(rollbackFor = Exception.class)
    public CourierPartner updateCourier(Integer id, CreateCourierRequest request) {
        CourierPartner courier = courierRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Courier partner not found with id: " + id));

        if (request.courierName() != null && !request.courierName().isBlank()) {
            courier.setCourierName(request.courierName());
        }
        if (request.contactNumber() != null && !request.contactNumber().isBlank()) {
            courier.setContactNumber(request.contactNumber());
        }
        if (request.trackingApiUrl() != null && !request.trackingApiUrl().isBlank()) {
            courier.setTrackingApiUrl(request.trackingApiUrl());
        }
        if (request.isActive() != null) {
            courier.setIsActive(request.isActive());
        }

        return courierRepository.save(courier);
    }

    // Retrieve all courier partners
    @Transactional(readOnly = true)
    public List<CourierPartner> getAll() {
        return courierRepository.findAll();
    }

    // Retrieve only active couriers available for customer selection
    @Transactional(readOnly = true)
    public List<CourierPartner> getActiveCouriers() {
        return courierRepository.findByIsActiveTrue();
    }

    // Look up courier partner by primary key ID
    @Transactional(readOnly = true)
    public CourierPartner getById(Integer id) {
        return courierRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Courier partner not found with id: " + id));
    }

    // Delete or deactivate courier partner
    @Transactional(rollbackFor = Exception.class)
    public void delete(Integer id) {
        CourierPartner courier = courierRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Courier partner not found with id: " + id));
        courierRepository.delete(courier);
    }
}
