package com.dfine.oms.module4_payment.entity;

import jakarta.persistence.*;

// Represents a third-party courier delivery partner (e.g., Domex, Pronto, Prompt Xpress).
@Entity
@Table(name = "courier_partner")
public class CourierPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "courier_id")
    private Integer courierId;

    @Column(name = "courier_name", nullable = false, unique = true, length = 100)
    private String courierName;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(name = "tracking_api_url", nullable = false, length = 255)
    private String trackingApiUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public CourierPartner() {
    }

    public CourierPartner(String courierName, String contactNumber, String trackingApiUrl, Boolean isActive) {
        this.courierName = courierName;
        this.contactNumber = contactNumber;
        this.trackingApiUrl = trackingApiUrl;
        this.isActive = isActive != null ? isActive : true;
    }

    public Integer getCourierId() {
        return courierId;
    }

    public void setCourierId(Integer courierId) {
        this.courierId = courierId;
    }

    public String getCourierName() {
        return courierName;
    }

    public void setCourierName(String courierName) {
        this.courierName = courierName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getTrackingApiUrl() {
        return trackingApiUrl;
    }

    public void setTrackingApiUrl(String trackingApiUrl) {
        this.trackingApiUrl = trackingApiUrl;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}
