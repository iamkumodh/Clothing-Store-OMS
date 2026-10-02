package com.defineoms.defineoms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    private Integer id;
    private Double basePrice;
    private Integer stockQuantity;

    public ProductVariant() {
    }

    public ProductVariant(Integer id, Double basePrice, Integer stockQuantity) {
        this.id = id;
        this.basePrice = basePrice;
        this.stockQuantity = stockQuantity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}