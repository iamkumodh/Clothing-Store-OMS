package com.dfine.oms.module2_product.controller;

import com.dfine.oms.module2_product.dto.ReviewDto;
import com.dfine.oms.module2_product.dto.SubmitReviewRequest;
import com.dfine.oms.module2_product.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

// REST Controller managing customer review submissions
@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Customer submits a review with star rating (1-5) and comment
    @PostMapping("/products/{id}/reviews")
    public ResponseEntity<Map<String, String>> submitReview(
            @PathVariable Integer id,
            @RequestBody SubmitReviewRequest request) {
        reviewService.submitReview(id, request);
        return new ResponseEntity<>(Map.of("message", "Review submitted successfully"), HttpStatus.CREATED);
    }

    // Retrieve approved reviews for customer product details page
    @GetMapping("/products/{id}/reviews")
    public ResponseEntity<List<ReviewDto>> getProductReviews(@PathVariable Integer id) {
        List<ReviewDto> reviews = reviewService.getApprovedReviewsByProduct(id);
        return ResponseEntity.ok(reviews);
    }

    // Retrieve all reviews for a product (staff view)
    @GetMapping("/products/{id}/reviews/all")
    public ResponseEntity<List<ReviewDto>> getAllProductReviews(@PathVariable Integer id) {
        List<ReviewDto> reviews = reviewService.getAllReviewsByProduct(id);
        return ResponseEntity.ok(reviews);
    }

    // Retrieve all reviews across the whole store
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        List<ReviewDto> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
}
