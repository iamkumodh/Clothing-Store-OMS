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

    // Size of the garment
    @Column(name = "size", length = 10)
    private String size;

    // Color of the garment
    @Column(name = "color", length = 30)
    private String color;

    // Available inventory count for this SKU
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    // Low stock warning limit (defaults to 5)
    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 5;

    // Optimistic locking version column to prevent race conditions during checkout
    @Version
    @Column(name = "version")
    private Long version;

    public ProductVariant() {
    }

    public ProductVariant(Product product, String sku, String size, String color, Integer stockQuantity, Integer lowStockThreshold) {
        this.product = product;
        this.sku = sku;
        this.size = size;
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

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
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

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
