package com.dfine.dfineoms.service;

import com.dfine.dfineoms.dto.AnalyticsSummary;
import com.dfine.dfineoms.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private CustomerRepository customerRepository;

    public AnalyticsSummary getStoreAnalytics() {
        // live data from the database
        long totalCustomers = customerRepository.count();

        // mock data for the frontend dashboard
        long totalOrders = 156;
        double totalRevenue = 45250.50;

        Map<String, Integer> orderTrends = new HashMap<>();
        orderTrends.put("DELIVERED", 120);
        orderTrends.put("PENDING", 26);
        orderTrends.put("CANCELED", 10);

        return new AnalyticsSummary(totalCustomers, totalOrders, totalRevenue, orderTrends);
    }
}
