package com.dfine.dfineoms.dto;

import java.util.Map;

public class AnalyticsSummary {
    private long totalCustomers;
    private long totalOrders;
    private double totalRevenue;
    private Map<String, Integer> ordersByStatus;

    public AnalyticsSummary(long totalCustomers, long totalOrders, double totalRevenue, Map<String, Integer> ordersByStatus) {
        this.totalCustomers = totalCustomers;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.ordersByStatus = ordersByStatus;
    }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Map<String, Integer> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(Map<String, Integer> ordersByStatus) { this.ordersByStatus = ordersByStatus; }
}