package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.ReviewDto;
import com.dfine.oms.module2_product.dto.SubmitReviewRequest;

import java.util.List;

// Service interface for customer reviews and staff moderation
public interface ReviewService {

    // Customer submits a star rating (1-5) and comment
    void submitReview(Integer productId, SubmitReviewRequest request);

    // Get approved reviews to display on the customer storefront
    List<ReviewDto> getApprovedReviewsByProduct(Integer productId);

    // Get all reviews for a product (staff view)
    List<ReviewDto> getAllReviewsByProduct(Integer productId);

    // Get all reviews in the system ordered by newest first
    List<ReviewDto> getAllReviews();

    // Get all unapproved reviews waiting for staff moderation
    List<ReviewDto> getPendingReviews();

    // Staff approves review
    void approveReview(Integer reviewId);

    // Staff moderates review (can approve or reject)
    void moderateReview(Integer reviewId, boolean isApproved);
}
