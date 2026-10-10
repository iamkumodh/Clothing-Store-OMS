package com.dfine.oms.module2_product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

// ProductReview entity mapped to product_review table in MySQL
@Entity
@Table(name = "product_review")
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;

    // Garment that was reviewed
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Customer who wrote the review
    @Column(name = "customer_id", nullable = false)
    private Integer customerId;

    // Star rating from 1 to 5
    @Column(name = "rating", nullable = false)
    private short rating;

    // Written review text
    @Column(name = "review_comment", columnDefinition = "TEXT")
    private String reviewComment;

    // Moderation flag; true means review is approved to show on the public page
    @Column(name = "is_approved")
    private boolean isApproved = true;

    // Timestamp when review was submitted
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProductReview() {
    }

    public Integer getReviewId() {
        return this.reviewId;
    }

    public void setReviewId(Integer reviewId) {
        this.reviewId = reviewId;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getCustomerId() {
        return this.customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public short getRating() {
        return this.rating;
    }

    public void setRating(short rating) {
        this.rating = rating;
    }

    public String getReviewComment() {
        return this.reviewComment;
    }

    public void setReviewComment(String reviewComment) {
        this.reviewComment = reviewComment;
    }

    // Alias helper to keep existing DTO mappers and tests calling getComment working
    public String getComment() {
        return this.reviewComment;
    }

    public void setComment(String comment) {
        this.reviewComment = comment;
    }

    public boolean isApproved() {
        return this.isApproved;
    }

    public void setApproved(boolean approved) {
        this.isApproved = approved;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
