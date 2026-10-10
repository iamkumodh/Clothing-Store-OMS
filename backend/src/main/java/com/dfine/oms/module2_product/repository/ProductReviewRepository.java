package com.dfine.oms.module2_product.repository;

import com.dfine.oms.module2_product.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// Repository interface for customer reviews and moderation
@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {

    // Check if customer has already submitted a review for this product
    boolean existsByProduct_ProductIdAndCustomerId(Integer productId, Integer customerId);

    // Retrieve only approved reviews to show on the public product page
    List<ProductReview> findByProduct_ProductIdAndIsApprovedTrue(Integer productId);

    // Retrieve all reviews for a product regardless of approval status (for staff view)
    List<ProductReview> findByProduct_ProductId(Integer productId);

    // Retrieve pending reviews awaiting staff moderation
    List<ProductReview> findByIsApprovedFalse();

    // Retrieve all reviews ordered by newest submission first
    List<ProductReview> findAllByOrderByCreatedAtDesc();
}
