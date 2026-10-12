package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.ReviewDto;
import com.dfine.oms.module2_product.dto.SubmitReviewRequest;
import com.dfine.oms.module2_product.entity.Product;
import com.dfine.oms.module2_product.entity.ProductReview;
import com.dfine.oms.module2_product.repository.ProductRepository;
import com.dfine.oms.module2_product.repository.ProductReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

// Service implementation managing customer review submissions and staff moderation
@Service
public class ReviewServiceImpl implements ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewServiceImpl(ProductReviewRepository reviewRepository,
                             ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    // Customer submits a review; validates rating (1-5) and prevents duplicate submission
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void submitReview(Integer productId, SubmitReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with id: " + productId));

        if (request.rating() < 1 || request.rating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5 stars");
        }

        // Check if customer already submitted a review for this garment
        boolean alreadyReviewed = reviewRepository.existsByProduct_ProductIdAndCustomerId(productId, request.customerId());
        if (alreadyReviewed) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer has already submitted a review for this product");
        }

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setCustomerId(request.customerId());
        review.setRating((short) request.rating());
        review.setReviewComment(request.comment());
        review.setApproved(true);

        reviewRepository.save(review);
    }

    // Retrieve approved reviews for customer product page
    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> getApprovedReviewsByProduct(Integer productId) {
        return reviewRepository.findByProduct_ProductIdAndIsApprovedTrue(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Retrieve all reviews for a product regardless of approval status
    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> getAllReviewsByProduct(Integer productId) {
        return reviewRepository.findByProduct_ProductId(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Retrieve all reviews across the whole system
    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Retrieve pending reviews awaiting moderation
    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> getPendingReviews() {
        return reviewRepository.findByIsApprovedFalse().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Staff approves a review
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approveReview(Integer reviewId) {
        moderateReview(reviewId, true);
    }

    // Staff moderates a review (approves or unapproves)
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void moderateReview(Integer reviewId, boolean isApproved) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with id: " + reviewId));
        review.setApproved(isApproved);
        reviewRepository.save(review);
    }

    // Helper method to convert ProductReview entity into ReviewDto
    private ReviewDto mapToDto(ProductReview review) {
        return new ReviewDto(
                review.getReviewId(),
                review.getCustomerId(),
                review.getRating(),
                review.getReviewComment(),
                review.getCreatedAt()
        );
    }
}
