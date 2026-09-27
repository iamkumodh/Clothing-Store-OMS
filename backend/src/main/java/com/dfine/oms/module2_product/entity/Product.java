package com.dfine.oms.module2_product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// maps to 'product' table in MySQL
@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    // foreign key linking garment to its category
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_description", columnDefinition = "TEXT")
    private String productDescription;

    // target audienceX
    @Column(name = "gender_target", length = 20)
    private String genderTarget;

    // base price in LKR
    @Column(name = "base_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal basePrice;

    // main display image url for web catalog
    @Column(name = "main_image_url", nullable = false)
    private String mainImageUrl;

    // soft delete flag: true = active in catalog
    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Product() {
    }

    public Product(String productName, String productDescription, BigDecimal basePrice,
            String genderTarget, String mainImageUrl, Category category) {
        this.productName = productName;
        this.productDescription = productDescription;
        this.basePrice = basePrice;
        this.genderTarget = genderTarget;
        this.mainImageUrl = mainImageUrl;
        this.category = category;
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
    }

    public Integer getProductId() {
        return this.productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Category getCategory() {
        return this.category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getProductName() {
        return this.productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return this.productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public String getDescription() {
        return this.productDescription;
    }

    public void setDescription(String description) {
        this.productDescription = description;
    }

    public String getGenderTarget() {
        return this.genderTarget;
    }

    public void setGenderTarget(String genderTarget) {
        this.genderTarget = genderTarget;
    }

    public BigDecimal getBasePrice() {
        return this.basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public String getMainImageUrl() {
        return this.mainImageUrl;
    }

    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }

    public boolean isActive() {
        return this.isActive;
    }

    public void setActive(boolean active) {
        this.isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
