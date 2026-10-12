package com.dfine.oms.module2_product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

// ProductVariant entity mapped to product_variant table in MySQL
@Entity
@Table(name = "product_variant")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Integer variantId;

    // Foreign key to the parent product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Unique SKU code (e.g. TEE-BLK-M)
    @Column(name = "sku", nullable = false, unique = true, length = 50)
    private String sku;

    // Size label (size is a reserved keyword in MySQL, so size_label is used)
    @Column(name = "size_label", nullable = false, length = 10)
    private String sizeLabel;

    // Color of the garment
    @Column(name = "color", length = 30)
    private String color;

    // Available inventory count for this SKU
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    // Low stock warning limit (defaults to 5)
    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 5;

    // Image specific to this color or variant
    @Column(name = "variant_image_url")
    private String variantImageUrl;

    // Optimistic locking version column to prevent race conditions during checkout
    @Version
    @Column(name = "lock_version")
    private Integer lockVersion = 0;

    public ProductVariant() {
    }

    public ProductVariant(Product product, String sku, String sizeLabel, String color, Integer stockQuantity, Integer lowStockThreshold) {
        this.product = product;
        this.sku = sku;
        this.sizeLabel = sizeLabel;
        this.color = color;
        this.stockQuantity = stockQuantity;
        this.lowStockThreshold = lowStockThreshold;
    }

    public Integer getVariantId() {
        return variantId;
    }

    public void setVariantId(Integer variantId) {
        this.variantId = variantId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getSizeLabel() {
        return this.sizeLabel;
    }

    public void setSizeLabel(String sizeLabel) {
        this.sizeLabel = sizeLabel;
    }

    // Alias helper to keep existing code and tests calling getSize working
    public String getSize() {
        return this.sizeLabel;
    }

    public void setSize(String size) {
        this.sizeLabel = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public Integer getLockVersion() {
        return this.lockVersion;
    }

    public void setLockVersion(Integer lockVersion) {
        this.lockVersion = lockVersion;
    }

    // Alias helper for getVersion
    public Integer getVersion() {
        return this.lockVersion;
    }

    public void setVersion(Integer version) {
        this.lockVersion = version;
    }

    public String getVariantImageUrl() {
        return variantImageUrl;
    }

    public void setVariantImageUrl(String variantImageUrl) {
        this.variantImageUrl = variantImageUrl;
    }
}
