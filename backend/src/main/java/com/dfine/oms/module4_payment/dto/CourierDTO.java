package com.dfine.oms.module4_payment.dto;



public class CourierDTO {

    private String courierName;
    private String contactNumber;
    private String trackingApiUrl;

    public CourierDTO() {
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
}
